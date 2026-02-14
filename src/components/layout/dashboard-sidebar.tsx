"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  User,
  Music,
  Share2,
  ShoppingBag,
  CalendarDays,
  Mail,
  BarChart3,
  Palette,
  Music2,
  ExternalLink,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/music-links", label: "Music Links", icon: Music },
  { href: "/dashboard/social-links", label: "Social Links", icon: Share2 },
  { href: "/dashboard/merch", label: "Merch", icon: ShoppingBag },
  { href: "/dashboard/tour-dates", label: "Tour Dates", icon: CalendarDays },
  { href: "/dashboard/subscribers", label: "Subscribers", icon: Mail },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/appearance", label: "Appearance", icon: Palette },
];

export function DashboardSidebar({ username }: { username?: string }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 flex-col border-r border-zinc-800 bg-zinc-950">
      <div className="flex h-16 items-center gap-2 border-b border-zinc-800 px-6">
        <Music2 className="h-6 w-6 text-indigo-500" />
        <span className="text-lg font-bold text-white">Artistus</span>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-indigo-500/10 text-indigo-400"
                  : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {username && (
        <div className="border-t border-zinc-800 p-4">
          <Link
            href={`/${username}`}
            target="_blank"
            className="flex items-center gap-2 rounded-lg bg-zinc-800/50 px-3 py-2 text-sm text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
          >
            <ExternalLink className="h-4 w-4" />
            View your page
          </Link>
        </div>
      )}
    </aside>
  );
}
