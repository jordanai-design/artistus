import { createAdminClient } from "@/lib/supabase/admin";
import { subscriberSchema } from "@/lib/validators";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, profile_id } = body;

    if (!profile_id) {
      return NextResponse.json({ error: "Missing profile_id" }, { status: 400 });
    }

    const parsed = subscriberSchema.safeParse({ email, name: name || null });
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { error } = await supabase.from("subscribers").insert({
      profile_id,
      email: parsed.data.email,
      name: parsed.data.name || null,
      source: "public_page",
    });

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "You're already subscribed!" },
          { status: 409 }
        );
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
