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
    "dist/**",
    ".railway/**",
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
