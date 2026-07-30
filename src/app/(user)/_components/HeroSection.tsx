"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search, Sparkles } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function HeroSection() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      // Best Practice: gunakan encodeURIComponent agar karakter khusus/spasi aman di URL query string
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <section className="relative w-full min-h-[420px] sm:min-h-[480px] lg:min-h-[520px] rounded-3xl overflow-hidden bg-gradient-to-br from-brand/20 via-card to-background border border-brand/20 p-6 sm:p-10 lg:p-14 shadow-xl flex flex-col justify-center">
      <div className="absolute top-0 right-0 -mt-20 -mr-20 h-96 w-96 rounded-full bg-brand/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-brand/10 blur-2xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl space-y-6">
        <Badge
          variant="outline"
          className="border-brand/30 bg-brand/10 text-brand backdrop-blur-md px-3.5 py-1 text-xs font-semibold gap-1.5 rounded-full inline-flex"
        >
          <Sparkles className="h-3.5 w-3.5 text-brand" />
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

        <form
          onSubmit={handleSearch}
          className="relative flex items-center w-full max-w-2xl pt-2"
        >
          <div className="relative w-full flex items-center">
            <Search className="absolute left-4 h-5 w-5 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari layanan atau produk digital apapun..."
              className="w-full bg-card/90 backdrop-blur border-border pl-12 pr-28 py-6 text-sm sm:text-base rounded-2xl shadow-lg focus-visible:ring-brand focus-visible:border-brand"
            />
            <Button
              type="submit"
              className="absolute right-2 bg-brand text-brand-foreground hover:bg-brand/90 font-semibold px-5 py-5 rounded-xl transition-all active:scale-95 shadow-md"
            >
              Cari
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
