import { NextResponse } from "next/server";
import { notifyIndexNow } from "@/lib/seo/indexnow";

export async function POST(request: Request) {
  const secret = process.env.INDEXNOW_API_SECRET?.trim();
  const authHeader = request.headers.get("authorization");

  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json(
      { ok: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  let body: { urls?: unknown };
  try {
    body = (await request.json()) as { urls?: unknown };
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid JSON payload" },
      { status: 400 }
    );
  }

  const urls = Array.isArray(body.urls)
    ? body.urls.filter((u): u is string => typeof u === "string")
    : [];

  const result = await notifyIndexNow(urls);
  return NextResponse.json(result, { status: result.submitted ? 200 : 503 });
}
