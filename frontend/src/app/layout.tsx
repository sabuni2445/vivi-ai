import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import { StudioProvider } from "@/context/StudioContext";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VIVI AI - Create Marketing Videos in Seconds",
  description: "Modern AI Saas for generating high quality marketing videos for your business without any editing skills.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <StudioProvider>
          {children}
        </StudioProvider>
      </body>
    </html>
  );
}
