"use server";

import { createClient } from "@/lib/supabase/server";
import { socialLinkSchema } from "@/lib/validators";
import { revalidatePath } from "next/cache";

export type ActionResult = {
  error?: string;
  success?: boolean;
};

export async function createSocialLink(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const parsed = socialLinkSchema.safeParse({
    platform: formData.get("platform"),
    url: formData.get("url"),
    label: formData.get("label") || null,
  });

  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { data: maxOrder } = await supabase
    .from("social_links")
    .select("sort_order")
    .eq("profile_id", user.id)
    .order("sort_order", { ascending: false })
    .limit(1)
    .single();

  const { error } = await supabase.from("social_links").insert({
    profile_id: user.id,
    platform: parsed.data.platform,
    url: parsed.data.url,
    label: parsed.data.label || null,
    sort_order: (maxOrder?.sort_order ?? -1) + 1,
  });

  if (error) {
    if (error.code === "23505") return { error: "You already have a link for this platform" };
    return { error: error.message };
  }

  revalidatePath("/dashboard/social-links");
  return { success: true };
}

export async function updateSocialLink(id: string, formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const parsed = socialLinkSchema.safeParse({
    platform: formData.get("platform"),
    url: formData.get("url"),
    label: formData.get("label") || null,
  });

  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { error } = await supabase
    .from("social_links")
    .update({
      platform: parsed.data.platform,
      url: parsed.data.url,
      label: parsed.data.label || null,
    })
    .eq("id", id)
    .eq("profile_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/social-links");
  return { success: true };
}

export async function deleteSocialLink(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("social_links")
    .delete()
    .eq("id", id)
    .eq("profile_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/social-links");
  return { success: true };
}

export async function toggleSocialLinkVisibility(id: string, isVisible: boolean): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("social_links")
    .update({ is_visible: isVisible })
    .eq("id", id)
    .eq("profile_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/social-links");
  return { success: true };
}
