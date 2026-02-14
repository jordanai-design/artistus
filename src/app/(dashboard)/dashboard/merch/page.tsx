import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { MerchLinksManager } from "@/components/dashboard/merch-links-manager";

export default async function MerchPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: merchLinks } = await supabase
    .from("merch_links")
    .select("*")
    .eq("profile_id", user.id)
    .order("sort_order", { ascending: true });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Merch & Store</h1>
        <p className="text-zinc-400">
          Showcase your merchandise and store links
        </p>
      </div>
      <MerchLinksManager merchLinks={merchLinks ?? []} />
    </div>
  );
}
