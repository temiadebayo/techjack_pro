export type AnalyticsEventName =
  | "outbound_streaming_click"
  | "video_play"
  | "newsletter_success"
  | "contact_submission"
  | "product_checkout_click"
  | "section_navigation";

export interface AnalyticsPayload {
  [key: string]: string | number | boolean | undefined;
}

/**
 * Privacy-conscious event dispatcher (Build Brief §12).
 * Emits zero cookies and sends data only when an explicit analytics endpoint is configured.
 */
export function trackEvent(
  event: AnalyticsEventName,
  payload: AnalyticsPayload = {}
): void {
  if (typeof window === "undefined") return;

  const endpoint = process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT?.trim();
  const siteId = process.env.NEXT_PUBLIC_ANALYTICS_SITE_ID?.trim();

  if (!endpoint) return;

  try {
    const body = JSON.stringify({
      event,
      siteId: siteId || "tech-jack-7926",
      path: window.location.pathname,
      payload,
      ts: Date.now(),
    });

    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        endpoint,
        new Blob([body], { type: "application/json" })
      );
    } else {
      void fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      });
    }
  } catch {
    // Analytics must never interrupt user interaction.
  }
}
