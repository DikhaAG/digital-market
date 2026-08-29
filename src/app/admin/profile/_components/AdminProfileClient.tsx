// src/app/admin/profile/_components/AdminProfileClient.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  User,
  Mail,
  ShieldCheck,
  Store,
  Calendar,
  Loader2,
  Save,
  CheckCircle2,
  AlertCircle,
  Phone,
  MessageSquare,
} from "lucide-react";
import {
  updateProfileSchema,
  type UpdateProfileValues,
} from "@/lib/validations/profile";
import { authClient } from "@/lib/auth-client";
import { trpc } from "@/lib/trpc/client";
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
import { ImageUploader } from "@/components/ui/image-uploader";

interface AdminProfileClientProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: "super_admin" | "admin" | "user";
    image?: string | null;
    createdAt?: string | Date;
  };
  initialAdminPhone: string;
}

export function AdminProfileClient({
  user,
  initialAdminPhone,
}: AdminProfileClientProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [adminPhone, setAdminPhone] = useState(initialAdminPhone);
  const isSuperAdmin = user.role === "super_admin";

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isDirty },
  } = useForm<UpdateProfileValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user.name,
      image: user.image ?? "",
    },
  });

  // Gunakan useWatch alih-alih watch() dari useForm agar aman bagi React Compiler
  const currentImageUrl = useWatch({
    control,
    name: "image",
  });

  const utils = trpc.useUtils();

  const updateContactMutation = trpc.admin.updateAdminContact.useMutation({
    onSuccess: (data) => {
      toast.success("Nomor WhatsApp Admin berhasil diperbarui");
      setAdminPhone(data.whatsappNumber);
      utils.admin.getAdminContact.invalidate();
      router.refresh();
    },
    onError: (err) =>
      toast.error(err.message || "Gagal memperbarui nomor WhatsApp"),
  });

  const onSubmit = async (values: UpdateProfileValues) => {
    try {
      setIsSubmitting(true);
      const { error } = await authClient.updateUser({
        name: values.name,
        image: values.image || undefined,
      });

      if (error) throw new Error(error.message || "Gagal memperbarui profil");

      toast.success("Profil berhasil diperbarui");
      router.refresh();
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Terjadi kesalahan sistem",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveContact = () => {
    if (!adminPhone.trim()) {
      toast.error("Nomor WhatsApp tidak boleh kosong");
      return;
    }
    updateContactMutation.mutate({ whatsappNumber: adminPhone });
  };

  const formattedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Tidak diketahui";

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      {/* Top Header Banner */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            Profil Pengelola
          </h1>
          <p className="text-xs text-muted-foreground">
            Kelola identitas personal, foto profil, dan jalur komunikasi
            pemesanan.
          </p>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold w-fit ${
            isSuperAdmin
              ? "bg-purple-500/10 text-purple-600 border border-purple-500/20"
              : "bg-blue-500/10 text-blue-600 border border-blue-500/20"
          }`}
        >
          {isSuperAdmin ? (
            <>
              <ShieldCheck className="h-3.5 w-3.5" /> SUPER ADMIN
            </>
          ) : (
            <>
              <Store className="h-3.5 w-3.5" /> SELLER (ADMIN)
            </>
          )}
        </span>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Kolom Kiri: Foto Profil CDN & Quick Status */}
        <Card className="border-border/80 shadow-xs md:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <User className="h-4 w-4 text-primary" /> Foto Profil
            </CardTitle>
            <CardDescription className="text-xs">
              Foto ini akan ditampilkan di sidebar dan audit aktivitas.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center space-y-4">
            <div className="w-full max-w-50">
              <ImageUploader
                value={currentImageUrl}
                onChange={(url) =>
                  setValue("image", url, { shouldDirty: true })
                }
                folder="marketplace/avatars"
                aspectRatio="square"
                disabled={isSubmitting}
              />
            </div>
            <div className="w-full space-y-2 rounded-lg bg-muted/40 p-3 text-xs">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" /> Terdaftar
                </span>
                <span className="font-semibold text-foreground">
                  {formattedDate}
                </span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />{" "}
                  Status Akun
                </span>
                <span className="font-bold text-emerald-600">Aktif</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Kolom Kanan: Form Data Profil & WhatsApp Integration */}
        <div className="space-y-6 md:col-span-2">
          {/* Card 1: Informasi Personal */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card className="border-border/80 shadow-xs">
              <CardHeader>
                <CardTitle className="text-sm font-bold">
                  Informasi Personal
                </CardTitle>
                <CardDescription className="text-xs">
                  Perbarui nama lengkap dan akun Anda.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-xs font-semibold">
                    Nama Lengkap
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    disabled={isSubmitting}
                    placeholder="Masukkan nama lengkap"
                    className="h-9 text-xs"
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className="text-[11px] font-medium text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-semibold">
                    Alamat Email
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      value={user.email}
                      disabled
                      className="h-9 text-xs bg-muted/50 pl-8 text-muted-foreground cursor-not-allowed"
                    />
                    <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>

                <div className="flex items-center justify-end pt-2">
                  <Button
                    type="submit"
                    size="sm"
                    disabled={isSubmitting || !isDirty}
                    className="h-9 gap-1.5 text-xs font-bold px-4 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />{" "}
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <Save className="h-3.5 w-3.5" /> Simpan Identitas
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>

          {/* Card 2: Pengaturan WhatsApp Pemesanan Gig */}
          <Card className="border-border/80 shadow-xs">
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-emerald-600" /> WhatsApp
                Transaksi Layanan
              </CardTitle>
              <CardDescription className="text-xs">
                Nomor ini digunakan sebagai tujuan tombol order WhatsApp pada
                halaman Gig publik.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="adminPhone" className="text-xs font-semibold">
                  Nomor WhatsApp Admin (Aktif)
                </Label>
                <div className="relative">
                  <Input
                    id="adminPhone"
                    type="tel"
                    placeholder="Contoh: 6281234567890 atau 081234567890"
                    value={adminPhone}
                    onChange={(e) => setAdminPhone(e.target.value)}
                    disabled={updateContactMutation.isPending}
                    className="h-9 text-xs pl-8 font-mono"
                  />
                  <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Format otomatis dikonversi ke format internasional tanpa
                  spasi/tanda hubung.
                </p>
              </div>

              <div className="flex items-center justify-end pt-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={handleSaveContact}
                  disabled={
                    updateContactMutation.isPending ||
                    adminPhone === initialAdminPhone
                  }
                  className="h-9 gap-1.5 text-xs font-bold px-4 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                >
                  {updateContactMutation.isPending ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />{" "}
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save className="h-3.5 w-3.5" /> Perbarui WhatsApp
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
