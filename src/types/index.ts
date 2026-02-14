export type Profile = {
  id: string;
  username: string;
  display_name: string;
  bio: string | null;
  avatar_url: string | null;
  genre_tags: string[];
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type MusicLink = {
  id: string;
  profile_id: string;
  title: string;
  type: "track" | "album" | "ep" | "playlist";
  cover_art_url: string | null;
  release_date: string | null;
  spotify_url: string | null;
  apple_music_url: string | null;
  youtube_music_url: string | null;
  soundcloud_url: string | null;
  tidal_url: string | null;
  amazon_music_url: string | null;
  deezer_url: string | null;
  custom_url: string | null;
  custom_url_label: string | null;
  embed_url: string | null;
  embed_platform: "spotify" | "apple_music" | "soundcloud" | null;
  sort_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
};

export type SocialLink = {
  id: string;
  profile_id: string;
  platform: SocialPlatform;
  url: string;
  label: string | null;
  sort_order: number;
  is_visible: boolean;
  created_at: string;
};

export type MerchLink = {
  id: string;
  profile_id: string;
  title: string;
  url: string;
  platform: MerchPlatform | null;
  image_url: string | null;
  price: string | null;
  sort_order: number;
  is_visible: boolean;
  created_at: string;
};

export type TourDate = {
  id: string;
  profile_id: string;
  event_name: string;
  venue: string;
  city: string;
  country_code: string | null;
  event_date: string;
  ticket_url: string | null;
  is_sold_out: boolean;
  is_cancelled: boolean;
  sort_order: number;
  is_visible: boolean;
  created_at: string;
};

export type Subscriber = {
  id: string;
  profile_id: string;
  email: string;
  name: string | null;
  source: string;
  subscribed_at: string;
  is_active: boolean;
};

export type PageSettings = {
  id: string;
  theme_preset: string;
  primary_color: string;
  secondary_color: string;
  background_color: string;
  text_color: string;
  background_type: "solid" | "gradient" | "image";
  background_gradient: string | null;
  background_image_url: string | null;
  font_family: string;
  button_style: "rounded" | "pill" | "square" | "outline";
  button_color: string;
  button_text_color: string;
  layout_style: "standard" | "compact" | "magazine";
  show_powered_by: boolean;
  custom_css: string | null;
  updated_at: string;
};

export type PageView = {
  id: string;
  profile_id: string;
  visitor_id: string | null;
  referrer: string | null;
  country: string | null;
  city: string | null;
  device_type: "mobile" | "tablet" | "desktop" | null;
  browser: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  viewed_at: string;
};

export type LinkClick = {
  id: string;
  profile_id: string;
  link_type: "music" | "social" | "merch" | "tour" | "subscribe";
  link_id: string | null;
  platform: string | null;
  url: string;
  referrer: string | null;
  country: string | null;
  device_type: "mobile" | "tablet" | "desktop" | null;
  clicked_at: string;
};

// Enums
export type SocialPlatform =
  | "instagram"
  | "tiktok"
  | "twitter"
  | "youtube"
  | "facebook"
  | "snapchat"
  | "threads"
  | "discord"
  | "twitch"
  | "website"
  | "other";

export type MerchPlatform =
  | "shopify"
  | "bigcartel"
  | "bandcamp"
  | "etsy"
  | "custom";

export type MusicContentType = "track" | "album" | "ep" | "playlist";

// Full artist page data (fetched for public page)
export type ArtistPageData = {
  profile: Profile;
  settings: PageSettings;
  musicLinks: MusicLink[];
  socialLinks: SocialLink[];
  merchLinks: MerchLink[];
  tourDates: TourDate[];
};
