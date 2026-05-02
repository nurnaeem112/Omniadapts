import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AppWrapper from "@/components/AppWrapper";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "OmniAdapts",
  description: "Transform your content with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scrollbar-custom">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased min-h-screen bg-primary flex flex-col`}
      >
        <AppWrapper>
          <Navbar />
          <main className="flex-1 max-w-[1200px] mx-auto w-full px-4 pt-8">
            {children}
          </main>
          <Footer />
        </AppWrapper>
      </body>
    </html>
  );
}
