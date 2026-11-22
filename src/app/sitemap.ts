import type { MetadataRoute } from "next";
import {
  getPublishedFragments,
  getPublishedProducts,
  getPublishedReleases,
  getPublishedVisuals,
} from "@/lib/cms/queries";
import { canonicalUrl } from "@/lib/seo/config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [releases, visuals, fragments, products] = await Promise.all([
    getPublishedReleases(),
    getPublishedVisuals(),
    getPublishedFragments(),
    getPublishedProducts(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: canonicalUrl("/"), changeFrequency: "weekly", priority: 1.0 },
    { url: canonicalUrl("/archive"), changeFrequency: "weekly", priority: 0.9 },
    { url: canonicalUrl("/visuals"), changeFrequency: "weekly", priority: 0.8 },
    { url: canonicalUrl("/persona"), changeFrequency: "monthly", priority: 0.85 },
    { url: canonicalUrl("/fragments"), changeFrequency: "weekly", priority: 0.85 },
    { url: canonicalUrl("/uniform"), changeFrequency: "weekly", priority: 0.7 },
    { url: canonicalUrl("/signal"), changeFrequency: "monthly", priority: 0.7 },
    { url: canonicalUrl("/contact"), changeFrequency: "monthly", priority: 0.7 },
    { url: canonicalUrl("/privacy"), changeFrequency: "yearly", priority: 0.3 },
    { url: canonicalUrl("/terms"), changeFrequency: "yearly", priority: 0.3 },
  ];

  const releaseEntries: MetadataRoute.Sitemap = releases.map((release) => ({
    url: canonicalUrl(`/archive/${release.slug}`),
    ...(release.releaseDate ? { lastModified: new Date(release.releaseDate) } : {}),
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  const visualEntries: MetadataRoute.Sitemap = visuals.map((visual) => ({
    url: canonicalUrl(`/visuals/${visual.slug}`),
    ...(visual.publishedDate
      ? { lastModified: new Date(visual.publishedDate) }
      : {}),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const fragmentEntries: MetadataRoute.Sitemap = fragments.map((fragment) => ({
    url: canonicalUrl(`/fragments/${fragment.slug}`),
    ...(fragment.date ? { lastModified: new Date(fragment.date) } : {}),
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: canonicalUrl(`/uniform/${product.slug}`),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    ...staticRoutes,
    ...releaseEntries,
    ...visualEntries,
    ...fragmentEntries,
    ...productEntries,
  ];
}
