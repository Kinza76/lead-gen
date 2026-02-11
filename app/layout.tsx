import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LeadGen+ Outreach Automation",
  description: "Scrape leads, sync to Sheets, and automate outreach."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main className="mx-auto min-h-screen max-w-6xl p-4 md:p-8">{children}</main>
      </body>
    </html>
  );
}
