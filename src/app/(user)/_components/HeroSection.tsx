"use client";

import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { HeroSearchBar } from "./HeroSearchBar";

export function HeroSection() {
  return (
    <section className="relative z-20 w-full min-h-[420px] sm:min-h-[480px] lg:min-h-[520px] rounded-3xl bg-gradient-to-br from-primary/10 via-card to-background border border-primary/15 p-6 sm:p-10 lg:p-14 shadow-xl flex flex-col justify-center">
      {/* 
        BEST APPROACH: 
        Isolasi overflow-hidden HANYA pada layer dekorasi background.
        Ini mencegah efek blur melimpah ke luar hero, tanpa memotong popover search.
      */}
      <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-primary/5 blur-2xl" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-3xl space-y-6">
        <Badge
          variant="outline"
          className="border-primary/25 bg-primary/10 text-primary backdrop-blur-md px-3.5 py-1 text-xs font-semibold gap-1.5 rounded-full inline-flex"
        >
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          Pasar Layanan & Produk Digital
        </Badge>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-foreground">
          Temukan Produk Digital <br className="hidden sm:inline" />& Layanan
          Profesional
        </h1>

        <p className="text-muted-foreground text-sm sm:text-base lg:text-lg max-w-xl leading-relaxed">
          Jelajahi ribuan produk digital, skrip, dan talenta terverifikasi untuk
          mempercepat proyek Anda.
        </p>

        {/* Hero SearchBar Container */}
        <div className="w-full max-w-2xl pt-2">
          <HeroSearchBar placeholder="Cari layanan atau produk digital apapun..." />
        </div>
      </div>
    </section>
  );
}
