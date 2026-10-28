import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { siteUrl } from "@/lib/site-url";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "EPL Match Lab",
    template: "%s",
  },
  description:
    "Public-data Premier League lab: compare two clubs in plain English, play a sample match that is not a prediction, and scout similar players. Missing salaries stay blank.",
  openGraph: {
    type: "website",
    siteName: "EPL Match Lab",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full min-w-0 flex flex-col overflow-x-hidden bg-slate-100 text-slate-900 pb-[env(safe-area-inset-bottom)]">
        {children}
      </body>
    </html>
  );
}
