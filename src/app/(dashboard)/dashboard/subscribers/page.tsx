import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SubscribersManager } from "@/components/dashboard/subscribers-manager";

export default async function SubscribersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: subscribers } = await supabase
    .from("subscribers")
    .select("*")
    .eq("profile_id", user.id)
    .order("subscribed_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Subscribers</h1>
        <p className="text-zinc-400">
          Manage your fan email list
        </p>
      </div>
      <SubscribersManager subscribers={subscribers ?? []} />
    </div>
  );
}
