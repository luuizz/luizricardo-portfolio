-- ============================================================
-- 003: Storage bucket policies + Videos table
-- Execute no SQL Editor do Supabase
-- ============================================================

-- ─── Storage bucket "media" ─────────────────────────────────
-- Cria o bucket se não existir (público)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  true,
  52428800, -- 50 MB
  ARRAY['image/jpeg','image/jpg','image/png','image/webp','image/gif','image/svg+xml','video/mp4','video/webm','video/ogg']
)
ON CONFLICT (id) DO UPDATE
  SET public = true,
      file_size_limit = 52428800;

-- Políticas de storage (RLS)
DO $$
BEGIN
  -- Qualquer pessoa pode ver
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Public read media'
  ) THEN
    CREATE POLICY "Public read media"
      ON storage.objects FOR SELECT
      USING (bucket_id = 'media');
  END IF;

  -- Apenas usuários autenticados podem fazer upload
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Authenticated upload media'
  ) THEN
    CREATE POLICY "Authenticated upload media"
      ON storage.objects FOR INSERT TO authenticated
      WITH CHECK (bucket_id = 'media');
  END IF;

  -- Apenas usuários autenticados podem atualizar
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Authenticated update media'
  ) THEN
    CREATE POLICY "Authenticated update media"
      ON storage.objects FOR UPDATE TO authenticated
      USING (bucket_id = 'media');
  END IF;

  -- Apenas usuários autenticados podem deletar
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Authenticated delete media'
  ) THEN
    CREATE POLICY "Authenticated delete media"
      ON storage.objects FOR DELETE TO authenticated
      USING (bucket_id = 'media');
  END IF;
END $$;

-- ─── Tabela de vídeos ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.videos (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  description TEXT,
  url         TEXT NOT NULL,
  thumbnail   TEXT,
  platform    TEXT DEFAULT 'youtube' CHECK (platform IN ('youtube', 'vimeo', 'other')),
  category    TEXT DEFAULT 'tutorial' CHECK (category IN ('tutorial', 'talk', 'course', 'other')),
  status      TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  duration    TEXT,
  slug        TEXT UNIQUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at  TIMESTAMPTZ DEFAULT NULL
);

CREATE INDEX IF NOT EXISTS idx_videos_deleted_at ON public.videos (deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_videos_status     ON public.videos (status);
CREATE INDEX IF NOT EXISTS idx_videos_slug       ON public.videos (slug);

-- RLS
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'videos' AND policyname = 'Authenticated manage videos'
  ) THEN
    CREATE POLICY "Authenticated manage videos"
      ON public.videos FOR ALL TO authenticated
      USING (true) WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'videos' AND policyname = 'Public view published videos'
  ) THEN
    CREATE POLICY "Public view published videos"
      ON public.videos FOR SELECT
      USING (status = 'published' AND deleted_at IS NULL);
  END IF;
END $$;

-- Trigger para updated_at automático
CREATE OR REPLACE FUNCTION update_videos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_videos_updated_at ON public.videos;
CREATE TRIGGER trg_videos_updated_at
  BEFORE UPDATE ON public.videos
  FOR EACH ROW EXECUTE FUNCTION update_videos_updated_at();
