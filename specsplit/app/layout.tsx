import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SpecSplit — AI Requirement Analyzer",
  description: "Turn messy client requirement documents into structured weekly task plans with time estimates, dependencies, and risk flags.",
  keywords: "requirement analyzer, freelance developer tool, project planning, AI task breakdown",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.variable} min-h-full flex flex-col antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}