import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { MusicLinksManager } from "@/components/dashboard/music-links-manager";

export default async function MusicLinksPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: musicLinks } = await supabase
    .from("music_links")
    .select("*")
    .eq("profile_id", user.id)
    .order("sort_order", { ascending: true });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Music Links</h1>
        <p className="text-zinc-400">
          Add your music across streaming platforms
        </p>
      </div>
      <MusicLinksManager musicLinks={musicLinks ?? []} />
    </div>
  );
}
