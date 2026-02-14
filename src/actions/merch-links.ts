"use server";

import { createClient } from "@/lib/supabase/server";
import { merchLinkSchema } from "@/lib/validators";
import { revalidatePath } from "next/cache";

export type ActionResult = {
  error?: string;
  success?: boolean;
};

export async function createMerchLink(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const parsed = merchLinkSchema.safeParse({
    title: formData.get("title"),
    url: formData.get("url"),
    platform: formData.get("platform") || null,
    price: formData.get("price") || null,
  });

  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { data: maxOrder } = await supabase
    .from("merch_links")
    .select("sort_order")
    .eq("profile_id", user.id)
    .order("sort_order", { ascending: false })
    .limit(1)
    .single();

  const { error } = await supabase.from("merch_links").insert({
    profile_id: user.id,
    title: parsed.data.title,
    url: parsed.data.url,
    platform: parsed.data.platform || null,
    price: parsed.data.price || null,
    sort_order: (maxOrder?.sort_order ?? -1) + 1,
  });

  if (error) return { error: error.message };

  revalidatePath("/dashboard/merch");
  return { success: true };
}

export async function updateMerchLink(id: string, formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const parsed = merchLinkSchema.safeParse({
    title: formData.get("title"),
    url: formData.get("url"),
    platform: formData.get("platform") || null,
    price: formData.get("price") || null,
  });

  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { error } = await supabase
    .from("merch_links")
    .update({
      title: parsed.data.title,
      url: parsed.data.url,
      platform: parsed.data.platform || null,
      price: parsed.data.price || null,
    })
    .eq("id", id)
    .eq("profile_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/merch");
  return { success: true };
}

export async function deleteMerchLink(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("merch_links")
    .delete()
    .eq("id", id)
    .eq("profile_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/merch");
  return { success: true };
}

export async function toggleMerchLinkVisibility(id: string, isVisible: boolean): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("merch_links")
    .update({ is_visible: isVisible })
    .eq("id", id)
    .eq("profile_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/merch");
  return { success: true };
}
