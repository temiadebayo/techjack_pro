import { createClient, type SanityClient } from "next-sanity";
import createImageUrlBuilder from "@sanity/image-url";
import { apiVersion, dataset, isSanityConfigured, projectId } from "./env";

let cachedClient: SanityClient | null = null;

export function getSanityClient(): SanityClient | null {
  if (!isSanityConfigured()) return null;

  if (!cachedClient) {
    cachedClient = createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
      token: process.env.SANITY_API_READ_TOKEN?.trim() || undefined,
      perspective: "published",
    });
  }

  return cachedClient;
}

export function urlForSanityImage(
  source: unknown,
  width = 1600
): string | null {
  if (!isSanityConfigured() || !source) return null;
  try {
    const builder = createImageUrlBuilder({ projectId, dataset });
    return builder
      .image(source as Parameters<typeof builder.image>[0])
      .width(width)
      .auto("format")
      .quality(85)
      .url();
  } catch {
    return null;
  }
}
