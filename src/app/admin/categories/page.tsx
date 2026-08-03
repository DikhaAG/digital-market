"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { Plus, Folder, CheckSquare, Layers, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function CategoryAdminPage() {
  const utils = trpc.useUtils();
  const { data: categoryTree, isLoading } =
    trpc.admin.getCategoryTree.useQuery();

  // Form State Tambah Feature Master
  const [selectedCatId, setSelectedCatId] = useState<string | null>(null);
  const [featureName, setFeatureName] = useState("");
  const [featureType, setFeatureType] = useState<"boolean" | "text" | "number">(
    "boolean",
  );

  // Mutation Tambah Feature Master
  const addFeatureMutation = trpc.admin.addPackageFeature.useMutation({
    onSuccess: () => {
      utils.admin.getCategoryTree.invalidate();
      setFeatureName("");
      setSelectedCatId(null);
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-foreground">
            Category & Package Feature Manager
          </h2>
          <p className="text-sm text-muted-foreground">
            Kelola struktur hirarki kategori dan master checklist fitur paket
            komparasi.
          </p>
        </div>
      </div>

      {/* Tree View Kategori & Features */}
      <div className="space-y-4">
        {categoryTree?.map((parent) => (
          <div
            key={parent.id}
            className="border border-border rounded-2xl bg-card overflow-hidden shadow-sm"
          >
            {/* Header Parent Category */}
            <div className="p-4 bg-muted/40 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Folder className="h-5 w-5 text-primary" />
                <span className="font-extrabold text-foreground text-base">
                  {parent.name}
                </span>
                <Badge variant="outline" className="text-xs">
                  {parent.slug}
                </Badge>
              </div>
            </div>

            {/* List Sub-Kategori & Master Features */}
            <div className="p-4 space-y-4">
              {parent.subcategories.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">
                  Belum ada sub-kategori di bawah {parent.name}.
                </p>
              ) : (
                parent.subcategories.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-4 rounded-xl border border-border/60 bg-background space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Layers className="h-4 w-4 text-muted-foreground" />
                        <span className="font-bold text-sm text-foreground">
                          {sub.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ({sub.slug})
                        </span>
                      </div>

                      {/* Modal Trigger Tambah Feature Master */}
                      <Dialog>
                        <DialogTrigger
                          render={
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedCatId(sub.id)}
                              className="h-8 text-xs gap-1.5"
                            >
                              <Plus className="h-3.5 w-3.5" />
                              Tambah Package Feature
                            </Button>
                          }
                        ></DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              Tambah Master Feature untuk {sub.name}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 pt-4">
                            <Input
                              placeholder="Contoh: Vector file, Number of pages"
                              value={featureName}
                              onChange={(e) => setFeatureName(e.target.value)}
                            />
                            <select
                              value={featureType}
                              onChange={(e) =>
                                setFeatureType(
                                  e.target.value as
                                    "boolean" | "text" | "number",
                                )
                              }
                              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                            >
                              <option value="boolean">Boolean (✓ / ✗)</option>
                              <option value="number">
                                Number (Angka/Jumlah)
                              </option>
                              <option value="text">Text (Kustom)</option>
                            </select>
                            <Button
                              className="w-full"
                              disabled={
                                addFeatureMutation.isPending || !featureName
                              }
                              onClick={() => {
                                if (selectedCatId) {
                                  addFeatureMutation.mutate({
                                    categoryId: selectedCatId,
                                    name: featureName,
                                    type: featureType,
                                  });
                                }
                              }}
                            >
                              Simpan Feature
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>

                    {/* Master Features Chip List */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {sub.packageFeatures.map((feat) => (
                        <div
                          key={feat.id}
                          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-muted text-xs font-semibold text-foreground border border-border"
                        >
                          <CheckSquare className="h-3.5 w-3.5 text-primary" />
                          <span>{feat.name}</span>
                          <span className="text-[10px] text-muted-foreground uppercase">
                            ({feat.type})
                          </span>
                        </div>
                      ))}
                      {sub.packageFeatures.length === 0 && (
                        <span className="text-xs text-muted-foreground italic">
                          Belum ada master package feature.
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
