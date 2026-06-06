"use server";

import { withAction } from "@/lib/actions/with-action";
import {
  createVideoService,
  updateVideoService,
  softDeleteVideoService,
} from "@/lib/services/videos.service";
import slugify from "@/app/shared/utils/slugfy";

function extractYoutubeThumbnail(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  if (match) return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
  return null;
}

function detectPlatform(url: string): string {
  if (/youtube\.com|youtu\.be/.test(url)) return "youtube";
  if (/vimeo\.com/.test(url)) return "vimeo";
  return "other";
}

interface VideoInput {
  title: string;
  url: string;
  description?: string;
  thumbnail?: string;
  category?: string;
  status?: string;
  duration?: string;
  slug?: string;
}

export const createVideoAction = async (input: VideoInput) =>
  withAction(async () => {
    const slug = input.slug?.trim() || slugify(input.title);
    const platform = detectPlatform(input.url);
    const thumbnail = input.thumbnail || extractYoutubeThumbnail(input.url) || undefined;

    const video = await createVideoService({
      title: input.title,
      slug,
      url: input.url,
      description: input.description,
      thumbnail,
      platform,
      category: input.category ?? "tutorial",
      status: input.status ?? "draft",
      duration: input.duration,
    });

    return { id: video.id, slug: video.slug };
  });

export const updateVideoAction = async (id: string, input: Partial<VideoInput>) =>
  withAction(async () => {
    const updateData: Parameters<typeof updateVideoService>[1] = {};
    if (input.title !== undefined) updateData.title = input.title;
    if (input.url !== undefined) {
      updateData.url = input.url;
      updateData.platform = detectPlatform(input.url);
      if (!input.thumbnail) {
        updateData.thumbnail = extractYoutubeThumbnail(input.url) ?? null;
      }
    }
    if (input.description !== undefined) updateData.description = input.description ?? null;
    if (input.thumbnail !== undefined) updateData.thumbnail = input.thumbnail ?? null;
    if (input.category !== undefined) updateData.category = input.category;
    if (input.status !== undefined) updateData.status = input.status;
    if (input.duration !== undefined) updateData.duration = input.duration ?? null;
    if (input.slug !== undefined) updateData.slug = input.slug;

    const video = await updateVideoService(id, updateData);
    return { id: video.id };
  });

export const deleteVideoAction = async (id: string) =>
  withAction(async () => {
    await softDeleteVideoService(id);
    return { id };
  });
