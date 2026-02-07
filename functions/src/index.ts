import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';
import sgMail from '@sendgrid/mail';

// Initialize Firebase Admin at module level (required for Cloud Functions)
try {
  if (!admin.apps.length) {
    admin.initializeApp();
  }
} catch (error: any) {
  console.warn('Firebase already initialized or init error:', error.message);
}

let db: admin.firestore.Firestore | null = null;
let isInitialized = false;

function initializeServices() {
  if (isInitialized) return;
  
  try {
    console.log('🔧 Initializing services...');
    
    db = admin.firestore();
    console.log('  ✓ Firestore initialized');
    
    const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
    if (SENDGRID_API_KEY) {
      sgMail.setApiKey(SENDGRID_API_KEY);
      console.log('  ✓ SendGrid initialized');
    } else {
      console.warn('  ⚠ SendGrid API key not found');
    }
    
    console.log('✓ Services initialized successfully');
    isInitialized = true;
  } catch (error: any) {
    console.error('❌ Error initializing services:', error.message);
    console.error('Error details:', error);
    throw error;
  }
}

function getDb() {
  if (!isInitialized) {
    initializeServices();
  }
  if (!db) {
    throw new Error('Firestore not initialized');
  }
  return db;
}

// Constants
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || '';
const FROM_EMAIL = 'support@omnipay.cc';
const REGISTRATION_WELCOME_TEMPLATE_ID = 'd-7f75ffd28cd34cb59edcff9a2e1b3696';
const FIRST_PURCHASE_TEMPLATE_ID = 'd-02a60455a53a443a9634b1fec7bf252f';
const CART_ABANDONMENT_TEMPLATE_ID = 'd-36e585dbda1240678e91e61c6eeab0c8';
const PURCHASE_REMINDER_TEMPLATE_ID = 'd-6c24afad9c4f4cf4babce5f4222cacf5';

// Trigger: Send welcome email when user registers
export const onUserRegistration = functions.firestore
  .document('users/{userId}')
  .onCreate(async (snap, context) => {
    initializeServices();
    
    const userData = snap.data();
    const userId = context.params.userId;

    console.log('');
    console.log('═══════════════════════════════════════════');
    console.log('📧 USER REGISTRATION TRIGGERED');
    console.log('═══════════════════════════════════════════');
    console.log('Timestamp:', new Date().toISOString());
    console.log('User ID:', userId);
    console.log('User data keys:', Object.keys(userData || {}));
    console.log('Email:', userData?.email);
    console.log('First name:', userData?.first_name);

    if (!userData.email) {
      console.log('❌ ERROR: No email found for user');
      console.log('═══════════════════════════════════════════');
      console.log('');
      return null;
    }

    try {
      console.log('🔄 Attempting to send registration welcome email...');
      await sendRegistrationWelcomeEmail(
        userData.email,
        userData.first_name
      );
      
      console.log('✅ SUCCESS: Sent registration welcome email to', userData.email);
      console.log('═══════════════════════════════════════════');
      console.log('');
    } catch (error: any) {
      console.error('');
      console.error('❌ ERROR: Failed to send registration welcome email');
      console.error('Error message:', error.message);
      console.error('Error details:', error);
      console.error('═══════════════════════════════════════════');
      console.error('');
    }

    return null;
  });

// Trigger: Send welcome email on first completed purchase
export const onFirstPurchaseComplete = functions.firestore
  .document('onramp_sessions/{sessionId}')
  .onUpdate(async (change, context) => {
    initializeServices();
    
    const before = change.before.data();
    const after = change.after.data();

    // Only trigger when status changes to fulfillment_complete
    if (before.status !== 'fulfillment_complete' && after.status === 'fulfillment_complete') {
      const userId = after.userId;
      
      if (!userId) {
        console.log('No userId, skipping email');
        return null;
      }

      // Check if this is their first purchase
      const completedSessions = await getDb()
        .collection('onramp_sessions')
        .where('userId', '==', userId)
        .where('status', '==', 'fulfillment_complete')
        .get();

      if (completedSessions.size === 1) {
        // This is their first purchase!
        const userDoc = await getDb().collection('users').doc(userId).get();
        const userData = userDoc.data();

        if (!userData?.email) {
          console.log('No email found for user');
          return null;
        }

        await sendFirstPurchaseEmail(userData.email, userData.first_name, after);
        
        console.log(`Sent first purchase email to ${userData.email}`);
      }
    }

    return null;
  });

// Scheduled function: Check for cart abandonment (runs every hour)
export const checkAbandonedCarts = functions.pubsub
  .schedule('every 1 hours')
  .onRun(async (context) => {
    initializeServices();
    
    const oneHourAgo = admin.firestore.Timestamp.fromDate(
      new Date(Date.now() - 60 * 60 * 1000)
    );

    // Find sessions in requires_payment state that haven't been updated in 1 hour
    const abandonedSessions = await getDb()
      .collection('onramp_sessions')
      .where('status', '==', 'requires_payment')
      .where('lastUpdated', '<', oneHourAgo)
      .get();

    console.log(`Found ${abandonedSessions.size} abandoned carts`);

    const emailPromises = abandonedSessions.docs.map(async (doc) => {
      const session = doc.data();
      
      // Initialize email count if not set
      const emailCount = session.abandonmentEmailCount || 0;
      const sessionLastUpdated = session.lastUpdated?.toDate();
      
      // Stop if we've sent 3 emails already
      if (emailCount >= 3) {
        return;
      }

      // Determine when to send based on email count
      if (emailCount === 0) {
        // First email: 1 hour after abandonment (already filtered by query)
      } else if (emailCount === 1) {
        // Second email: 3 days after abandonment
        if (!sessionLastUpdated) return;
        const daysSinceAbandonment = (Date.now() - sessionLastUpdated.getTime()) / (24 * 60 * 60 * 1000);
        if (daysSinceAbandonment < 3) {
          return;
        }
      } else if (emailCount === 2) {
        // Third email: 1 month (30 days) after abandonment
        if (!sessionLastUpdated) return;
        const daysSinceAbandonment = (Date.now() - sessionLastUpdated.getTime()) / (24 * 60 * 60 * 1000);
        if (daysSinceAbandonment < 30) {
          return;
        }
      }

      if (!session.userId) {
        return;
      }

      const userDoc = await getDb().collection('users').doc(session.userId).get();
      const userData = userDoc.data();

      if (!userData?.email) {
        return;
      }

      await sendCartAbandonmentEmail(userData.email, userData.first_name, session);

      // Update email count and timestamp
      await doc.ref.update({
        abandonmentEmailCount: emailCount + 1,
        lastAbandonmentEmailSent: admin.firestore.FieldValue.serverTimestamp(),
        abandonmentEmailSent: true, // Keep for backward compatibility
      });

      console.log(`Sent cart abandonment email #${emailCount + 1} to ${userData.email}`);
    });

    await Promise.all(emailPromises);
    return null;
  });

// SendGrid email functions
async function sendRegistrationWelcomeEmail(
  email: string,
  firstName: string | undefined
) {
  console.log('  📨 sendRegistrationWelcomeEmail called');
  console.log('    To:', email);
  console.log('    First name:', firstName);
  
  const msg = {
    to: email,
    from: FROM_EMAIL,
    templateId: REGISTRATION_WELCOME_TEMPLATE_ID,
    dynamicTemplateData: {
      first_name: firstName || 'there',
    },
  };

  if (!SENDGRID_API_KEY) {
    console.warn('    ⚠ SendGrid API key not configured!');
    console.log('    Email would be sent:', msg);
    return;
  }

  try {
    console.log('    🔄 Calling SendGrid API...');
    console.log('    Template ID:', REGISTRATION_WELCOME_TEMPLATE_ID);
    console.log('    Message object:', JSON.stringify(msg, null, 2));
    const response = await sgMail.send(msg);
    console.log('    ✅ SendGrid API response:', response[0].statusCode);
  } catch (error: any) {
    console.error('    ❌ SendGrid API error:', error.message);
    console.error('    Error code:', error.code);
    if (error.response?.body) {
      console.error('    Response body:', JSON.stringify(error.response.body, null, 2));
    }
    if (error.response?.body?.errors) {
      console.error('    Errors:', JSON.stringify(error.response.body.errors, null, 2));
    }
    throw error;
  }
}

async function sendFirstPurchaseEmail(
  email: string,
  firstName: string | undefined,
  session: any
) {
  console.log('  📨 sendFirstPurchaseEmail called');
  console.log('    To:', email);
  
  const msg = {
    to: email,
    from: FROM_EMAIL,
    templateId: FIRST_PURCHASE_TEMPLATE_ID,
    dynamicTemplateData: {
      first_name: firstName || 'there',
      transaction_amount: session.transactionDetails?.source_amount || 'N/A',
      transaction_currency: session.transactionDetails?.source_currency || 'USD',
      crypto_amount: session.transactionDetails?.destination_amount || 'N/A',
      crypto_currency: session.transactionDetails?.destination_currency || 'BTC',
    },
  };

  if (!SENDGRID_API_KEY) {
    console.warn('    ⚠ SendGrid API key not configured!');
    console.log('    Email would be sent:', msg);
    return;
  }

  try {
    console.log('    🔄 Calling SendGrid API...');
    console.log('    Template ID:', FIRST_PURCHASE_TEMPLATE_ID);
    console.log('    Message object:', JSON.stringify(msg, null, 2));
    const response = await sgMail.send(msg);
    console.log('    ✅ SendGrid API response:', response[0].statusCode);
  } catch (error: any) {
    console.error('    ❌ SendGrid API error:', error.message);
    console.error('    Error code:', error.code);
    if (error.response?.body) {
      console.error('    Response body:', JSON.stringify(error.response.body, null, 2));
    }
    if (error.response?.body?.errors) {
      console.error('    Errors:', JSON.stringify(error.response.body.errors, null, 2));
    }
    throw error;
  }
}

async function sendCartAbandonmentEmail(
  email: string,
  firstName: string | undefined,
  session: any
) {
  console.log('  📨 sendCartAbandonmentEmail called');
  console.log('    To:', email);
  
  const msg = {
    to: email,
    from: FROM_EMAIL,
    templateId: CART_ABANDONMENT_TEMPLATE_ID,
    dynamicTemplateData: {
      first_name: firstName || 'there',
      cart_amount: session.transactionDetails?.source_amount || 'N/A',
      cart_currency: session.transactionDetails?.source_currency || 'USD',
      crypto_currency: session.transactionDetails?.destination_currency || 'BTC',
      resume_link: `https://omnipay.cc?session=${session.sessionId}`,
    },
  };

  if (!SENDGRID_API_KEY) {
    console.warn('    ⚠ SendGrid API key not configured!');
    console.log('    Email would be sent:', msg);
    return;
  }

  try {
    console.log('    🔄 Calling SendGrid API...');
    console.log('    Template ID:', CART_ABANDONMENT_TEMPLATE_ID);
    console.log('    Message object:', JSON.stringify(msg, null, 2));
    const response = await sgMail.send(msg);
    console.log('    ✅ SendGrid API response:', response[0].statusCode);
  } catch (error: any) {
    console.error('    ❌ SendGrid API error:', error.message);
    console.error('    Error code:', error.code);
    if (error.response?.body) {
      console.error('    Response body:', JSON.stringify(error.response.body, null, 2));
    }
    if (error.response?.body?.errors) {
      console.error('    Errors:', JSON.stringify(error.response.body.errors, null, 2));
    }
    throw error;
  }
}

// Scheduled: Check and send purchase reminders
// Runs daily at 5 PM UTC
// - Weekly users: sent every Monday at 5 PM UTC
// - Monthly users: sent on 1st of each month at 5 PM UTC
export const sendPurchaseReminders = functions.pubsub
  .schedule('0 17 * * *')
  .timeZone('UTC')
  .onRun(async (context) => {
    initializeServices();
    
    console.log('');
    console.log('═══════════════════════════════════════════');
    console.log('⏰ PURCHASE REMINDERS CHECK');
    console.log('═══════════════════════════════════════════');
    console.log('Timestamp:', new Date().toISOString());

    try {
      const now = new Date();
      
      // Get day of week (0=Sunday, 1=Monday, etc) and day of month
      const dayOfWeek = now.getUTCDay();
      const dayOfMonth = now.getUTCDate();
      const isMonday = dayOfWeek === 1;
      const isFirstOfMonth = dayOfMonth === 1;

      console.log(`   Day of week: ${dayOfWeek} (1=Monday), Is Monday: ${isMonday}`);
      console.log(`   Day of month: ${dayOfMonth}, Is 1st: ${isFirstOfMonth}`);

      // Early exit if today is neither Monday nor the 1st
      if (!isMonday && !isFirstOfMonth) {
        console.log('   ⏭ Today is neither Monday nor the 1st - skipping');
        console.log('═══════════════════════════════════════════\n');
        return null;
      }

      const db = getDb();

      // Get users who have reminder preferences set
      const usersSnapshot = await db.collection('users')
        .where('reminderFrequency', 'in', ['weekly', 'monthly'])
        .get();

      console.log(`📋 Found ${usersSnapshot.size} users with reminder preferences`);

      let remindersSent = 0;
      let skipped = 0;

      for (const userDoc of usersSnapshot.docs) {
        const userData = userDoc.data();
        const userId = userDoc.id;
        const reminderFrequency = userData.reminderFrequency;
        const lastReminderSent = userData.lastReminderSent?.toDate();

        console.log(`\n  👤 Checking user ${userId}:`);
        console.log(`    Frequency: ${reminderFrequency}`);
        console.log(`    Last reminder: ${lastReminderSent ? lastReminderSent.toISOString() : 'never'}`);

        // Determine if user needs a reminder
        let shouldSendReminder = false;
        
        if (reminderFrequency === 'weekly' && !isMonday) {
          console.log('    ⏭ Today is not Monday - skip');
          skipped++;
          continue;
        }
        
        if (reminderFrequency === 'monthly' && !isFirstOfMonth) {
          console.log('    ⏭ Today is not the 1st - skip');
          skipped++;
          continue;
        }
        
        if (!lastReminderSent) {
          shouldSendReminder = true;
          console.log('    ✓ No previous reminder sent - will send');
        } else {
          const daysSinceLastReminder = Math.floor((now.getTime() - lastReminderSent.getTime()) / (1000 * 60 * 60 * 24));
          console.log(`    Days since last reminder: ${daysSinceLastReminder}`);
          
          if (reminderFrequency === 'weekly' && daysSinceLastReminder >= 7) {
            shouldSendReminder = true;
            console.log('    ✓ At least 7 days since last weekly reminder');
          } else if (reminderFrequency === 'monthly' && daysSinceLastReminder >= 30) {
            shouldSendReminder = true;
            console.log('    ✓ At least 30 days since last monthly reminder');
          } else {
            console.log('    ⏭ Not yet time for reminder');
          }
        }

        if (shouldSendReminder) {
          try {
            await sendPurchaseReminderEmail(
              userData.email,
              userData.firstName || 'there',
              reminderFrequency
            );

            // Update last reminder sent timestamp
            await userDoc.ref.update({
              lastReminderSent: admin.firestore.FieldValue.serverTimestamp()
            });

            remindersSent++;
            console.log('    ✅ Reminder sent and timestamp updated');
          } catch (error: any) {
            console.error(`    ❌ Failed to send reminder: ${error.message}`);
          }
        } else {
          skipped++;
        }
      }

      console.log('\n═══════════════════════════════════════════');
      console.log(`✅ SUMMARY: ${remindersSent} reminders sent, ${skipped} skipped`);
      console.log('═══════════════════════════════════════════\n');

    } catch (error: any) {
      console.error('❌ Error checking purchase reminders:', error.message);
      console.error('Stack trace:', error.stack);
      throw error;
    }

    return null;
  });

  // Helper: Send purchase reminder email
async function sendPurchaseReminderEmail(
  email: string,
  firstName: string,
  frequency: string
) {
  console.log('      📨 Sending purchase reminder email...');
  console.log(`        To: ${email}`);
  console.log(`        First name: ${firstName}`);
  console.log(`        Frequency: ${frequency}`);

  const msg = {
    to: email,
    from: FROM_EMAIL,
    templateId: PURCHASE_REMINDER_TEMPLATE_ID,
    dynamicTemplateData: {
      first_name: firstName,
      frequency: frequency,
    },
  };

  try {
    await sgMail.send(msg);
    console.log('      ✅ Purchase reminder email sent successfully');
  } catch (error: any) {
    console.error('      ❌ SendGrid API error:', error.message);
    console.error('      Error code:', error.code);
    if (error.response?.body) {
      console.error('      Response body:', JSON.stringify(error.response.body, null, 2));
    }
    if (error.response?.body?.errors) {
      console.error('      Errors:', JSON.stringify(error.response.body.errors, null, 2));
    }
    throw error;
  }
}

// HTTP function: Manually resend welcome emails to existing users
export const resendWelcomeEmails = functions.https.onRequest(async (req, res) => {
  initializeServices();
  
  // Simple security: only allow POST requests with a secret key
  if (req.method !== 'POST') {
    res.status(405).send('Method not allowed');
    return;
  }
  
  const secretKey = req.body.secret || req.query.secret;
  const expectedSecret = '840924389085jerj'; // TODO: Move to environment variable
  
  if (secretKey !== expectedSecret) {
    res.status(403).send('Unauthorized');
    return;
  }

  console.log('🔄 Manual welcome email resend triggered');
  
  try {
    const db = getDb();
    const usersSnapshot = await db.collection('users').get();
    
    console.log(`Found ${usersSnapshot.size} users`);
    
    let sent = 0;
    let failed = 0;
    
    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      
      if (!userData.email) {
        console.log(`Skipping user ${userDoc.id} - no email`);
        continue;
      }
      
      try {
        await sendRegistrationWelcomeEmail(
          userData.email,
          userData.firstName || userData.first_name
        );
        sent++;
        console.log(`✅ Sent to ${userData.email}`);
      } catch (error: any) {
        failed++;
        console.error(`❌ Failed for ${userData.email}:`, error.message);
      }
    }
    
    const summary = {
      total: usersSnapshot.size,
      sent,
      failed,
      message: `Sent ${sent} emails, ${failed} failed`
    };
    
    console.log('Summary:', summary);
    res.json(summary);
    
  } catch (error: any) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// HTTP function: Manually trigger purchase reminders (for testing)
export const sendRemindersManually = functions.https.onRequest(async (req, res) => {
  initializeServices();
  
  // Simple security: only allow POST requests with a secret key
  if (req.method !== 'POST') {
    res.status(405).send('Method not allowed');
    return;
  }
  
  const secretKey = req.body.secret || req.query.secret;
  const expectedSecret = '840924389085jerj'; // TODO: Move to environment variable
  
  if (secretKey !== expectedSecret) {
    res.status(403).send('Unauthorized');
    return;
  }

  console.log('🔄 Manual purchase reminder trigger');
  
  try {
    const now = new Date();
    const db = getDb();
    const userId = req.body.userId || req.query.userId;

    // If userId provided, test specific user
    if (userId) {
      console.log(`Testing reminder for user: ${userId}`);
      
      const userDoc = await db.collection('users').doc(userId).get();
      if (!userDoc.exists) {
        res.status(404).json({ error: `User ${userId} not found` });
        return;
      }

      const userData = userDoc.data();
      if (!userData?.reminderFrequency) {
        res.status(400).json({ error: `User ${userId} has no reminder frequency set` });
        return;
      }

      if (!userData?.email) {
        res.status(400).json({ error: `User ${userId} has no email` });
        return;
      }

      try {
        await sendPurchaseReminderEmail(
          userData.email,
          userData.firstName || 'there',
          userData.reminderFrequency
        );

        await userDoc.ref.update({
          lastReminderSent: admin.firestore.FieldValue.serverTimestamp()
        });

        res.json({
          success: true,
          message: `Sent reminder to ${userData.email}`,
          frequency: userData.reminderFrequency,
          email: userData.email
        });
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
      return;
    }

    // Otherwise test all users (like the scheduled function)
    const usersSnapshot = await db.collection('users')
      .where('reminderFrequency', 'in', ['weekly', 'monthly'])
      .get();

    console.log(`Found ${usersSnapshot.size} users with reminders enabled`);

    let sent = 0;
    let failed = 0;
    const results = [];

    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      
      if (!userData.email) {
        console.log(`Skipping user ${userDoc.id} - no email`);
        continue;
      }
      
      try {
        await sendPurchaseReminderEmail(
          userData.email,
          userData.firstName || 'there',
          userData.reminderFrequency
        );

        await userDoc.ref.update({
          lastReminderSent: admin.firestore.FieldValue.serverTimestamp()
        });

        sent++;
        results.push({
          userId: userDoc.id,
          email: userData.email,
          frequency: userData.reminderFrequency,
          status: 'sent'
        });
        console.log(`✅ Sent to ${userData.email}`);
      } catch (error: any) {
        failed++;
        results.push({
          userId: userDoc.id,
          email: userData.email,
          frequency: userData.reminderFrequency,
          status: 'failed',
          error: error.message
        });
        console.error(`❌ Failed for ${userData.email}:`, error.message);
      }
    }

    const summary = {
      total: usersSnapshot.size,
      sent,
      failed,
      timestamp: now.toISOString(),
      results
    };

    console.log('Summary:', summary);
    res.json(summary);
    
  } catch (error: any) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});
