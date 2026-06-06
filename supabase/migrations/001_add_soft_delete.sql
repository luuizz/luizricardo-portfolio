-- Soft delete: adiciona coluna deleted_at em todas as tabelas principais

ALTER TABLE public.posts
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

ALTER TABLE public.categories
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

ALTER TABLE public.project_types
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

ALTER TABLE public.media
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

-- Metadados de mídia (galeria estilo Prismic)
ALTER TABLE public.media
  ADD COLUMN IF NOT EXISTS alt_text TEXT DEFAULT NULL;
ALTER TABLE public.media
  ADD COLUMN IF NOT EXISTS title TEXT DEFAULT NULL;
ALTER TABLE public.media
  ADD COLUMN IF NOT EXISTS caption TEXT DEFAULT NULL;
ALTER TABLE public.media
  ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT NULL;

-- Índices para filtrar registros ativos rapidamente
CREATE INDEX IF NOT EXISTS idx_posts_deleted_at ON public.posts (deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_categories_deleted_at ON public.categories (deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_projects_deleted_at ON public.projects (deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_project_types_deleted_at ON public.project_types (deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_media_deleted_at ON public.media (deleted_at) WHERE deleted_at IS NULL;

-- Tabela de clientes (se não existir, cria)
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  sector_id UUID,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ DEFAULT NULL
);

-- Tabela de setores de clientes
CREATE TABLE IF NOT EXISTS public.client_sectors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ DEFAULT NULL
);

-- Tabela de orçamentos
CREATE TABLE IF NOT EXISTS public.budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  client_id UUID,
  total NUMERIC(12, 2),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'approved', 'rejected')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ DEFAULT NULL
);

-- FK opcional para clients
ALTER TABLE public.clients
  ADD COLUMN IF NOT EXISTS sector_id UUID REFERENCES public.client_sectors(id) ON DELETE SET NULL;
