import React from "react";
import { BuyerNavbar } from "@/components/buyer/navbar/Navbar";
import { BuyerFooter } from "@/components/buyer/footer/Footer";

export default function BuyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    /* 
      - flex-1: Mengisi sisa ruang kosong dari body RootLayout.
      - flex flex-col: Memungkinkan <main className="flex-1"> mendorong BuyerFooter ke paling bawah (Sticky Footer).
      - Tidak perlu min-h-screen, bg-background, atau font-sans lagi karena sudah ditangani RootLayout.
    */
    <div className="flex flex-col flex-1">
      <BuyerNavbar />

      <main className="flex-1">{children}</main>

      <BuyerFooter />
    </div>
  );
}
