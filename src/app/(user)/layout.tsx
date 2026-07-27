import { UserFooter } from "@/features/user/layout/footer/components/Footer";
import { UserNavbar } from "@/features/user/layout/nav/components/Navbar";
import React from "react";

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

      <main className="flex-1 px-4 py-6">{children}</main>

      <UserFooter />
    </div>
  );
}
