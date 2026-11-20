import { closeDb, getDb } from '@/lib/db/client';
import { sendGridConfigured } from '@/lib/email/config';
import { runEmailJobs } from '@/lib/email/jobs';
import { deliverTemplateEmail } from '@/lib/email/send';

async function main(): Promise<void> {
  const dryRun = process.env.EMAIL_JOBS_DRY_RUN === 'true';
  if (!sendGridConfigured() && !dryRun) {
    console.log('Email jobs skipped; SENDGRID_API_KEY is not configured');
    return;
  }

  const report = await runEmailJobs(getDb(), {
    async send(message) {
      if (dryRun) return;
      await deliverTemplateEmail(message);
    },
  });

  console.log('Email jobs finished', {
    dryRun,
    welcomeSent: report.welcomeSent,
    firstPurchaseSent: report.firstPurchaseSent,
    abandonedCartSent: report.abandonedCartSent,
    reminderSent: report.reminderSent,
    skipped: report.skipped,
    failed: report.failed,
  });

  if (report.failed > 0) process.exitCode = 1;
}

main()
  .catch(() => {
    console.error('Email jobs failed');
    process.exitCode = 1;
  })
  .finally(async () => {
    await closeDb();
  });
