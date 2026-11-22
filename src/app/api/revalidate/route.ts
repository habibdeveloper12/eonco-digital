import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { WP_TAG } from "@/lib/wordpress";

/**
 * Called by the Eonco Headless WordPress plugin whenever a post, project or
 * testimonial is published, updated or deleted, so the site shows the change
 * within seconds instead of waiting for the 5 minute cache.
 *
 * POST /api/revalidate   header: x-revalidate-secret: <REVALIDATE_SECRET>
 */
export async function POST(req: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || req.headers.get("x-revalidate-secret") !== secret) {
    return NextResponse.json({ ok: false, error: "Invalid secret" }, { status: 401 });
  }
  revalidateTag(WP_TAG);
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, revalidated: Date.now() });
}
