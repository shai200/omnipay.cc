import { defineRailway, github, postgres, preserve, project, service } from "railway/iac";

// Reviewed with `railway config plan` and applied only after the cutover
// checklist is approved. This file does not deploy anything by itself.
// Secret values stay in Railway. preserve() keeps a value that is already set
// and does not write a secret into git.
export default defineRailway(() => {
  const db = postgres("postgres");
  const source = github("shai200/omnipay.cc", { branch: "develop" });

  const web = service("web", {
    source,
    start: "node server.js",
    preDeploy: "node dist/migrate.js",
    healthcheck: "/api/health",
    healthcheckTimeout: 30,
    env: {
      DATABASE_URL: db.env.DATABASE_URL,
      NODE_ENV: "production",
      BETTER_AUTH_SECRET: preserve(),
      BETTER_AUTH_URL: preserve(),
      GOOGLE_CLIENT_ID: preserve(),
      GOOGLE_CLIENT_SECRET: preserve(),
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: preserve(),
      STRIPE_SECRET_KEY: preserve(),
      STRIPE_WEBHOOK_SECRET: preserve(),
      SENDGRID_API_KEY: preserve(),
      SENDGRID_FROM_EMAIL: "support@omnipay.cc",
      FIREBASE_SCRYPT_SIGNER_KEY: preserve(),
      FIREBASE_SCRYPT_SALT_SEPARATOR: preserve(),
      FIREBASE_SCRYPT_ROUNDS: preserve(),
      FIREBASE_SCRYPT_MEM_COST: preserve(),
    },
  });

  const emailJobs = service("email-jobs", {
    source,
    start: "node dist/worker.js",
    preDeploy: "node dist/migrate.js",
    deploy: {
      cronSchedule: "0 * * * *",
      restartPolicyType: "NEVER",
    },
    env: {
      DATABASE_URL: db.env.DATABASE_URL,
      NODE_ENV: "production",
      BETTER_AUTH_URL: preserve(),
      SENDGRID_API_KEY: preserve(),
      SENDGRID_FROM_EMAIL: "support@omnipay.cc",
      SENDGRID_TEMPLATE_WELCOME: preserve(),
      SENDGRID_TEMPLATE_FIRST_PURCHASE: preserve(),
      SENDGRID_TEMPLATE_ABANDONED_CART: preserve(),
      SENDGRID_TEMPLATE_REMINDER: preserve(),
    },
  });

  return project("omnipay", {
    resources: [db, web, emailJobs],
  });
});
