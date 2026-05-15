-- Align calculation_sessions with SR-03 naming and status requirements.
ALTER TABLE "public"."calculation_sessions"
  ALTER COLUMN "session_name" TYPE VARCHAR(100);

ALTER TABLE "public"."calculation_sessions"
  ADD COLUMN IF NOT EXISTS "status" VARCHAR(20);

UPDATE "public"."calculation_sessions"
SET "status" = 'DRAFT'
WHERE "status" IS NULL;

ALTER TABLE "public"."calculation_sessions"
  ALTER COLUMN "status" SET DEFAULT 'DRAFT',
  ALTER COLUMN "status" SET NOT NULL;

ALTER TABLE "public"."calculation_sessions"
  ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;
