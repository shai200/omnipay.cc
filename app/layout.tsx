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
  title: "Northfield — Regenerative Farming",
  description:
    "Northfield grows food the land can keep giving — soil-first farming, open fields, and harvest you can taste.",
  applicationName: "Northfield",
  openGraph: {
    title: "Northfield — Regenerative Farming",
    description:
      "Soil-first farming on open prairie. Visit the fields, meet the season, take home the harvest.",
    url: "https://omnipay.cc",
    siteName: "Northfield",
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
