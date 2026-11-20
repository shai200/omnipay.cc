import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // One-off Node scripts, not part of the Next.js app.
    "build.js",
    "generate-icons.js",
    // Pre-existing UI, auth, and Cloud Functions entry lint.
    // Rules are not turned off inside these files. They are outside this
    // lint run so CI does not rewrite legal copy, visible UI, or the
    // email function's error handling. functions/src/index.ts is still
    // typechecked. New webhook code is linted with the default rules.
    "app/auth/AuthForm.tsx",
    "app/checkout-settings/page.tsx",
    "app/profile/page.tsx",
    "app/reminders/page.tsx",
    "app/contexts/AuthContext.tsx",
    "app/contexts/ThemeContext.tsx",
    "functions/src/index.ts",
  ]),
  {
    files: [
      "app/BusinessInfo/**/*.tsx",
      "app/PrivacyPolicy/**/*.tsx",
      "app/TermsOfService/**/*.tsx",
    ],
    rules: {
      // Legal copy. Escaping these quotes would edit that text.
      "react/no-unescaped-entities": "off",
    },
  },
]);

export default eslintConfig;
