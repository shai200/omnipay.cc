import type { Metadata } from "next";
import { Fraunces, Sora } from "next/font/google";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Omnipay.cc — Fiat to Crypto Gateway",
  description:
    "Buy crypto regularly with any credit or debit card — sent directly to your wallet. Recurring reminders that turn small purchases into lasting wealth.",
  applicationName: "Omnipay",
  openGraph: {
    title: "Omnipay.cc — Fiat to Crypto Gateway",
    description:
      "Build wealth with recurring crypto buys. Card on-ramp, direct to your wallet.",
    url: "https://omnipay.cc",
    siteName: "Omnipay.cc",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sora.variable} ${fraunces.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
