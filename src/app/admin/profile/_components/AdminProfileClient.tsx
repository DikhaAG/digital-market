// src/app/admin/profile/_components/AdminProfileClient.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  User,
  Mail,
  ShieldCheck,
  Store,
  Calendar,
  KeyRound,
  Loader2,
  Save,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import {
  updateProfileSchema,
  type UpdateProfileValues,
} from "@/lib/validations/profile";
import { authClient } from "@/lib/auth-client";
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
}

export function AdminProfileClient({ user }: AdminProfileClientProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSuperAdmin = user.role === "super_admin";

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<UpdateProfileValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user.name,
      image: user.image ?? "",
    },
  });

  const currentImageUrl = watch("image");

  const onSubmit = async (values: UpdateProfileValues) => {
    try {
      setIsSubmitting(true);

      // Eksekusi pembaruan profil pengguna via Better-Auth Client API
      const { error } = await authClient.updateUser({
        name: values.name,
        image: values.image || undefined,
      });

      if (error) {
        throw new Error(error.message || "Gagal memperbarui profil");
      }

      toast.success("Profil berhasil diperbarui");
      router.refresh();
    } catch (error: unknown) {
      const msg =
        error instanceof Error ? error.message : "Terjadi kesalahan sistem";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
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
            Kelola identitas personal, foto profil, dan kredensial akun
            marketplace Anda.
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
        <Card className="border-border/80 shadow-sm md:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              Foto Profil
            </CardTitle>
            <CardDescription className="text-xs">
              Foto ini akan ditampilkan di sidebar dan audit aktivitas.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center space-y-4">
            <div className="w-full max-w-[200px]">
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

        {/* Kolom Kanan: Form Data Profil & Informasi Kredensial */}
        <div className="space-y-6 md:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card className="border-border/80 shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm font-bold">
                  Informasi Personal
                </CardTitle>
                <CardDescription className="text-xs">
                  Perbarui nama lengkap dan detail profil Anda.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Input Nama Lengkap */}
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

                {/* Field Email (Read Only) */}
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-semibold">
                    Alamat Email (Akun Utama)
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
                  <p className="text-[10px] text-muted-foreground">
                    Email terikat dengan otentikasi akun dan tidak dapat diubah
                    secara langsung.
                  </p>
                </div>

                {/* Field Role & Scope System */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">
                    Role Perizinan Sistem
                  </Label>
                  <div className="flex items-center justify-between rounded-md border p-3 bg-muted/20">
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-foreground">
                        {isSuperAdmin ? "Super Admin" : "Admin (Seller)"}
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        {isSuperAdmin
                          ? "Akses penuh tata kelola marketplace, audit, dan manajemen pengelola."
                          : "Akses kelola toko personal dan publikasi jasa (Gig)."}
                      </p>
                    </div>
                    <KeyRound className="h-5 w-5 text-muted-foreground opacity-60 shrink-0" />
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
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <Save className="h-3.5 w-3.5" />
                        Simpan Perubahan
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </div>
  );
}
