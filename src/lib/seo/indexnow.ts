import { getSiteUrl } from "./config";

export interface IndexNowResult {
  submitted: boolean;
  status?: number;
  reason?: string;
}

/**
 * Gate 15: IndexNow notification utility.
 * Submits changed canonical URLs to participating search engines when INDEXNOW_KEY is set.
 */
export async function notifyIndexNow(urls: string[]): Promise<IndexNowResult> {
  const key = process.env.INDEXNOW_KEY?.trim();
  if (!key) {
    return { submitted: false, reason: "INDEXNOW_KEY is not configured." };
  }

  if (urls.length === 0) {
    return { submitted: false, reason: "No URLs provided." };
  }

  const siteUrl = getSiteUrl();
  const host = new URL(siteUrl).host;

  const response = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host,
      key,
      keyLocation: `${siteUrl}/${key}.txt`,
      urlList: urls,
    }),
  });

  return {
    submitted: response.ok,
    status: response.status,
    reason: response.ok ? undefined : `HTTP ${response.status}`,
  };
}
