import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Music,
  Share2,
  ShoppingBag,
  CalendarDays,
  Eye,
  MousePointerClick,
  Mail,
  ExternalLink,
} from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, is_published, display_name")
    .eq("id", user.id)
    .single();

  // Fetch counts for stats
  const [musicLinks, socialLinks, merchLinks, tourDates, subscribers] = await Promise.all([
    supabase.from("music_links").select("id", { count: "exact", head: true }).eq("profile_id", user.id),
    supabase.from("social_links").select("id", { count: "exact", head: true }).eq("profile_id", user.id),
    supabase.from("merch_links").select("id", { count: "exact", head: true }).eq("profile_id", user.id),
    supabase.from("tour_dates").select("id", { count: "exact", head: true }).eq("profile_id", user.id),
    supabase.from("subscribers").select("id", { count: "exact", head: true }).eq("profile_id", user.id),
  ]);

  const stats = [
    { label: "Music Links", value: musicLinks.count ?? 0, icon: Music, href: "/dashboard/music-links" },
    { label: "Social Links", value: socialLinks.count ?? 0, icon: Share2, href: "/dashboard/social-links" },
    { label: "Merch Items", value: merchLinks.count ?? 0, icon: ShoppingBag, href: "/dashboard/merch" },
    { label: "Tour Dates", value: tourDates.count ?? 0, icon: CalendarDays, href: "/dashboard/tour-dates" },
    { label: "Subscribers", value: subscribers.count ?? 0, icon: Mail, href: "/dashboard/subscribers" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">
          Welcome back, {profile?.display_name ?? "Artist"}
        </h1>
        <p className="mt-1 text-zinc-400">
          Here&apos;s an overview of your Artistus page
        </p>
      </div>

      {/* Published status */}
      {!profile?.is_published && (
        <Card className="border-amber-500/20 bg-amber-500/5">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="font-medium text-amber-400">Your page is not published yet</p>
              <p className="text-sm text-amber-400/70">
                Publish your page to make it visible at artistus.com/{profile?.username}
              </p>
            </div>
            <Link href="/dashboard/profile">
              <Button size="sm" className="bg-amber-500 text-black hover:bg-amber-400">
                Go to Profile
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {profile?.is_published && profile?.username && (
        <Card className="border-indigo-500/20 bg-indigo-500/5">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="font-medium text-indigo-400">Your page is live!</p>
              <p className="text-sm text-indigo-400/70">
                artistus.com/{profile.username}
              </p>
            </div>
            <Link href={`/${profile.username}`} target="_blank">
              <Button size="sm" variant="outline" className="border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10">
                <ExternalLink className="mr-2 h-4 w-4" />
                View page
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="border-zinc-800 bg-zinc-900/50 transition-colors hover:border-zinc-700">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-zinc-400">
                  {stat.label}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-zinc-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-white">Quick Actions</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/dashboard/music-links">
            <Button variant="outline" className="w-full justify-start border-zinc-800 text-zinc-300 hover:bg-zinc-800/50">
              <Music className="mr-2 h-4 w-4" />
              Add Music Link
            </Button>
          </Link>
          <Link href="/dashboard/social-links">
            <Button variant="outline" className="w-full justify-start border-zinc-800 text-zinc-300 hover:bg-zinc-800/50">
              <Share2 className="mr-2 h-4 w-4" />
              Add Social Link
            </Button>
          </Link>
          <Link href="/dashboard/appearance">
            <Button variant="outline" className="w-full justify-start border-zinc-800 text-zinc-300 hover:bg-zinc-800/50">
              <Eye className="mr-2 h-4 w-4" />
              Customize Appearance
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
