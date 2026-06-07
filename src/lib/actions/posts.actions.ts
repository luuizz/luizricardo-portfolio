"use server";

import { withAuthAction as withAction } from "@/lib/actions/with-action";
import {
  createPostService,
  updatePostService,
  softDeletePostService,
  upsertSeoMeta,
  syncPostCategories,
} from "@/lib/services/posts.service";
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

interface CreatePostInput {
  title: string;
  slug?: string;
  excerpt: string;
  status?: "draft" | "published" | "scheduled";
  content?: Json;
  tags?: string[];
  categoryIds?: string[];
  seo?: SeoInput;
}

interface UpdatePostInput extends Partial<Omit<CreatePostInput, "title">> {
  title?: string;
}

export const createPostAndPublish = async (input: CreatePostInput) => {
  return withAction(async () => {
    const slug = input.slug?.trim() || slugify(input.title);
    const post = await createPostService({
      title: input.title,
      slug,
      excerpt: input.excerpt,
      status: input.status,
      content: input.content,
      tags: input.tags,
      category: input.categoryIds?.[0] ?? undefined,
    });
    if (!post?.id) throw new Error("ID do post não retornado.");

    if (input.seo?.seo_title) {
      const seoId = await upsertSeoMeta(null, {
        seo_title: input.seo.seo_title,
        seo_description: input.seo.seo_description ?? null,
        seo_keywords: input.seo.seo_keywords ?? null,
        og_title: input.seo.og_title ?? null,
        og_description: input.seo.og_description ?? null,
        og_image: input.seo.og_image ?? null,
      });
      if (seoId) await updatePostService({ id: post.id, seo_id: seoId } as never);
    }

    if (input.categoryIds && input.categoryIds.length > 0) {
      await syncPostCategories(post.id, input.categoryIds);
    }

    return { id: post.id, slug: post.slug };
  });
};

export const updatePostAction = async (
  id: string,
  currentSeoId: string | null,
  input: UpdatePostInput,
) => {
  return withAction(async () => {
    const updateData: Record<string, unknown> = {};
    if (input.title !== undefined) updateData.title = input.title;
    if (input.slug !== undefined) updateData.slug = input.slug;
    if (input.excerpt !== undefined) updateData.excerpt = input.excerpt;
    if (input.status !== undefined) updateData.status = input.status;
    if (input.content !== undefined) updateData.content = input.content;
    if (input.tags !== undefined) updateData.tags = input.tags;
    if (input.categoryIds !== undefined) {
      updateData.category = input.categoryIds[0] ?? null;
    }

    if (input.seo && (input.seo.seo_title || currentSeoId)) {
      const seoId = await upsertSeoMeta(currentSeoId, {
        seo_title: input.seo.seo_title || input.title || "",
        seo_description: input.seo.seo_description ?? null,
        seo_keywords: input.seo.seo_keywords ?? null,
        og_title: input.seo.og_title ?? null,
        og_description: input.seo.og_description ?? null,
        og_image: input.seo.og_image ?? null,
      });
      if (seoId && !currentSeoId) updateData.seo_id = seoId;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const post = await updatePostService({ id, ...(updateData as any) });

    if (input.categoryIds !== undefined) {
      await syncPostCategories(id, input.categoryIds);
    }

    return post;
  });
};

export const deletePostAction = async (id: string) => {
  return withAction(async () => {
    await softDeletePostService(id);
    return { id };
  });
};
