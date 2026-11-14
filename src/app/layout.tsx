import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteNav } from "@/components/site-nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "INKLOOM AI",
  description: "Pre-publication brand-governance checkpoint. Humans make every final decision.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a href="#main" className="sr-only focus:not-sr-only focus:p-2">Skip to content</a>
        <header className="flex items-center justify-between border-b px-6 py-3">
          <span className="font-semibold">INKLOOM AI</span>
          <SiteNav />
        </header>
        <main id="main" className="flex-1 px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
