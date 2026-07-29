import { defineRelations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    parentId: uuid("parent_id"),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
  },
  (table) => [
    index("categories_parent_idx").on(table.parentId),
    index("categories_slug_idx").on(table.slug),
  ],
);

export const attributes = pgTable(
  "attributes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    categoryId: uuid("category_id")
      .references(() => categories.id, { onDelete: "cascade" })
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 100 }).notNull(),
  },
  (table) => [index("attributes_category_idx").on(table.categoryId)],
);

export const attributeOptions = pgTable(
  "attribute_options",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    attributeId: uuid("attribute_id")
      .references(() => attributes.id, { onDelete: "cascade" })
      .notNull(),
    label: varchar("label", { length: 255 }).notNull(),
    value: varchar("value", { length: 100 }).notNull(),
  },
  (table) => [index("attribute_options_attr_idx").on(table.attributeId)],
);

export const gigs = pgTable(
  "gigs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    sellerId: text("seller_id")
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    categoryId: uuid("category_id")
      .references(() => categories.id)
      .notNull(),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    about: text("about"), //  [DITAMBAHKAN] Deskripsi mendalam "About This Gig"
    coverImage: text("cover_image"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("gigs_category_idx").on(table.categoryId),
    index("gigs_seller_idx").on(table.sellerId),
  ],
);

export const gigAttributeOptions = pgTable(
  "gig_attribute_options",
  {
    gigId: uuid("gig_id")
      .references(() => gigs.id, { onDelete: "cascade" })
      .notNull(),
    attributeOptionId: uuid("attribute_option_id")
      .references(() => attributeOptions.id, { onDelete: "cascade" })
      .notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.gigId, table.attributeOptionId] }),
    index("gig_attr_gig_idx").on(table.gigId),
    index("gig_attr_option_idx").on(table.attributeOptionId),
  ],
);

// Enum tipe fitur checklist (apakah centang true/false, angka, atau teks)
export const packageFeatureTypeEnum = pgEnum("package_feature_type", [
  "boolean", // Untuk centang (✓) / silang (✗)
  "text", // Untuk teks kustom
  "number", // Untuk angka (misal: jumlah konsep = 2)
]);

// Master item baris komparasi berdasarkan kategori
// Contoh: Kategori 'Logo Design' punya baris: "Logo transparency", "Vector file", "3D mockup"
export const packageFeatures = pgTable(
  "package_features",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    categoryId: uuid("category_id")
      .references(() => categories.id, { onDelete: "cascade" })
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(), // e.g., "Vector file", "Printable file"
    type: packageFeatureTypeEnum("type").default("boolean").notNull(),
  },
  (table) => [index("package_features_category_idx").on(table.categoryId)],
);

export const packageTypeEnum = pgEnum("package_type", [
  "basic",
  "standard",
  "premium",
]);

export const gigPackages = pgTable(
  "gig_packages",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    gigId: uuid("gig_id")
      .references(() => gigs.id, { onDelete: "cascade" })
      .notNull(),
    packageType: packageTypeEnum("package_type").notNull(),
    title: varchar("title", { length: 255 }).notNull(), // e.g. "STARTUP", "STANDARD", "PREMIUM"
    description: text("description"), // Ringkasan singkat paket
    price: integer("price").notNull(),
    deliveryTimeDays: integer("delivery_time_days").notNull(),
    revisions: integer("revisions").notNull(),
  },
  (table) => [index("gig_packages_gig_idx").on(table.gigId)],
);

// Junction table yang menyimpan nilai/status checklist tiap paket
export const gigPackageFeatureValues = pgTable(
  "gig_package_feature_values",
  {
    gigPackageId: uuid("gig_package_id")
      .references(() => gigPackages.id, { onDelete: "cascade" })
      .notNull(),
    packageFeatureId: uuid("package_feature_id")
      .references(() => packageFeatures.id, { onDelete: "cascade" })
      .notNull(),
    isIncluded: boolean("is_included").default(false), // true = ✓, false = ✗
    value: text("value"), // Digunakan jika tipe feature adalah 'number' atau 'text' (e.g., "3")
  },
  (table) => [
    primaryKey({ columns: [table.gigPackageId, table.packageFeatureId] }),
    index("pkg_feat_val_pkg_idx").on(table.gigPackageId),
    index("pkg_feat_val_feat_idx").on(table.packageFeatureId),
  ],
);
export const relations = defineRelations(
  {
    user,
    session,
    account,
    verification,
    categories,
    attributes,
    attributeOptions,
    gigs,
    gigAttributeOptions,
    packageFeatures,
    gigPackages,
    gigPackageFeatureValues,
  },
  (r) => ({
    user: {
      sessions: r.many.session(),
      accounts: r.many.account(),
      gigs: r.many.gigs(),
    },
    session: {
      user: r.one.user({
        from: r.session.userId,
        to: r.user.id,
      }),
    },
    account: {
      user: r.one.user({
        from: r.account.userId,
        to: r.user.id,
      }),
    },
    categories: {
      parent: r.one.categories({
        from: r.categories.parentId,
        to: r.categories.id,
        alias: "categoryTree",
      }),
      subcategories: r.many.categories({
        alias: "categoryTree",
      }),
      attributes: r.many.attributes(),
      packageFeatures: r.many.packageFeatures(),
      gigs: r.many.gigs(),
    },
    attributes: {
      category: r.one.categories({
        from: r.attributes.categoryId,
        to: r.categories.id,
      }),
      options: r.many.attributeOptions(),
    },
    attributeOptions: {
      attribute: r.one.attributes({
        from: r.attributeOptions.attributeId,
        to: r.attributes.id,
      }),
      gigs: r.many.gigs({
        from: r.attributeOptions.id.through(
          r.gigAttributeOptions.attributeOptionId,
        ),
        to: r.gigs.id.through(r.gigAttributeOptions.gigId),
      }),
      gigAttributes: r.many.gigAttributeOptions(),
    },
    gigs: {
      seller: r.one.user({
        from: r.gigs.sellerId,
        to: r.user.id,
      }),
      category: r.one.categories({
        from: r.gigs.categoryId,
        to: r.categories.id,
      }),
      packages: r.many.gigPackages(),
      options: r.many.attributeOptions({
        from: r.gigs.id.through(r.gigAttributeOptions.gigId),
        to: r.attributeOptions.id.through(
          r.gigAttributeOptions.attributeOptionId,
        ),
      }),
      gigAttributes: r.many.gigAttributeOptions(),
    },
    gigAttributeOptions: {
      gig: r.one.gigs({
        from: r.gigAttributeOptions.gigId,
        to: r.gigs.id,
      }),
      option: r.one.attributeOptions({
        from: r.gigAttributeOptions.attributeOptionId,
        to: r.attributeOptions.id,
      }),
    },
    packageFeatures: {
      category: r.one.categories({
        from: r.packageFeatures.categoryId,
        to: r.categories.id,
      }),
      featureValues: r.many.gigPackageFeatureValues(),
    },
    gigPackages: {
      gig: r.one.gigs({
        from: r.gigPackages.gigId,
        to: r.gigs.id,
      }),
      featureValues: r.many.gigPackageFeatureValues(),
      // Akses langsung Many-to-Many ke master feature
      features: r.many.packageFeatures({
        from: r.gigPackages.id.through(r.gigPackageFeatureValues.gigPackageId),
        to: r.packageFeatures.id.through(
          r.gigPackageFeatureValues.packageFeatureId,
        ),
      }),
    },
    gigPackageFeatureValues: {
      gigPackage: r.one.gigPackages({
        from: r.gigPackageFeatureValues.gigPackageId,
        to: r.gigPackages.id,
      }),
      feature: r.one.packageFeatures({
        from: r.gigPackageFeatureValues.packageFeatureId,
        to: r.packageFeatures.id,
      }),
    },
  }),
);
