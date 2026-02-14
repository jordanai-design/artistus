import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, profile_id, link_type, link_id, platform, url } = body;

    if (!type || !profile_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Extract metadata from request
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() ?? "unknown";
    const userAgent = request.headers.get("user-agent") ?? "";
    const referer = request.headers.get("referer") ?? null;

    // Simple device detection
    const isMobile = /mobile|android|iphone|ipad/i.test(userAgent);
    const isTablet = /tablet|ipad/i.test(userAgent);
    const deviceType = isTablet ? "tablet" : isMobile ? "mobile" : "desktop";

    // Simple browser detection
    const browser = /firefox/i.test(userAgent)
      ? "Firefox"
      : /edg/i.test(userAgent)
      ? "Edge"
      : /chrome/i.test(userAgent)
      ? "Chrome"
      : /safari/i.test(userAgent)
      ? "Safari"
      : "Other";

    // Anonymous visitor ID (hash of IP + user agent, not reversible)
    const encoder = new TextEncoder();
    const data = encoder.encode(`${ip}:${userAgent}`);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const visitorId = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 32);

    if (type === "page_view") {
      await supabase.from("page_views").insert({
        profile_id,
        visitor_id: visitorId,
        referrer: referer,
        device_type: deviceType,
        browser,
      });
    } else if (type === "link_click") {
      await supabase.from("link_clicks").insert({
        profile_id,
        link_type: link_type ?? "music",
        link_id: link_id ?? null,
        platform: platform ?? null,
        url: url ?? "",
        referrer: referer,
        device_type: deviceType,
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
