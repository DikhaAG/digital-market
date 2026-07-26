import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Fiverr Clone",
  description: "Freelance Services Marketplace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full scroll-smooth antialiased",
        inter.variable,
        geistMono.variable,
      )}
    >
      {/*
        1. min-h-full & flex-col pada body memastikan tinggi aplikasi minimal 100% tinggi viewport.
        2. bg-background & text-foreground dipasang di sini agar berlaku untuk seluruh halaman/layout (Auth, User, Admin, 404, dll).
        3. font-sans dipasang di body agar otomatis diwariskan ke seluruh elemen anak.
      */}
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        {children}
      </body>
    </html>
  );
}
