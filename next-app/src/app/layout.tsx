import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";

const fontHeading = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
});

const fontBody = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});
export const metadata: Metadata = {
  title: "Safewire - Secure and Fair Decentralized Payments",
  description:
    "Safewire simplifies secure transactions with built-in dispute resolution, ensuring peace of mind for both buyers and merchants. Project developed for the ETH Global Hackathon 2024 in Singapore",
  authors: [{ name: "Marcia Ong" }, { name: "Syahrul" }, { name: "Wayne" }],
  keywords: [
    "Safewire",
    "Decentralized Payments",
    "Secure Transactions",
    "Blockchain",
    "Dispute Resolution",
  ],
  twitter: {
    card: "summary_large_image",
    title: "Safewire - Secure and Fair Decentralized Payments",
    description:
      "Experience secure payments with Safewire's innovative payment infrastructure.",
    images: ["https://ethglobal-sg.vercel.app/safewire.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn("antialiased", fontHeading.variable, fontBody.variable)}
      >
        {children}
      </body>
    </html>
  );
}
