// src/app/admin/settings/_components/AdminSettingsClient.tsx
"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { toast } from "sonner";
import {
  Settings,
  Type,
  Image as ImageIcon,
  Save,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUploader } from "@/components/ui/image-uploader";
import { type BrandLogoConfig } from "@/server/services/settings.service";

interface AdminSettingsClientProps {
  initialSettings: BrandLogoConfig;
}

export function AdminSettingsClient({
  initialSettings,
}: AdminSettingsClientProps) {
  const [logoType, setLogoType] = useState<"text" | "image">(
    initialSettings.logoType,
  );
  const [logoText, setLogoText] = useState(initialSettings.logoText);
  const [logoTextAccent, setLogoTextAccent] = useState(
    initialSettings.logoTextAccent,
  );
  const [logoImage, setLogoImage] = useState(initialSettings.logoImage);

  const utils = trpc.useUtils();

  const updateMutation = trpc.admin.updateBrandLogoSettings.useMutation({
    onSuccess: () => {
      toast.success("Pengaturan logo berhasil disimpan");
      utils.admin.getBrandLogoSettings.invalidate();
    },
    onError: (err) => {
      toast.error(err.message || "Gagal memperbarui logo");
    },
  });

  const handleSave = () => {
    updateMutation.mutate({
      logoType,
      logoText,
      logoTextAccent,
      logoImage,
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
          <Settings className="h-6 w-6 text-primary" /> Pengaturan Identitas
          Visual
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Kelola format dan tampilan logo utama marketplace (Header & Footer).
        </p>
      </div>

      <Card className="border-border/80 shadow-xs">
        <CardHeader>
          <CardTitle className="text-base font-bold">Tipe Logo Brand</CardTitle>
          <CardDescription className="text-xs">
            Pilih metode tampilan logo menggunakan Teks Terstruktur atau
            Gambar/Grafis CDN.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs
            value={logoType}
            onValueChange={(val) => setLogoType(val as "text" | "image")}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 w-full max-w-sm">
              <TabsTrigger
                value="text"
                className="text-xs font-bold gap-1.5 cursor-pointer"
              >
                <Type className="h-3.5 w-3.5" /> Logo Teks
              </TabsTrigger>
              <TabsTrigger
                value="image"
                className="text-xs font-bold gap-1.5 cursor-pointer"
              >
                <ImageIcon className="h-3.5 w-3.5" /> Logo Gambar
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* OPSI 1: FORM TEKS LOGO */}
          {logoType === "text" && (
            <div className="grid sm:grid-cols-2 gap-4 p-4 rounded-xl border bg-muted/20">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Nama Brand Utam</Label>
                <Input
                  value={logoText}
                  onChange={(e) => setLogoText(e.target.value)}
                  placeholder="Contoh: fiverr"
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold">
                  Aksen Karakter / Titik
                </Label>
                <Input
                  value={logoTextAccent}
                  onChange={(e) => setLogoTextAccent(e.target.value)}
                  placeholder="Contoh: ."
                  className="h-9 text-xs font-bold text-primary"
                />
              </div>
            </div>
          )}

          {/* OPSI 2: FORM GAMBAR LOGO CDN */}
          {logoType === "image" && (
            <div className="space-y-2 p-4 rounded-xl border bg-muted/20">
              <Label className="text-xs font-bold">
                Upload Logo CDN (Cloudinary)
              </Label>
              <div className="max-w-xs">
                <ImageUploader
                  value={logoImage}
                  onChange={setLogoImage}
                  folder="marketplace/branding"
                  aspectRatio="banner"
                  disabled={updateMutation.isPending}
                />
              </div>
            </div>
          )}

          {/* LIVE PREVIEW AREA */}
          <div className="space-y-2 border-t pt-4">
            <Label className="text-xs font-bold uppercase text-muted-foreground">
              Live Preview Tampilan Logo
            </Label>
            <div className="p-4 rounded-xl border bg-card flex items-center justify-center min-h-20 shadow-xs">
              {logoType === "image" && logoImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logoImage}
                  alt="Preview Logo"
                  className="h-8 object-contain max-w-40"
                />
              ) : (
                <span className="text-2xl font-black tracking-tight text-foreground">
                  {logoText || ""}
                  <span className="text-primary">{logoTextAccent}</span>
                </span>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              onClick={handleSave}
              disabled={updateMutation.isPending}
              className="font-bold text-xs gap-2 rounded-xl h-10 px-6 cursor-pointer"
            >
              {updateMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span>Simpan Perubahan Logo</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
