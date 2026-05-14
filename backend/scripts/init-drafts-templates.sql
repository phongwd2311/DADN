CREATE TABLE IF NOT EXISTS public.draft_sessions (
  draft_id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
  draft_name VARCHAR(255) NOT NULL,
  input_json JSONB NOT NULL,
  result_json JSONB,
  created_at TIMESTAMP(6) NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP(6) NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_draft_sessions_user_updated
  ON public.draft_sessions(user_id, updated_at DESC);

CREATE TABLE IF NOT EXISTS public.input_templates (
  template_id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
  template_name VARCHAR(255) NOT NULL,
  input_json JSONB NOT NULL,
  created_at TIMESTAMP(6) NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP(6) NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_input_templates_user_updated
  ON public.input_templates(user_id, updated_at DESC);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'trg_draft_sessions_updated_at'
  ) THEN
    CREATE TRIGGER trg_draft_sessions_updated_at
      BEFORE UPDATE ON public.draft_sessions
      FOR EACH ROW
      EXECUTE FUNCTION public.set_updated_at();
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'trg_input_templates_updated_at'
  ) THEN
    CREATE TRIGGER trg_input_templates_updated_at
      BEFORE UPDATE ON public.input_templates
      FOR EACH ROW
      EXECUTE FUNCTION public.set_updated_at();
  END IF;
END
$$;
