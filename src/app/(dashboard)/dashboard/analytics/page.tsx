import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, MousePointerClick, Globe, Smartphone } from "lucide-react";

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Get total page views (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [pageViews, linkClicks, totalPageViews, totalClicks] = await Promise.all([
    supabase
      .from("page_views")
      .select("id", { count: "exact", head: true })
      .eq("profile_id", user.id)
      .gte("viewed_at", thirtyDaysAgo.toISOString()),
    supabase
      .from("link_clicks")
      .select("id", { count: "exact", head: true })
      .eq("profile_id", user.id)
      .gte("clicked_at", thirtyDaysAgo.toISOString()),
    supabase
      .from("page_views")
      .select("id", { count: "exact", head: true })
      .eq("profile_id", user.id),
    supabase
      .from("link_clicks")
      .select("id", { count: "exact", head: true })
      .eq("profile_id", user.id),
  ]);

  const stats = [
    { label: "Page Views (30d)", value: pageViews.count ?? 0, icon: Eye },
    { label: "Link Clicks (30d)", value: linkClicks.count ?? 0, icon: MousePointerClick },
    { label: "Total Views", value: totalPageViews.count ?? 0, icon: Globe },
    { label: "Total Clicks", value: totalClicks.count ?? 0, icon: Smartphone },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-zinc-400">
          Track how fans interact with your page
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-zinc-800 bg-zinc-900/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">
                {stat.label}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-zinc-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {stat.value.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardContent className="flex items-center justify-center py-12">
          <p className="text-zinc-500">
            Detailed analytics charts will populate as your page receives traffic
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
