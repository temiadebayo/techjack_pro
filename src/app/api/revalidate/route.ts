import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { canonicalUrl } from "@/lib/seo/config";
import { notifyIndexNow } from "@/lib/seo/indexnow";

interface SanityWebhookPayload {
  _type?: string;
  slug?: { current?: string } | string;
}

function resolvePaths(type?: string, slug?: string): string[] {
  const paths = new Set<string>(["/", "/sitemap.xml"]);

  switch (type) {
    case "release":
      paths.add("/archive");
      if (slug) paths.add(`/archive/${slug}`);
      break;
    case "visualWork":
      paths.add("/visuals");
      if (slug) paths.add(`/visuals/${slug}`);
      break;
    case "fragment":
      paths.add("/fragments");
      if (slug) paths.add(`/fragments/${slug}`);
      break;
    case "artistProfile":
      paths.add("/persona");
      break;
    case "product":
      paths.add("/uniform");
      if (slug) paths.add(`/uniform/${slug}`);
      break;
    case "siteSettings":
      paths.add("/archive");
      paths.add("/visuals");
      paths.add("/persona");
      paths.add("/fragments");
      paths.add("/uniform");
      paths.add("/signal");
      paths.add("/contact");
      break;
    default:
      break;
  }

  return Array.from(paths);
}

/**
 * Sanity Studio publish/update/delete webhook.
 * Revalidates affected Next.js routes and sitemap, then notifies IndexNow (Gate 15).
 */
export async function POST(request: Request) {
  const secret = process.env.SANITY_REVALIDATE_SECRET?.trim();
  const provided =
    request.headers.get("x-sanity-revalidate-secret") ||
    new URL(request.url).searchParams.get("secret");

  if (!secret || provided !== secret) {
    return NextResponse.json(
      { ok: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  let body: SanityWebhookPayload = {};
  try {
    body = (await request.json()) as SanityWebhookPayload;
  } catch {
    body = {};
  }

  const slug =
    typeof body.slug === "string" ? body.slug : body.slug?.current;
  const affectedPaths = resolvePaths(body._type, slug);

  for (const path of affectedPaths) {
    revalidatePath(path);
  }

  const indexableUrls = affectedPaths
    .filter((p) => p !== "/sitemap.xml")
    .map((p) => canonicalUrl(p));

  const indexNow = await notifyIndexNow(indexableUrls).catch(() => ({
    submitted: false,
    reason: "IndexNow request failed",
  }));

  return NextResponse.json({
    ok: true,
    revalidated: affectedPaths,
    indexNow,
  });
}
