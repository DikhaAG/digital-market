//src/app/(user)/categories/[category]/error.tsx
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CategoryErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function CategoryError({ error, reset }: CategoryErrorProps) {
  useEffect(() => {
    console.error("[CATEGORY_ROUTE_ERROR]:", error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
      <div className="max-w-md w-full text-center space-y-6 p-8 rounded-3xl border border-destructive/20 bg-destructive/5 shadow-xl">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center border border-destructive/20 shadow-2xs">
          <AlertTriangle className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-extrabold text-foreground tracking-tight">
            Gagal Memuat Kategori
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Terjadi masalah saat mengambil data layanan pada kategori ini.
            Silakan coba beberapa saat lagi.
          </p>
          {error.digest && (
            <p className="text-[10px] font-mono text-muted-foreground/70 bg-muted/40 py-1 px-2 rounded-lg inline-block border border-border/40">
              Digest ID: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            onClick={() => reset()}
            variant="default"
            size="sm"
            className="w-full sm:w-auto rounded-xl font-bold h-10 px-5 gap-2 cursor-pointer shadow-md"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Coba Lagi</span>
          </Button>

          <Button
            nativeButton={false}
            render={
              <Link href="/categories">
                <ArrowLeft className="h-4 w-4" />
                <span>Semua Kategori</span>
              </Link>
            }
            variant="outline"
            size="sm"
            className="w-full sm:w-auto rounded-xl font-semibold h-10 px-5 gap-2 cursor-pointer"
          ></Button>
        </div>

        <div className="pt-2 border-t border-border/40">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <Home className="h-3.5 w-3.5" />
            <span>Kembali ke Halaman Utama</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
