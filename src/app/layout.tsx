// src/app/layout.tsx
import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { cn } from "@/lib/utils";
import { TRPCProvider } from "./providers";
import { Toaster } from "@/components/ui/sonner";
import { SettingsService } from "@/server/services/settings.service";

// Inisialisasi Google Font Plus Jakarta Sans dengan CSS Variable `--font-sans`
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

// Best Practice: Dynamic Metadata Generator
export async function generateMetadata(): Promise<Metadata> {
  const siteMeta = await SettingsService.getSiteMetadataCached();
  return {
    title: {
      default: siteMeta.siteTitle,
      template: `%s | ${siteMeta.siteTitle}`,
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
        plusJakartaSans.variable,
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
