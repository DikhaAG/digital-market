import React from "react";
import { BuyerNavbar } from "@/components/buyer/navbar/Navbar";
import { BuyerFooter } from "@/components/buyer/footer/Footer";

export default function BuyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">
      <BuyerNavbar />

      <main className="flex-1">{children}</main>

      <BuyerFooter />
    </div>
  );
}
