import type { Metadata } from "next";

export function createDashboardMeta(pageTitle: string): Metadata {
  return {
    title: `Dashboard | ${pageTitle}`,
  };
}

export async function createDynamicDashboardMeta<T>(
  params: Promise<T>,
  getTitle: (resolvedParams: T) => string,
): Promise<Metadata> {
  const resolved = await params;

  return {
    title: `Dashboard | ${getTitle(resolved)}`,
  };
}
