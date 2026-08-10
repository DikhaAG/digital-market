// src/components/ui/image-uploader.tsx
"use client";

import { useState, useRef, ChangeEvent, DragEvent } from "react";
import Image from "next/image";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { trpc } from "@/lib/trpc/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  value?: string | null;
  onChange: (url: string) => void;
  folder?: string;
  disabled?: boolean;
  className?: string;
  aspectRatio?: "video" | "square" | "banner";
}

export function ImageUploader({
  value,
  onChange,
  folder = "marketplace/gigs",
  disabled = false,
  className,
  aspectRatio = "video",
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getSignatureMutation = trpc.upload.getSignedUploadParams.useMutation();
  const deleteImageMutation = trpc.upload.deleteImage.useMutation();

  const aspectClasses = {
    video: "aspect-16/10",
    square: "aspect-square",
    banner: "aspect-3/1",
  };

  const handleUploadFile = async (file: File) => {
    // Validasi Ukuran & Tipe File (Maksimal 5MB)
    if (!file.type.startsWith("image/")) {
      toast.error("Harap pilih file berformat gambar (.jpg, .png, .webp)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran gambar tidak boleh melebihi 5MB");
      return;
    }

    try {
      setIsUploading(true);

      // 1. Minta Signed Parameters dari Server via tRPC
      const signedParams = await getSignatureMutation.mutateAsync({ folder });

      // 2. Siapkan FormData untuk dikirim langsung ke Cloudinary API
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", signedParams.apiKey);
      formData.append("timestamp", signedParams.timestamp.toString());
      formData.append("signature", signedParams.signature);
      formData.append("folder", signedParams.folder);

      // 3. Upload langsung dari Browser ke Cloudinary CDN
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${signedParams.cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error("Gagal mengunggah gambar ke CDN Cloudinary");
      }

      const data = await response.json();

      // Auto-optimization URL parameters (Auto format WebP/AVIF & Auto Quality)
      const optimizedUrl = data.secure_url.replace(
        "/upload/",
        "/upload/f_auto,q_auto/",
      );

      toast.success("Gambar berhasil diunggah");
      onChange(optimizedUrl);
    } catch (error: unknown) {
      const msg =
        error instanceof Error ? error.message : "Gagal mengunggah gambar";
      toast.error(msg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUploadFile(file);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled || isUploading) return;

    const file = e.dataTransfer.files?.[0];
    if (file) handleUploadFile(file);
  };

  const handleRemove = async () => {
    if (!value) return;

    try {
      // Hapus dari state form & opsional hapus dari Cloudinary
      const currentUrl = value;
      onChange("");

      await deleteImageMutation.mutateAsync({ imageUrl: currentUrl });
      toast.success("Gambar berhasil dihapus");
    } catch {
      // Abaikan error deletion CDN jika URL eksternal
    }
  };

  return (
    <div className={cn("w-full space-y-2", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled || isUploading}
      />

      {value ? (
        /* Preview Image View */
        <div
          className={cn(
            "relative w-full rounded-2xl overflow-hidden border border-border bg-muted group shadow-xs",
            aspectClasses[aspectRatio],
          )}
        >
          <Image
            src={value}
            alt="Uploaded Preview"
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-xs">
            <Button
              type="button"
              variant="destructive"
              size="icon-sm"
              onClick={handleRemove}
              disabled={disabled || deleteImageMutation.isPending}
              className="rounded-full shadow-md cursor-pointer"
              title="Hapus Gambar"
            >
              {deleteImageMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <X className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      ) : (
        /* Dropzone Upload View */
        <div
          onClick={() =>
            !disabled && !isUploading && fileInputRef.current?.click()
          }
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={cn(
            "flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl transition-all cursor-pointer text-center",
            aspectClasses[aspectRatio],
            isDragging
              ? "border-primary bg-primary/10"
              : "border-border hover:border-primary/50 bg-card hover:bg-muted/30",
            (disabled || isUploading) && "opacity-60 cursor-not-allowed",
          )}
        >
          {isUploading ? (
            <div className="flex flex-col items-center space-y-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-xs font-semibold text-muted-foreground">
                Mengunggah ke Cloudinary...
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2 text-muted-foreground">
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                {isDragging ? (
                  <Upload className="h-6 w-6 animate-bounce" />
                ) : (
                  <ImageIcon className="h-6 w-6" />
                )}
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-foreground">
                  Klik untuk unggah{" "}
                  <span className="font-normal text-muted-foreground">
                    atau seret gambar ke sini
                  </span>
                </p>
                <p className="text-[10px] text-muted-foreground">
                  PNG, JPG, WEBP hingga 5MB
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
