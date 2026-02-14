import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SocialLinksManager } from "@/components/dashboard/social-links-manager";

export default async function SocialLinksPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: socialLinks } = await supabase
    .from("social_links")
    .select("*")
    .eq("profile_id", user.id)
    .order("sort_order", { ascending: true });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Social Links</h1>
        <p className="text-zinc-400">
          Connect your social media profiles
        </p>
      </div>
      <SocialLinksManager socialLinks={socialLinks ?? []} />
    </div>
  );
}
