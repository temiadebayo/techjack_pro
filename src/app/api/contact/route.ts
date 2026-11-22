import { NextResponse } from "next/server";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const VALID_CATEGORIES = new Set([
  "BOOKINGS",
  "PRESS & MEDIA",
  "MANAGEMENT",
  "COLLABORATIONS",
  "OTHER",
]);

const rateBucket = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateBucket.get(ip);
  if (!entry || entry.resetAt < now) {
    rateBucket.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  entry.count += 1;
  return entry.count > 6;
}

function sanitizeText(input: unknown, maxLength: number): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .trim()
    .slice(0, maxLength);
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "The message didn’t go through. Please try again in a moment.",
      },
      { status: 429 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid request payload." },
      { status: 400 }
    );
  }

  if (typeof body.website === "string" && body.website.trim().length > 0) {
    return NextResponse.json(
      { ok: false, message: "The message didn’t go through." },
      { status: 400 }
    );
  }

  const category = sanitizeText(body.category, 40).toUpperCase();
  const name = sanitizeText(body.name, 120);
  const email = sanitizeText(body.email, 254).toLowerCase();
  const message = sanitizeText(body.message, 4000);

  if (!VALID_CATEGORIES.has(category)) {
    return NextResponse.json(
      { ok: false, message: "Please select a valid enquiry category." },
      { status: 400 }
    );
  }

  if (!name || !EMAIL_PATTERN.test(email) || message.length < 10) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Please provide your name, a valid email address, and at least 10 characters in your message.",
      },
      { status: 400 }
    );
  }

  const webhookUrl = process.env.CONTACT_WEBHOOK_URL?.trim();
  if (!webhookUrl) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Contact routing is not connected yet. No message was delivered.",
      },
      { status: 503 }
    );
  }

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    const secret = process.env.CONTACT_WEBHOOK_SECRET?.trim();
    if (secret) {
      headers.Authorization = `Bearer ${secret}`;
    }

    const upstream = await fetch(webhookUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({
        source: "tech-jack-contact",
        category,
        name,
        email,
        message,
        submittedAt: new Date().toISOString(),
      }),
    });

    if (!upstream.ok) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "The message didn’t go through. Please try again or use the verified email listed on this page.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      ok: true,
      message:
        "Message sent. The details are in. You’ll hear back through the right channel.",
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message:
          "The message didn’t go through. Please try again or use the verified email listed on this page.",
      },
      { status: 502 }
    );
  }
}
