"use server";

import { withAuthAction as withAction } from "@/lib/actions/with-action";
import {
  createCategoryService,
  updateCategoryService,
  softDeleteCategoryService,
} from "@/lib/services/categories.service";
import slugify from "@/app/shared/utils/slugfy";

interface CategoryInput {
  name: string;
  slug?: string;
  status?: "draft" | "scheduled" | "published";
}

export const createCategoryAction = async (input: CategoryInput) => {
  return withAction(async () => {
    const slug = input.slug?.trim() || slugify(input.name);
    const category = await createCategoryService({
      name: input.name,
      slug,
      status: input.status ?? "draft",
    });
    return category;
  });
};

export const updateCategoryAction = async (id: string, input: Partial<CategoryInput>) => {
  return withAction(async () => {
    const updates: { name?: string; slug?: string; status?: "draft" | "scheduled" | "published" } = {};
    if (input.name) updates.name = input.name;
    if (input.slug) updates.slug = input.slug;
    if (input.status) updates.status = input.status;
    const category = await updateCategoryService(id, updates);
    return category;
  });
};

export const deleteCategoryAction = async (id: string) => {
  return withAction(async () => {
    await softDeleteCategoryService(id);
    return { id };
  });
};
