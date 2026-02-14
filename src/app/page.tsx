import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Music2,
  Music,
  Share2,
  ShoppingBag,
  CalendarDays,
  BarChart3,
  Palette,
  Mail,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: Music,
    title: "Smart Music Links",
    description: "One link card with all your streaming platforms. Spotify, Apple Music, YouTube Music, and more.",
  },
  {
    icon: Share2,
    title: "Social Profiles",
    description: "Connect all your social media in a clean, recognizable icon bar.",
  },
  {
    icon: ShoppingBag,
    title: "Merch & Store",
    description: "Showcase your merchandise with images, prices, and direct purchase links.",
  },
  {
    icon: CalendarDays,
    title: "Tour Dates",
    description: "Display upcoming shows with venue details and ticket links.",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description: "Track page views, link clicks, and understand your audience.",
  },
  {
    icon: Palette,
    title: "Customizable Themes",
    description: "Choose from pre-built themes or create your own with custom colors and fonts.",
  },
  {
    icon: Mail,
    title: "Email Collection",
    description: "Build your mailing list directly from your page. Export anytime.",
  },
  {
    icon: Music2,
    title: "Embedded Player",
    description: "Let fans preview your music with embedded Spotify, Apple Music, or SoundCloud players.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Nav */}
      <nav className="border-b border-zinc-800/50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <Music2 className="h-7 w-7 text-indigo-500" />
            <span className="text-xl font-bold text-white">Artistus</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="text-zinc-400 hover:text-white">
                Log in
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-indigo-500 hover:bg-indigo-600">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 py-24 text-center sm:py-32">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 text-sm text-indigo-400">
            <Music2 className="h-4 w-4" />
            Built for music artists
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Your music.{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              One link.
            </span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-zinc-400 sm:text-xl">
            The link-in-bio platform built for musicians. Share your streaming links,
            social profiles, merch, tour dates, and more — all in one beautiful, customizable page.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="bg-indigo-500 text-lg hover:bg-indigo-600">
                Create Your Page
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 pb-24">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-white">
            Everything you need in one place
          </h2>
          <p className="mt-3 text-zinc-400">
            Purpose-built features for promoting your music career
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 transition-colors hover:border-zinc-700"
            >
              <feature.icon className="mb-4 h-8 w-8 text-indigo-400" />
              <h3 className="mb-2 font-semibold text-white">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-zinc-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-zinc-800/50">
        <div className="mx-auto max-w-6xl px-4 py-24 text-center">
          <h2 className="text-3xl font-bold text-white">
            Ready to level up your online presence?
          </h2>
          <p className="mt-3 text-zinc-400">
            Join thousands of artists using Artistus to connect with their fans.
          </p>
          <Link href="/signup" className="mt-8 inline-block">
            <Button size="lg" className="bg-indigo-500 text-lg hover:bg-indigo-600">
              Get Started for Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800/50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6">
          <div className="flex items-center gap-2 text-zinc-500">
            <Music2 className="h-4 w-4" />
            <span className="text-sm">Artistus</span>
          </div>
          <p className="text-sm text-zinc-600">
            &copy; {new Date().getFullYear()} Artistus. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
