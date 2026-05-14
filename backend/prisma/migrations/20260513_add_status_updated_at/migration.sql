-- Add status and updated_at columns to calculation_sessions table
ALTER TABLE "public"."calculation_sessions" ADD COLUMN "status" VARCHAR(20) NOT NULL DEFAULT 'DRAFT';
ALTER TABLE "public"."calculation_sessions" ADD COLUMN "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;
