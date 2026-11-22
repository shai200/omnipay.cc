import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClientProviders } from "./contexts/ClientProviders";
import { THEME_INIT_SCRIPT } from "./contexts/ThemeContext";
import { ServiceWorkerRegister } from "./components/ServiceWorkerRegister";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.BETTER_AUTH_URL?.trim() || "https://omnipay.cc"),
  title: {
    default: "OmniPurchase - Fiat to Crypto Gateway",
    template: "%s · OmniPurchase",
  },
  description: "Your secure gateway from Fiat to Crypto. Buy cryptocurrency instantly with Stripe.",
  applicationName: "OmniPurchase",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "OmniPurchase",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/icons/icon-192x192.png",
    apple: "/icons/icon-192x192.png",
  },
  openGraph: {
    title: "OmniPurchase - Fiat to Crypto Gateway",
    description: "Your secure gateway from Fiat to Crypto. Buy cryptocurrency instantly with Stripe.",
    siteName: "OmniPurchase",
    type: "website",
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
};

// Next 14+ ignores `viewport` inside `metadata`; it has to be its own export.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f8fa" },
    { media: "(prefers-color-scheme: dark)", color: "#07080c" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-dvh bg-bg font-sans text-fg antialiased`}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-surface focus:px-4 focus:py-2 focus:text-fg focus:shadow-lg"
        >
          Skip to content
        </a>
        <ServiceWorkerRegister />
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
