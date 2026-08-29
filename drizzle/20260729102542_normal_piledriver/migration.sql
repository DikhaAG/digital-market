DO $$ BEGIN
    CREATE TYPE "package_feature_type" AS ENUM('boolean', 'text', 'number');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "package_type" AS ENUM('basic', 'standard', 'premium');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
CREATE TABLE "account" (
	"id" text PRIMARY KEY,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "attribute_options" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"attribute_id" uuid NOT NULL,
	"label" varchar(255) NOT NULL,
	"value" varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "attributes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"category_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"parent_id" uuid,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL UNIQUE
);
--> statement-breakpoint
CREATE TABLE "gig_attribute_options" (
	"gig_id" uuid,
	"attribute_option_id" uuid,
	CONSTRAINT "gig_attribute_options_pkey" PRIMARY KEY("gig_id","attribute_option_id")
);
--> statement-breakpoint
CREATE TABLE "gig_package_feature_values" (
	"gig_package_id" uuid,
	"package_feature_id" uuid,
	"is_included" boolean DEFAULT false,
	"value" text,
	CONSTRAINT "gig_package_feature_values_pkey" PRIMARY KEY("gig_package_id","package_feature_id")
);
--> statement-breakpoint
CREATE TABLE "gig_packages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"gig_id" uuid NOT NULL,
	"package_type" "package_type" NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"price" integer NOT NULL,
	"delivery_time_days" integer NOT NULL,
	"revisions" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gigs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"seller_id" text NOT NULL,
	"category_id" uuid NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL UNIQUE,
	"about" text,
	"cover_image" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "package_features" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"category_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"type" "package_feature_type" DEFAULT 'boolean'::"package_feature_type" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL UNIQUE,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"email" text NOT NULL UNIQUE,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" ("user_id");--> statement-breakpoint
CREATE INDEX "attribute_options_attr_idx" ON "attribute_options" ("attribute_id");--> statement-breakpoint
CREATE INDEX "attributes_category_idx" ON "attributes" ("category_id");--> statement-breakpoint
CREATE INDEX "categories_parent_idx" ON "categories" ("parent_id");--> statement-breakpoint
CREATE INDEX "categories_slug_idx" ON "categories" ("slug");--> statement-breakpoint
CREATE INDEX "gig_attr_gig_idx" ON "gig_attribute_options" ("gig_id");--> statement-breakpoint
CREATE INDEX "gig_attr_option_idx" ON "gig_attribute_options" ("attribute_option_id");--> statement-breakpoint
CREATE INDEX "pkg_feat_val_pkg_idx" ON "gig_package_feature_values" ("gig_package_id");--> statement-breakpoint
CREATE INDEX "pkg_feat_val_feat_idx" ON "gig_package_feature_values" ("package_feature_id");--> statement-breakpoint
CREATE INDEX "gig_packages_gig_idx" ON "gig_packages" ("gig_id");--> statement-breakpoint
CREATE INDEX "gigs_category_idx" ON "gigs" ("category_id");--> statement-breakpoint
CREATE INDEX "gigs_seller_idx" ON "gigs" ("seller_id");--> statement-breakpoint
CREATE INDEX "package_features_category_idx" ON "package_features" ("category_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" ("identifier");--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "attribute_options" ADD CONSTRAINT "attribute_options_attribute_id_attributes_id_fkey" FOREIGN KEY ("attribute_id") REFERENCES "attributes"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "attributes" ADD CONSTRAINT "attributes_category_id_categories_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "gig_attribute_options" ADD CONSTRAINT "gig_attribute_options_gig_id_gigs_id_fkey" FOREIGN KEY ("gig_id") REFERENCES "gigs"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "gig_attribute_options" ADD CONSTRAINT "gig_attribute_options_lg67hTE3pNRC_fkey" FOREIGN KEY ("attribute_option_id") REFERENCES "attribute_options"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "gig_package_feature_values" ADD CONSTRAINT "gig_package_feature_values_gig_package_id_gig_packages_id_fkey" FOREIGN KEY ("gig_package_id") REFERENCES "gig_packages"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "gig_package_feature_values" ADD CONSTRAINT "gig_package_feature_values_8lCVP38HGvch_fkey" FOREIGN KEY ("package_feature_id") REFERENCES "package_features"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "gig_packages" ADD CONSTRAINT "gig_packages_gig_id_gigs_id_fkey" FOREIGN KEY ("gig_id") REFERENCES "gigs"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "gigs" ADD CONSTRAINT "gigs_seller_id_user_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "gigs" ADD CONSTRAINT "gigs_category_id_categories_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id");--> statement-breakpoint
ALTER TABLE "package_features" ADD CONSTRAINT "package_features_category_id_categories_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;
