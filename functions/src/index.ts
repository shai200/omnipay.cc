import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';
import sgMail from '@sendgrid/mail';

admin.initializeApp();
const db = admin.firestore();

// Initialize SendGrid with environment variable
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || '';
const FROM_EMAIL = process.env.FROM_EMAIL || 'support@omnipay.cc';
const REGISTRATION_WELCOME_TEMPLATE_ID = process.env.REGISTRATION_WELCOME_TEMPLATE_ID || 'd-7f75ffd28cd34cb59edcff9a2e1b3696';
const FIRST_PURCHASE_TEMPLATE_ID = process.env.FIRST_PURCHASE_TEMPLATE_ID || 'd-02a60455a53a443a9634b1fec7bf252f';
const CART_ABANDONMENT_TEMPLATE_ID = process.env.CART_ABANDONMENT_TEMPLATE_ID || 'd-36e585dbda1240678e91e61c6eeab0c8';

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

// Trigger: Send welcome email when user registers
export const onUserRegistration = functions.firestore
  .document('users/{userId}')
  .onCreate(async (snap, context) => {
    const userData = snap.data();
    const userId = context.params.userId;

    if (!userData.email) {
      console.log('No email found for user:', userId);
      return null;
    }

    try {
      await sendRegistrationWelcomeEmail(
        userData.email,
        userData.first_name
      );
      
      console.log(`Sent registration welcome email to ${userData.email}`);
    } catch (error) {
      console.error('Error sending registration welcome email:', error);
    }

    return null;
  });

// Trigger: Send welcome email on first completed purchase
export const onFirstPurchaseComplete = functions.firestore
  .document('onramp_sessions/{sessionId}')
  .onUpdate(async (change, context) => {
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
      const completedSessions = await db
        .collection('onramp_sessions')
        .where('userId', '==', userId)
        .where('status', '==', 'fulfillment_complete')
        .get();

      if (completedSessions.size === 1) {
        // This is their first purchase!
        const userDoc = await db.collection('users').doc(userId).get();
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
    const oneHourAgo = admin.firestore.Timestamp.fromDate(
      new Date(Date.now() - 60 * 60 * 1000)
    );

    // Find sessions in requires_payment state that haven't been updated in 1 hour
    const abandonedSessions = await db
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

      const userDoc = await db.collection('users').doc(session.userId).get();
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
  const msg = {
    to: email,
    from: FROM_EMAIL,
    templateId: REGISTRATION_WELCOME_TEMPLATE_ID,
    dynamicTemplateData: {
      first_name: firstName || 'there',
    },
  };

  if (!SENDGRID_API_KEY) {
    console.log('SendGrid not configured, email:', msg);
    return;
  }

  await sgMail.send(msg);
}

async function sendFirstPurchaseEmail(
  email: string,
  firstName: string | undefined,
  session: any
) {
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
    console.log('SendGrid not configured, email:', msg);
    return;
  }

  await sgMail.send(msg);
}

async function sendCartAbandonmentEmail(
  email: string,
  firstName: string | undefined,
  session: any
) {
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
    console.log('SendGrid not configured, email:', msg);
    return;
  }

  await sgMail.send(msg);
}
