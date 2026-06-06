import { Tables } from "@/types/supabase";

export type Post = Tables<"posts">;
export type Video = Tables<"videos">;
export type Category = Tables<"categories">;
export type Project = Tables<"projects">;
export type ProjectType = Tables<"project_types">;
export type MediaItem = Tables<"media">;
export type Client = Tables<"clients">;
export type ClientSector = Tables<"client_sectors">;
export type Budget = Tables<"budgets">;
export type SeoMeta = Tables<"seo_meta">;

export type PostsWithCategory = Post & {
  categories: Pick<Category, "id" | "name" | "slug"> | null;
};

export type PostForEdit = Post & {
  seo: SeoMeta | null;
  post_categories: {
    category_id: string;
    categories: Pick<Category, "id" | "name" | "slug"> | null;
  }[];
};

export type ProjectWithTypes = Project & {
  project_type_relations: {
    project_types: Pick<ProjectType, "id" | "name" | "slug"> | null;
  }[];
};

export type ProjectForEdit = Project & {
  seo: SeoMeta | null;
  project_type_relations: {
    project_types: Pick<ProjectType, "id" | "name" | "slug"> | null;
  }[];
};
