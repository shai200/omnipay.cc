export const DEFAULT_FROM_EMAIL = 'support@omnipay.cc';

export const DEFAULT_TEMPLATES = {
  welcome: 'd-7f75ffd28cd34cb59edcff9a2e1b3696',
  firstPurchase: 'd-02a60455a53a443a9634b1fec7bf252f',
  abandonedCart: 'd-36e585dbda1240678e91e61c6eeab0c8',
  reminder: 'd-6c24afad9c4f4cf4babce5f4222cacf5',
} as const;

export type EmailTemplateKey = keyof typeof DEFAULT_TEMPLATES;

export function fromEmail(env: NodeJS.ProcessEnv = process.env): string {
  const value = env.SENDGRID_FROM_EMAIL?.trim();
  return value && value.length > 0 ? value : DEFAULT_FROM_EMAIL;
}

export function templateId(key: EmailTemplateKey, env: NodeJS.ProcessEnv = process.env): string {
  const override = {
    welcome: env.SENDGRID_TEMPLATE_WELCOME,
    firstPurchase: env.SENDGRID_TEMPLATE_FIRST_PURCHASE,
    abandonedCart: env.SENDGRID_TEMPLATE_ABANDONED_CART,
    reminder: env.SENDGRID_TEMPLATE_REMINDER,
  }[key];
  const value = override?.trim();
  return value && value.length > 0 ? value : DEFAULT_TEMPLATES[key];
}

export function appOrigin(env: NodeJS.ProcessEnv = process.env): string {
  const value = env.BETTER_AUTH_URL?.trim() || env.APP_ORIGIN?.trim() || 'https://omnipay.cc';
  return value.replace(/\/$/, '');
}

export function sendGridConfigured(env: NodeJS.ProcessEnv = process.env): boolean {
  return Boolean(env.SENDGRID_API_KEY?.trim());
}
