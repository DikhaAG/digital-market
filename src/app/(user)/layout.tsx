import React from "react";
import { UserNavbar } from "@/components/user/navbar/Navbar";
import { UserFooter } from "@/components/user/footer/Footer";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    /* 
      - flex-1: Mengisi sisa ruang kosong dari body RootLayout.
      - flex flex-col: Memungkinkan <main className="flex-1"> mendorong User ke paling bawah (Sticky Footer).
      - Tidak perlu min-h-screen, bg-background, atau font-sans lagi karena sudah ditangani RootLayout.
    */
    <div className="flex flex-col flex-1">
      <UserNavbar />

      <main className="flex-1">{children}</main>

      <UserFooter />
    </div>
  );
}
