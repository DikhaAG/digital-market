# 📑 Product Requirement Document (PRD)

---

## Executive Summary & Visi Produk

### 1.1 Ringkasan Eksekutif

Dokumen ini mendefinisikan spesifikasi produk dan teknis untuk **Categories & Relational Management System**, sebuah modul administrasi tingkat enterprise yang dirancang untuk mengelola hirarki katalog, matriks komparasi fitur paket, serta kustomisasi atribut filter pada marketplace jasa digital (_Gigs Marketplace_).

Sistem ini memungkinkan tim _Catalog Operations_ dan _Admin_ untuk secara fleksibel menyusun struktur taksonomi produk tanpa _hardcoding_, yang secara langsung menggerakkan navigasi pencarian pembeli (_Buyer_) dan form pembuatan penawaran penjual (_Seller_).

### 1.2 Tujuan Strategis & OKR

- **Operational Efficiency**: Mengurangi waktu konfigurasi taksonomi kategori dan atribut baru dari _hours_ menjadi _minutes_.
- **Catalog Scalability**: Mendukung struktur hirarki multi-level (Parent-Sub) beserta relasi atribut dinamis tanpa mengorbankan performa query backend.

- **Zero Runtime Overhead**: Memastikan seluruh tipe data, skema validasi, dan inferensi tRPC terkoordinasi secara ketat (_End-to-End Type Safety_) untuk menekan angka _runtime errors_ hingga 0%.

---

## 👥 Personas & Problem Statement

| Persona                    | Peran & Responsibilitas                                       | Main Pain Points | Ekspektasi Solusi |
| -------------------------- | ------------------------------------------------------------- | ---------------- | ----------------- |
| **Platform Administrator** | Mengelola taksonomi produk, kategori, dan filter marketplace. |

| Harus meminta developer mengubah kode tiap ada kategori/filter baru. | Dashboard administratif visual yang intuitif untuk CRUD Kategori, Atribut, dan Fitur secara _live_.

|
| **Service Seller (Freelancer)** | Membuat paket penawaran (_Basic, Standard, Premium_) di marketplace. | Opsi checklist paket tidak seragam antar kategori, membingungkan saat _gig creation_. | Struktur fitur paket yang jelas dan terstandarisasi per sub-kategori.

|
| **Buyer / Consumer** | Mencari dan membandingkan jasa sesuai kebutuhan spesifik. | Filter pencarian terlalu umum, sulit menemukan jasa dengan preferensi khusus. | Filter atribut dinamis yang akurat berdasarkan sub-kategori spesifik.

|

---

## 🏗️ Model Data & Relasi Taksonomi (ERD Specs)

Struktur relasi data dibangun berprinsip _Relational Tree Hierarchy_:

```
[Parent Category] (1) ──── (N) [Sub Category]
                                    │
            ┌───────────────────────┴───────────────────────┐
            │ (1)                                       (1) │
            ▼ (N)                                       ▼ (N)
  [Package Feature]                             [Attribute Filter]
  (Type: boolean|text|number)                               │
                                                        (1) │
                                                            ▼ (N)
                                                   [Attribute Option]

```

### Spesifikasi Entitas & Skema Validation (Zod)

| Entitas                 | Field Utama                           | Aturan Validasi (Zod Schema)                 | Deskripsi Relasi |
| ----------------------- | ------------------------------------- | -------------------------------------------- | ---------------- |
| **Parent Category**<br> | `id`, `name`, `slug`, `icon`, `image` | `name`: min 2 char. `image`: URL valid/null. |

| Root level taksonomi.

|
| **Sub Category**<br> | `id`, `parentId`, `name`, `slug`, `icon`, `image` | Extended dari Parent + `parentId` (UUID valid).

| Belongs to `ParentCategory`.

|
| **Package Feature**<br> | `id`, `categoryId`, `name`, `type` | `type`: Enum (`boolean`, `text`, `number`).

| Checklist komparasi paket per Sub-kategori.

|
| **Attribute Filter**<br> | `id`, `categoryId`, `name`, `slug` | `name`: min 2 char.

| Filter kustom pencarian per Sub-kategori.

|
| **Attribute Option**<br> | `id`, `attributeId`, `label`, `value` | `label` & `value`: non-empty string.

| Opsi pilihan filter (misal: Python, React).

|

---

## 📑 Functional Requirements (FR)

### FR-1: Manajemen Kategori Utama (Parent Category)

- **FR-1.1**: Admin dapat membuat Parent Category baru melalui modal dialog `CreateParentCategoryDialog`.

- **FR-1.2**: Sistem harus melakukan _auto-slugification_ secara _real-time_ dari input `name` menggunakan utility function `slugify()`.

- **FR-1.3**: Admin dapat menyertakan rincian opsional seperti _Icon Lucide_ dan _URL Image CDN_.

- **FR-1.4**: Menampilkan badge `slug` dan indikator jumlah sub-kategori di dalam kartu visual.

### FR-2: Manajemen Sub-Kategori & Relasi

- **FR-2.1**: Admin dapat menambahkan Sub-kategori terikat di bawah Parent Category spesifik melalui `CreateSubCategoryDialog`.

- **FR-2.2**: Sub-kategori menampilkan total _Gigs_ aktif yang terikat.

- **FR-2.3**: Setiap Sub-kategori menyediakan tampilan tab terpisah (_Tabs Container_) untuk mengelola **Package Features** dan **Filter Attributes**.

### FR-3: Matriks Fitur Paket Komparasi (Package Features)

- **FR-3.1**: Admin dapat menambah item fitur paket dengan tipe data terstruktur (`boolean`, `text`, `number`) via `PackageFeaturesTab`.

- **FR-3.2**: Fitur ditampilkan dalam bentuk _pill-badge_ ringkas yang dilengkapi tipe data dan tombol hapus cepat.

### FR-4: Sistem Atribut Filter Dinamis (Filter Attributes & Options)

- **FR-4.1**: Admin dapat membuat grup atribut baru (contoh: _Programming Language_) di bawah Sub-kategori.

- **FR-4.2**: Admin dapat menambah/menghapus opsi atribut (_Attribute Options_) secara _inline_ tanpa membuka modal baru (contoh: _TypeScript_, _Python_).

- **FR-4.3**: Sistem wajib menampilkan umpan balik validasi jika input opsi kosong.

### FR-5: Penghapusan Entitas Safety Guard

- **FR-5.1**: Seluruh tindakan penghapusan (Parent, Sub, Attribute, Feature) wajib dikonfirmasi melalui modal `DeleteConfirmDialog`.

- **FR-5.2**: Modal konfirmasi wajib memperingatkan dampak _cascade delete_ pada data turunan.

---

## 🏛️ Arsitektur Teknikal & Kode Best Approach

### 5.1 Stack Teknologi & Pilihan Arsitektur

- **Framework**: Next.js (App Router, Client Components).

- **API & Data Transport**: tRPC v11 dengan _End-to-End Type Safety_.

- **Form & Validation**: React Hook Form + Zod.

- **UI Components**: Tailwind CSS, Shadcn UI (Radix Primitives), Lucide Icons.

- **Feedback & State Invalidation**: Sonner Toast + Custom Hook `useCategoryTreeMutation` untuk penanganan pemicu `utils.admin.getCategoryTree.invalidate()` secara otomatis.

### 5.2 Struktur Folder Modular (Feature-Driven Structure)

```text
src/app/admin/categories/
├── _hooks/
│   └── use-category-tree-mutation.ts      # Hook mutasi tRPC & invalidate terpusat
├── _schemas/
│   └── category-admin.schema.ts           # Zod Schema & Centralized Router Types
├── components/
│   ├── dialogs/
│   │   ├── base-admin-dialog.tsx          # Reusable Dialog Primitive
│   │   ├── category-form-fields.tsx       # Reusable Form Partials (Name, Icon, CDN)
│   │   ├── create-parent-category-dialog.tsx
│   │   ├── create-sub-category-dialog.tsx
│   │   ├── create-package-feature-dialog.tsx
│   │   ├── create-attribute-dialog.tsx
│   │   ├── create-attribute-option-dialog.tsx
│   │   └── index.ts                       # Barrel Export
│   ├── parent-category-card.tsx           # Parent Layout Container
│   ├── sub-category-card.tsx              # Sub Category & Tabs Container
│   ├── package-features-tab.tsx           # Inline Feature Management
│   ├── filter-attributes-tab.tsx          # Inline Attribute & Option Grid
│   └── delete-confirm-dialog.tsx          # Reusable Confirmation Modal
└── page.tsx                               # Entry Point Dashboard Admin

```

---

## 🎨 UI/UX Specifications & State Handling

### 6.1 Layout Hierarchy & Feedback Patterns

1. **Header Section**: Judul modul, deskripsi operasional, dan CTA utama `Tambah Kategori Utama`.

2. **Skeleton Loading State**: Tampilan placeholder berbasis `<Skeleton/>` saat query tRPC `getCategoryTree` sedang _fetching_.

3. **Empty State Alert**: Penanda visual saat belum ada kategori utama yang dikonfigurasi.

4. **Optimistic & Mutation Feedback**: Tombol form menampilkan spinner `<Loader2 className="animate-spin"/>` dan dinonaktifkan (`disabled`) saat mutasi berjalan untuk mencegah duplikasi submit.

---

## 🔒 Non-Functional Requirements (NFR)

- **Type Safety & Leak Prevention**: Tidak ada penggunaan `any` eksplisit. Seluruh impor dari file server wajib menggunakan `import type` untuk mencegah kebocoran modul backend ke client bundle.

- **Performance (P95 Latency)**: Invalidasi cache tRPC secara selektif via `useCategoryTreeMutation` tanpa melakukan _full-page re-render_.

- **Accessibility (a11y)**: Modal dialog menggunakan standar ARIA (Radix UI) dengan dukungan tombol `ESC` dan perangkap fokus keyboard (_Focus Trap_).

---

## 🧪 Matrix Edge Cases & Resilience Strategy

| Edge Case                      | Resiko                     | Strategi Mitigasi / Penanganan               |
| ------------------------------ | -------------------------- | -------------------------------------------- |
| **Input URL CDN Gambar Salah** | Form error / gambar rusak. | Di-validate ketat menggunakan Zod `z.url()`. |

|
| **Nama Kategori Mengandung Karakter Spesial** | Slug URL rusak / Batal di-query. | Utility `slugify()` membersihkan regex `/[^\w\s-]/g` secara otomatis.

|
| **Penghapusan Parent Kategori Berisi Sub-Kategori** | Data orphan di database. | Dialirkan melalui `DeleteConfirmDialog` dan ditangani secara _cascade delete_ aman di level database/tRPC mutation.

|
| **Koneksi Terputus Saat Submit Form** | User bingung apakah data terinput. | Handler `onError` menangkap pesan error jaringan dan menampilkan Toast Sonner spesifik.

|

---

## 📊 Observability & KPI Monitoring

- **Category Management Success Rate**: Presentase sukses pembuatan/pengubahan taksonomi tanpa error validasi (> 98%).
- **Query Latency Index**: Waktu yang dibutuhkan tRPC untuk menyajikan `getCategoryTree` (< 200ms P95).
- **System Resilience**: 0% client-side crash yang disebabkan oleh `undefined` null-value pada input opsional.
