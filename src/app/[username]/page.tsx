import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArtistHeader } from "@/components/public-page/artist-header";
import { MusicSection } from "@/components/public-page/music-section";
import { EmbeddedPlayer } from "@/components/public-page/embedded-player";
import { SocialIconsBar } from "@/components/public-page/social-icons-bar";
import { MerchSection } from "@/components/public-page/merch-section";
import { TourDatesSection } from "@/components/public-page/tour-dates-section";
import { EmailSignupForm } from "@/components/public-page/email-signup-form";
import { PoweredByFooter } from "@/components/public-page/powered-by-footer";
import { PageTracker } from "@/components/public-page/page-tracker";

type Props = {
  params: Promise<{ username: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, bio, avatar_url")
    .eq("username", username)
    .eq("is_published", true)
    .single();

  if (!profile) {
    return { title: "Not Found" };
  }

  return {
    title: `${profile.display_name} | Artistus`,
    description: profile.bio || `Check out ${profile.display_name} on Artistus`,
    openGraph: {
      title: `${profile.display_name} | Artistus`,
      description: profile.bio || `Check out ${profile.display_name} on Artistus`,
      images: profile.avatar_url ? [{ url: profile.avatar_url }] : [],
    },
  };
}

export default async function ArtistPage({ params }: Props) {
  const { username } = await params;
  const supabase = await createClient();

  // Fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .eq("is_published", true)
    .single();

  if (!profile) {
    notFound();
  }

  // Fetch all data in parallel
  const [settingsRes, musicRes, socialRes, merchRes, tourRes] = await Promise.all([
    supabase.from("page_settings").select("*").eq("id", profile.id).single(),
    supabase
      .from("music_links")
      .select("*")
      .eq("profile_id", profile.id)
      .eq("is_visible", true)
      .order("sort_order"),
    supabase
      .from("social_links")
      .select("*")
      .eq("profile_id", profile.id)
      .eq("is_visible", true)
      .order("sort_order"),
    supabase
      .from("merch_links")
      .select("*")
      .eq("profile_id", profile.id)
      .eq("is_visible", true)
      .order("sort_order"),
    supabase
      .from("tour_dates")
      .select("*")
      .eq("profile_id", profile.id)
      .eq("is_visible", true)
      .order("event_date"),
  ]);

  const settings = settingsRes.data;
  const musicLinks = musicRes.data ?? [];
  const socialLinks = socialRes.data ?? [];
  const merchLinks = merchRes.data ?? [];
  const tourDates = (tourRes.data ?? []).filter(
    (d) => new Date(d.event_date) >= new Date()
  );

  // Find the first music link with an embed
  const embedLink = musicLinks.find((l) => l.embed_url && l.embed_platform);

  const bgStyle = settings?.background_type === "gradient" && settings.background_gradient
    ? { background: settings.background_gradient }
    : { backgroundColor: settings?.background_color ?? "#0f0f0f" };

  const buttonClass =
    settings?.button_style === "pill"
      ? "rounded-full"
      : settings?.button_style === "square"
      ? "rounded-none"
      : settings?.button_style === "outline"
      ? "rounded-lg border-2 bg-transparent"
      : "rounded-lg";

  return (
    <div
      className="min-h-screen"
      style={{
        ...bgStyle,
        color: settings?.text_color ?? "#ffffff",
        fontFamily: settings?.font_family ?? "Inter, sans-serif",
      }}
    >
      <PageTracker profileId={profile.id} />

      <div className="mx-auto max-w-lg px-4 py-8 sm:py-12">
        <ArtistHeader
          displayName={profile.display_name}
          bio={profile.bio}
          avatarUrl={profile.avatar_url}
          genreTags={profile.genre_tags}
          primaryColor={settings?.primary_color ?? "#6366f1"}
        />

        {socialLinks.length > 0 && (
          <SocialIconsBar
            socialLinks={socialLinks}
            profileId={profile.id}
            primaryColor={settings?.primary_color ?? "#6366f1"}
          />
        )}

        {embedLink && (
          <EmbeddedPlayer
            embedUrl={embedLink.embed_url!}
            embedPlatform={embedLink.embed_platform!}
            title={embedLink.title}
          />
        )}

        {musicLinks.length > 0 && (
          <MusicSection
            musicLinks={musicLinks}
            profileId={profile.id}
            buttonColor={settings?.button_color ?? "#6366f1"}
            buttonTextColor={settings?.button_text_color ?? "#ffffff"}
            buttonClass={buttonClass}
          />
        )}

        {merchLinks.length > 0 && (
          <MerchSection
            merchLinks={merchLinks}
            profileId={profile.id}
            buttonColor={settings?.button_color ?? "#6366f1"}
            buttonTextColor={settings?.button_text_color ?? "#ffffff"}
            buttonClass={buttonClass}
          />
        )}

        {tourDates.length > 0 && (
          <TourDatesSection
            tourDates={tourDates}
            profileId={profile.id}
            primaryColor={settings?.primary_color ?? "#6366f1"}
            buttonColor={settings?.button_color ?? "#6366f1"}
            buttonTextColor={settings?.button_text_color ?? "#ffffff"}
            buttonClass={buttonClass}
          />
        )}

        <EmailSignupForm
          profileId={profile.id}
          primaryColor={settings?.primary_color ?? "#6366f1"}
        />

        {settings?.show_powered_by !== false && <PoweredByFooter />}
      </div>
    </div>
  );
}
