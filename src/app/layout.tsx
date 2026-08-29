// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { cn } from "@/lib/utils";
import { TRPCProvider } from "./providers";
import { Toaster } from "@/components/ui/sonner";
import { SettingsService } from "@/server/services/settings.service";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

// ✅ Best Practice 2026: Dynamic Metadata Generator
export async function generateMetadata(): Promise<Metadata> {
  const siteMeta = await SettingsService.getSiteMetadataCached();

  return {
    title: {
      default: siteMeta.siteTitle,
      template: `%s | ${siteMeta.siteTitle}`, // Otomatis dipakai oleh halaman anak
    },
    description: siteMeta.siteDescription,
    openGraph: {
      title: siteMeta.siteTitle,
      description: siteMeta.siteDescription,
      type: "website",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full scroll-smooth antialiased",
        inter.variable,
        geistMono.variable,
      )}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <TRPCProvider>{children}</TRPCProvider>
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
