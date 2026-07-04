import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "House OS",
  description: "Private founder operating system for The House of Amey Marathe."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
