"use server";

import { withAction } from "@/lib/actions/with-action";
import {
  createProjectService,
  updateProjectService,
  softDeleteProjectService,
} from "@/lib/services/projects.service";
import {
  createProjectTypeService,
  updateProjectTypeService,
  softDeleteProjectTypeService,
} from "@/lib/services/project-types.service";
import { upsertSeoMeta } from "@/lib/services/posts.service";
import slugify from "@/app/shared/utils/slugfy";
import { Json } from "@/types/supabase";

interface SeoInput {
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
}

interface ProjectInput {
  title: string;
  slug?: string;
  summary?: string;
  status?: "draft" | "published" | "archived";
  banner_image?: string;
  highlight_color?: string;
  start_date?: string;
  end_date?: string;
  content?: Json;
  tags?: string[];
  seo?: SeoInput;
}

interface ProjectTypeInput {
  name: string;
  slug?: string;
  status?: "draft" | "published" | "archived";
}

export const createProjectAction = async (input: ProjectInput) => {
  return withAction(async () => {
    const slug = input.slug?.trim() || slugify(input.title);
    const project = await createProjectService({ ...input, slug });

    if (input.seo?.seo_title && project?.id) {
      const seoId = await upsertSeoMeta(null, {
        seo_title: input.seo.seo_title,
        seo_description: input.seo.seo_description ?? null,
        seo_keywords: input.seo.seo_keywords ?? null,
        og_title: input.seo.og_title ?? null,
        og_description: input.seo.og_description ?? null,
        og_image: input.seo.og_image ?? null,
      });
      if (seoId) await updateProjectService(project.id, { seo_id: seoId } as never);
    }

    return project;
  });
};

export const updateProjectAction = async (
  id: string,
  currentSeoId: string | null,
  input: Partial<ProjectInput>,
) => {
  return withAction(async () => {
    const { seo, ...projectData } = input;
    const project = await updateProjectService(id, projectData);

    if (seo && (seo.seo_title || currentSeoId)) {
      const seoId = await upsertSeoMeta(currentSeoId, {
        seo_title: seo.seo_title || input.title || "",
        seo_description: seo.seo_description ?? null,
        seo_keywords: seo.seo_keywords ?? null,
        og_title: seo.og_title ?? null,
        og_description: seo.og_description ?? null,
        og_image: seo.og_image ?? null,
      });
      if (seoId && !currentSeoId) await updateProjectService(id, { seo_id: seoId } as never);
    }

    return project;
  });
};

export const deleteProjectAction = async (id: string) => {
  return withAction(async () => {
    await softDeleteProjectService(id);
    return { id };
  });
};

export const createProjectTypeAction = async (input: ProjectTypeInput) => {
  return withAction(async () => {
    const slug = input.slug?.trim() || slugify(input.name);
    return createProjectTypeService({ name: input.name, slug, status: input.status ?? "draft" });
  });
};

export const updateProjectTypeAction = async (id: string, input: Partial<ProjectTypeInput>) => {
  return withAction(async () => {
    const updates: { name?: string; slug?: string; status?: "draft" | "published" | "archived" } = {};
    if (input.name) updates.name = input.name;
    if (input.slug) updates.slug = input.slug;
    if (input.status) updates.status = input.status;
    return updateProjectTypeService(id, updates);
  });
};

export const deleteProjectTypeAction = async (id: string) => {
  return withAction(async () => {
    await softDeleteProjectTypeService(id);
    return { id };
  });
};
