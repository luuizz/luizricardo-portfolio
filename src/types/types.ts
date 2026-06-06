import { Database } from "./supabase";

export type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];
export type PostRow = Database["public"]["Tables"]["posts"]["Row"];
export type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];
export type ProjectTypeRow =
  Database["public"]["Tables"]["project_types"]["Row"];

export type ProjectWithRelations = ProjectRow & {
  project_type_relations?: Array<{
    project_types: ProjectTypeRow;
  }>;
};

export type PostWithCategory = PostRow & {
  categories?: {
    id: string;
    name: string;
    slug: string;
  } | null;
};

export type TableVariantItem =
  | { variant: "projects"; item: ProjectWithRelations }
  | { variant: "posts"; item: PostWithCategory }
  | { variant: "post-categories"; item: CategoryRow }
  | { variant: "project-categories"; item: ProjectTypeRow };
