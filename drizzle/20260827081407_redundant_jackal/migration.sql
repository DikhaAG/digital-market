CREATE TYPE "user_role" AS ENUM('super_admin', 'admin', 'user');--> statement-breakpoint
CREATE TABLE "site_settings" (
	"key" varchar(100) PRIMARY KEY,
	"value" text,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP INDEX "categories_slug_idx";--> statement-breakpoint
DROP INDEX "gig_attr_gig_idx";--> statement-breakpoint
ALTER TABLE "gigs" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "gigs" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "role" "user_role" DEFAULT 'user'::"user_role" NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "banned" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "attribute_options" ADD CONSTRAINT "attr_opt_attr_val_uq" UNIQUE("attribute_id","value");--> statement-breakpoint
ALTER TABLE "attributes" ADD CONSTRAINT "attr_category_slug_uq" UNIQUE("category_id","slug");--> statement-breakpoint
CREATE INDEX "gigs_deleted_at_idx" ON "gigs" ("deleted_at");--> statement-breakpoint
CREATE INDEX "user_role_idx" ON "user" ("role");--> statement-breakpoint
CREATE INDEX "user_email_idx" ON "user" ("email");--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_fk" FOREIGN KEY ("parent_id") REFERENCES "categories"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "gigs" DROP CONSTRAINT "gigs_category_id_categories_id_fkey", ADD CONSTRAINT "gigs_category_id_categories_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT;