import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "cc.omnipay.app",
  appName: "OmniPay",
  webDir: "public",
  bundledWebRuntime: false,
  server: {
    url: "https://YOUR_DOMAIN",
    cleartext: false
  }
};

export default config;
