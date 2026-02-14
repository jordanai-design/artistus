import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AppearanceEditor } from "@/components/dashboard/appearance-editor";

export default async function AppearancePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: settings } = await supabase
    .from("page_settings")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Appearance</h1>
        <p className="text-zinc-400">
          Customize the look and feel of your public page
        </p>
      </div>
      <AppearanceEditor settings={settings} />
    </div>
  );
}
