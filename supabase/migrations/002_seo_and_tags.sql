-- SEO: adicionar og_title e og_description ao seo_meta
ALTER TABLE public.seo_meta
  ADD COLUMN IF NOT EXISTS og_title TEXT DEFAULT NULL;

ALTER TABLE public.seo_meta
  ADD COLUMN IF NOT EXISTS og_description TEXT DEFAULT NULL;

-- Tags para posts e projetos
ALTER TABLE public.posts
  ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT NULL;

ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT NULL;
