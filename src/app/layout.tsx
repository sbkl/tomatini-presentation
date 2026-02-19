import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AccessGate } from "@/components/access-gate";
import { versailles } from "@/lib/fonts";
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
  title: "Tomatini | The Agents Driven Training Platform.",
  description: "The Agents Driven Training Platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${versailles.variable} antialiased font-versailles`}
      >
        <AccessGate>{children}</AccessGate>
      </body>
    </html>
  );
}
