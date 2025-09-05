import type React from "react";
import type { Metadata } from "next";
import { Geist as Geist_Sans } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner"; // Ensure this path is correct, or use 'sonner' directly
import { Footer } from "@/components/Footer";

const geistSans = Geist_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title: "Flex Living - Reviews Dashboard",
  description: "Manage and display guest reviews for Flex Living properties",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${geistSans.variable} antialiased`}>
        <Navbar />
        <Suspense fallback={null}>{children}</Suspense>
        <Footer />

        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
