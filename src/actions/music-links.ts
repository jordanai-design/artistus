"use server";

import { createClient } from "@/lib/supabase/server";
import { musicLinkSchema } from "@/lib/validators";
import { revalidatePath } from "next/cache";

export type ActionResult = {
  error?: string;
  success?: boolean;
};

export async function createMusicLink(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const parsed = musicLinkSchema.safeParse({
    title: formData.get("title"),
    type: formData.get("type"),
    spotify_url: formData.get("spotify_url") || null,
    apple_music_url: formData.get("apple_music_url") || null,
    youtube_music_url: formData.get("youtube_music_url") || null,
    soundcloud_url: formData.get("soundcloud_url") || null,
    tidal_url: formData.get("tidal_url") || null,
    amazon_music_url: formData.get("amazon_music_url") || null,
    deezer_url: formData.get("deezer_url") || null,
    custom_url: formData.get("custom_url") || null,
    custom_url_label: formData.get("custom_url_label") || null,
    embed_platform: formData.get("embed_platform") || null,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  // Get max sort_order
  const { data: maxOrder } = await supabase
    .from("music_links")
    .select("sort_order")
    .eq("profile_id", user.id)
    .order("sort_order", { ascending: false })
    .limit(1)
    .single();

  const sortOrder = (maxOrder?.sort_order ?? -1) + 1;

  // Build embed URL
  let embedUrl: string | null = null;
  if (parsed.data.embed_platform === "spotify" && parsed.data.spotify_url) {
    embedUrl = parsed.data.spotify_url.replace("open.spotify.com", "open.spotify.com/embed");
  } else if (parsed.data.embed_platform === "apple_music" && parsed.data.apple_music_url) {
    embedUrl = parsed.data.apple_music_url.replace("music.apple.com", "embed.music.apple.com");
  } else if (parsed.data.embed_platform === "soundcloud" && parsed.data.soundcloud_url) {
    embedUrl = parsed.data.soundcloud_url;
  }

  const { error } = await supabase.from("music_links").insert({
    profile_id: user.id,
    title: parsed.data.title,
    type: parsed.data.type,
    spotify_url: parsed.data.spotify_url || null,
    apple_music_url: parsed.data.apple_music_url || null,
    youtube_music_url: parsed.data.youtube_music_url || null,
    soundcloud_url: parsed.data.soundcloud_url || null,
    tidal_url: parsed.data.tidal_url || null,
    amazon_music_url: parsed.data.amazon_music_url || null,
    deezer_url: parsed.data.deezer_url || null,
    custom_url: parsed.data.custom_url || null,
    custom_url_label: parsed.data.custom_url_label || null,
    embed_url: embedUrl,
    embed_platform: parsed.data.embed_platform || null,
    sort_order: sortOrder,
  });

  if (error) return { error: error.message };

  revalidatePath("/dashboard/music-links");
  return { success: true };
}

export async function updateMusicLink(id: string, formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const parsed = musicLinkSchema.safeParse({
    title: formData.get("title"),
    type: formData.get("type"),
    spotify_url: formData.get("spotify_url") || null,
    apple_music_url: formData.get("apple_music_url") || null,
    youtube_music_url: formData.get("youtube_music_url") || null,
    soundcloud_url: formData.get("soundcloud_url") || null,
    tidal_url: formData.get("tidal_url") || null,
    amazon_music_url: formData.get("amazon_music_url") || null,
    deezer_url: formData.get("deezer_url") || null,
    custom_url: formData.get("custom_url") || null,
    custom_url_label: formData.get("custom_url_label") || null,
    embed_platform: formData.get("embed_platform") || null,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  let embedUrl: string | null = null;
  if (parsed.data.embed_platform === "spotify" && parsed.data.spotify_url) {
    embedUrl = parsed.data.spotify_url.replace("open.spotify.com", "open.spotify.com/embed");
  } else if (parsed.data.embed_platform === "apple_music" && parsed.data.apple_music_url) {
    embedUrl = parsed.data.apple_music_url.replace("music.apple.com", "embed.music.apple.com");
  } else if (parsed.data.embed_platform === "soundcloud" && parsed.data.soundcloud_url) {
    embedUrl = parsed.data.soundcloud_url;
  }

  const { error } = await supabase
    .from("music_links")
    .update({
      title: parsed.data.title,
      type: parsed.data.type,
      spotify_url: parsed.data.spotify_url || null,
      apple_music_url: parsed.data.apple_music_url || null,
      youtube_music_url: parsed.data.youtube_music_url || null,
      soundcloud_url: parsed.data.soundcloud_url || null,
      tidal_url: parsed.data.tidal_url || null,
      amazon_music_url: parsed.data.amazon_music_url || null,
      deezer_url: parsed.data.deezer_url || null,
      custom_url: parsed.data.custom_url || null,
      custom_url_label: parsed.data.custom_url_label || null,
      embed_url: embedUrl,
      embed_platform: parsed.data.embed_platform || null,
    })
    .eq("id", id)
    .eq("profile_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/music-links");
  return { success: true };
}

export async function deleteMusicLink(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("music_links")
    .delete()
    .eq("id", id)
    .eq("profile_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/music-links");
  return { success: true };
}

export async function toggleMusicLinkVisibility(id: string, isVisible: boolean): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("music_links")
    .update({ is_visible: isVisible })
    .eq("id", id)
    .eq("profile_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/music-links");
  return { success: true };
}

export async function reorderMusicLinks(orderedIds: string[]): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const updates = orderedIds.map((id, index) =>
    supabase
      .from("music_links")
      .update({ sort_order: index })
      .eq("id", id)
      .eq("profile_id", user.id)
  );

  const results = await Promise.all(updates);
  const errorResult = results.find((r) => r.error);
  if (errorResult?.error) return { error: errorResult.error.message };

  revalidatePath("/dashboard/music-links");
  return { success: true };
}

export async function updateMusicLinkCoverArt(id: string, formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const file = formData.get("cover_art") as File;
  if (!file || file.size === 0) return { error: "No file selected" };
  if (file.size > 5 * 1024 * 1024) return { error: "File must be less than 5MB" };
  if (!file.type.startsWith("image/")) return { error: "File must be an image" };

  const ext = file.name.split(".").pop();
  const filePath = `${user.id}/${id}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("cover-art")
    .upload(filePath, file, { upsert: true });

  if (uploadError) return { error: uploadError.message };

  const { data: { publicUrl } } = supabase.storage
    .from("cover-art")
    .getPublicUrl(filePath);

  const { error } = await supabase
    .from("music_links")
    .update({ cover_art_url: publicUrl })
    .eq("id", id)
    .eq("profile_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/music-links");
  return { success: true };
}
