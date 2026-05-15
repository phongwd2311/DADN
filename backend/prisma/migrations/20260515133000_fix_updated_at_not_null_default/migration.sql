-- Ensure updated_at matches contract: NOT NULL + default current timestamp.
UPDATE "public"."calculation_sessions"
SET "updated_at" = COALESCE("updated_at", "created_at", CURRENT_TIMESTAMP)
WHERE "updated_at" IS NULL;

ALTER TABLE "public"."calculation_sessions"
  ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP,
  ALTER COLUMN "updated_at" SET NOT NULL;
