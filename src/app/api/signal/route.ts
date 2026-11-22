import { NextResponse } from "next/server";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const rateBucket = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateBucket.get(ip);
  if (!entry || entry.resetAt < now) {
    rateBucket.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  entry.count += 1;
  return entry.count > 8;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { ok: false, message: "That didn’t go through. Try again in a moment." },
      { status: 429 }
    );
  }

  let body: { email?: unknown; consent?: unknown; website?: unknown };
  try {
    body = (await request.json()) as {
      email?: unknown;
      consent?: unknown;
      website?: unknown;
    };
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid request payload." },
      { status: 400 }
    );
  }

  // Honeypot triggered: silently reject spam without confirming backend state
  if (typeof body.website === "string" && body.website.trim().length > 0) {
    return NextResponse.json(
      { ok: false, message: "That didn’t go through. Try again in a moment." },
      { status: 400 }
    );
  }

  const email =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const consent = body.consent === true;

  if (!EMAIL_PATTERN.test(email) || email.length > 254) {
    return NextResponse.json(
      {
        ok: false,
        message: "That email doesn’t look right. Check it and try again.",
      },
      { status: 400 }
    );
  }

  if (!consent) {
    return NextResponse.json(
      {
        ok: false,
        message: "Consent is required to subscribe to updates from Tech Jack.",
      },
      { status: 400 }
    );
  }

  const webhookUrl = process.env.SIGNAL_WEBHOOK_URL?.trim();
  if (!webhookUrl) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "The Signal dispatch provider is not connected yet. No subscription was recorded.",
      },
      { status: 503 }
    );
  }

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    const secret = process.env.SIGNAL_WEBHOOK_SECRET?.trim();
    if (secret) {
      headers.Authorization = `Bearer ${secret}`;
    }

    const upstream = await fetch(webhookUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({
        source: "tech-jack-signal",
        email,
        consentedAt: new Date().toISOString(),
      }),
    });

    if (!upstream.ok) {
      return NextResponse.json(
        {
          ok: false,
          message: "That didn’t go through. Try again in a moment.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      ok: true,
      message:
        "You’re on the list. I’ll send something when there’s something to say.",
    });
  } catch {
    return NextResponse.json(
      { ok: false, message: "That didn’t go through. Try again in a moment." },
      { status: 502 }
    );
  }
}
