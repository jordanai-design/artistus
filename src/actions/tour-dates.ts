"use server";

import { createClient } from "@/lib/supabase/server";
import { tourDateSchema } from "@/lib/validators";
import { revalidatePath } from "next/cache";

export type ActionResult = {
  error?: string;
  success?: boolean;
};

export async function createTourDate(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const parsed = tourDateSchema.safeParse({
    event_name: formData.get("event_name"),
    venue: formData.get("venue"),
    city: formData.get("city"),
    country_code: formData.get("country_code") || null,
    event_date: formData.get("event_date"),
    ticket_url: formData.get("ticket_url") || null,
    is_sold_out: formData.get("is_sold_out") === "true",
    is_cancelled: formData.get("is_cancelled") === "true",
  });

  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { data: maxOrder } = await supabase
    .from("tour_dates")
    .select("sort_order")
    .eq("profile_id", user.id)
    .order("sort_order", { ascending: false })
    .limit(1)
    .single();

  const { error } = await supabase.from("tour_dates").insert({
    profile_id: user.id,
    event_name: parsed.data.event_name,
    venue: parsed.data.venue,
    city: parsed.data.city,
    country_code: parsed.data.country_code || null,
    event_date: parsed.data.event_date,
    ticket_url: parsed.data.ticket_url || null,
    is_sold_out: parsed.data.is_sold_out,
    is_cancelled: parsed.data.is_cancelled,
    sort_order: (maxOrder?.sort_order ?? -1) + 1,
  });

  if (error) return { error: error.message };

  revalidatePath("/dashboard/tour-dates");
  return { success: true };
}

export async function updateTourDate(id: string, formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const parsed = tourDateSchema.safeParse({
    event_name: formData.get("event_name"),
    venue: formData.get("venue"),
    city: formData.get("city"),
    country_code: formData.get("country_code") || null,
    event_date: formData.get("event_date"),
    ticket_url: formData.get("ticket_url") || null,
    is_sold_out: formData.get("is_sold_out") === "true",
    is_cancelled: formData.get("is_cancelled") === "true",
  });

  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { error } = await supabase
    .from("tour_dates")
    .update({
      event_name: parsed.data.event_name,
      venue: parsed.data.venue,
      city: parsed.data.city,
      country_code: parsed.data.country_code || null,
      event_date: parsed.data.event_date,
      ticket_url: parsed.data.ticket_url || null,
      is_sold_out: parsed.data.is_sold_out,
      is_cancelled: parsed.data.is_cancelled,
    })
    .eq("id", id)
    .eq("profile_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/tour-dates");
  return { success: true };
}

export async function deleteTourDate(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("tour_dates")
    .delete()
    .eq("id", id)
    .eq("profile_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/tour-dates");
  return { success: true };
}

export async function toggleTourDateVisibility(id: string, isVisible: boolean): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("tour_dates")
    .update({ is_visible: isVisible })
    .eq("id", id)
    .eq("profile_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/tour-dates");
  return { success: true };
}
