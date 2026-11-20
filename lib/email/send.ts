import sgMail from '@sendgrid/mail';
import { fromEmail, sendGridConfigured } from '@/lib/email/config';

export type OutboundEmail = {
  to: string;
  templateId: string;
  dynamicTemplateData: Record<string, string>;
};

let configuredKey: string | undefined;

function client(): typeof sgMail {
  const key = process.env.SENDGRID_API_KEY?.trim() ?? '';
  if (!key) {
    throw new Error('SENDGRID_API_KEY is not configured');
  }
  if (configuredKey !== key) {
    sgMail.setApiKey(key);
    configuredKey = key;
  }
  return sgMail;
}

export async function deliverTemplateEmail(message: OutboundEmail): Promise<void> {
  await client().send({
    to: message.to,
    from: fromEmail(),
    templateId: message.templateId,
    dynamicTemplateData: message.dynamicTemplateData,
  });
}

export async function sendPasswordResetEmail(to: string, url: string): Promise<void> {
  if (!sendGridConfigured()) {
    throw new Error('SENDGRID_API_KEY is not configured');
  }
  await client().send({
    to,
    from: fromEmail(),
    subject: 'Reset your Omnipay.cc password',
    text: `Reset your password by opening this link. It expires in one hour.\n\n${url}\n\nIf you did not ask for this, you can ignore this email.`,
  });
}
