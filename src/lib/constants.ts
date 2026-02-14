// Reserved usernames that cannot be registered
export const RESERVED_USERNAMES = new Set([
  "dashboard",
  "login",
  "signup",
  "forgot-password",
  "reset-password",
  "callback",
  "api",
  "admin",
  "settings",
  "profile",
  "help",
  "about",
  "terms",
  "privacy",
  "pricing",
  "blog",
  "contact",
  "support",
  "status",
  "docs",
  "app",
  "www",
  "mail",
  "ftp",
]);

// Music platform URL patterns for auto-detection
export const MUSIC_PLATFORM_PATTERNS: Record<string, RegExp> = {
  spotify: /^https?:\/\/(open\.)?spotify\.com\/(track|album|playlist|artist)\//,
  apple_music: /^https?:\/\/music\.apple\.com\/.+\/(album|playlist|song)\//,
  youtube_music: /^https?:\/\/music\.youtube\.com\/(watch|playlist)\?/,
  soundcloud: /^https?:\/\/(www\.)?soundcloud\.com\/.+\/.+/,
  tidal: /^https?:\/\/(www\.)?tidal\.com\/(browse\/)?(track|album|playlist)\//,
  amazon_music: /^https?:\/\/music\.amazon\.(com|co\.\w+)\/(albums|tracks|playlists)\//,
  deezer: /^https?:\/\/(www\.)?deezer\.com\/.+\/(track|album|playlist)\//,
};

// Social platform URL patterns for auto-detection
export const SOCIAL_PLATFORM_PATTERNS: Record<string, RegExp> = {
  instagram: /^https?:\/\/(www\.)?instagram\.com\//,
  tiktok: /^https?:\/\/(www\.)?tiktok\.com\/@/,
  twitter: /^https?:\/\/(www\.)?(twitter\.com|x\.com)\//,
  youtube: /^https?:\/\/(www\.)?youtube\.com\//,
  facebook: /^https?:\/\/(www\.)?facebook\.com\//,
  snapchat: /^https?:\/\/(www\.)?snapchat\.com\/add\//,
  threads: /^https?:\/\/(www\.)?threads\.net\/@/,
  discord: /^https?:\/\/(www\.)?discord\.(gg|com)\//,
  twitch: /^https?:\/\/(www\.)?twitch\.tv\//,
};

// Display names and colors for music platforms
export const MUSIC_PLATFORMS = {
  spotify: { name: "Spotify", color: "#1DB954", icon: "spotify" },
  apple_music: { name: "Apple Music", color: "#FA243C", icon: "apple-music" },
  youtube_music: { name: "YouTube Music", color: "#FF0000", icon: "youtube-music" },
  soundcloud: { name: "SoundCloud", color: "#FF5500", icon: "soundcloud" },
  tidal: { name: "Tidal", color: "#000000", icon: "tidal" },
  amazon_music: { name: "Amazon Music", color: "#00A8E1", icon: "amazon-music" },
  deezer: { name: "Deezer", color: "#A238FF", icon: "deezer" },
} as const;

// Display names for social platforms
export const SOCIAL_PLATFORMS = {
  instagram: { name: "Instagram", icon: "instagram" },
  tiktok: { name: "TikTok", icon: "tiktok" },
  twitter: { name: "X / Twitter", icon: "twitter" },
  youtube: { name: "YouTube", icon: "youtube" },
  facebook: { name: "Facebook", icon: "facebook" },
  snapchat: { name: "Snapchat", icon: "snapchat" },
  threads: { name: "Threads", icon: "threads" },
  discord: { name: "Discord", icon: "discord" },
  twitch: { name: "Twitch", icon: "twitch" },
  website: { name: "Website", icon: "globe" },
  other: { name: "Other", icon: "link" },
} as const;

// Genre options
export const GENRES = [
  "Pop", "Hip-Hop", "R&B", "Rock", "Electronic", "Dance",
  "Jazz", "Classical", "Country", "Latin", "Reggae", "Blues",
  "Folk", "Metal", "Punk", "Indie", "Alternative", "Soul",
  "Funk", "Gospel", "Afrobeats", "K-Pop", "Lo-fi", "Trap",
  "House", "Techno", "Drill", "Dancehall", "Ambient", "Other",
] as const;

// Font options for page customization
export const FONT_OPTIONS = [
  { name: "Inter", value: "Inter" },
  { name: "Plus Jakarta Sans", value: "Plus Jakarta Sans" },
  { name: "DM Sans", value: "DM Sans" },
  { name: "Space Grotesk", value: "Space Grotesk" },
  { name: "Outfit", value: "Outfit" },
  { name: "Sora", value: "Sora" },
  { name: "Satoshi", value: "Satoshi" },
  { name: "Poppins", value: "Poppins" },
  { name: "Montserrat", value: "Montserrat" },
  { name: "Playfair Display", value: "Playfair Display" },
] as const;

// Theme presets
export const THEME_PRESETS = {
  default: {
    name: "Default",
    primary_color: "#6366f1",
    secondary_color: "#a855f7",
    background_color: "#0f0f0f",
    text_color: "#ffffff",
    button_color: "#6366f1",
    button_text_color: "#ffffff",
    background_type: "solid" as const,
  },
  midnight: {
    name: "Midnight",
    primary_color: "#3b82f6",
    secondary_color: "#6366f1",
    background_color: "#0a0a1a",
    text_color: "#e2e8f0",
    button_color: "#3b82f6",
    button_text_color: "#ffffff",
    background_type: "solid" as const,
  },
  neon: {
    name: "Neon",
    primary_color: "#22d3ee",
    secondary_color: "#f43f5e",
    background_color: "#09090b",
    text_color: "#fafafa",
    button_color: "#22d3ee",
    button_text_color: "#09090b",
    background_type: "solid" as const,
  },
  sunset: {
    name: "Sunset",
    primary_color: "#f97316",
    secondary_color: "#ec4899",
    background_color: "#1c1917",
    text_color: "#fafaf9",
    button_color: "#f97316",
    button_text_color: "#ffffff",
    background_type: "gradient" as const,
    background_gradient: "linear-gradient(135deg, #1c1917 0%, #292524 50%, #1c1917 100%)",
  },
  pastel: {
    name: "Pastel",
    primary_color: "#c084fc",
    secondary_color: "#fb923c",
    background_color: "#faf5ff",
    text_color: "#1e1b4b",
    button_color: "#c084fc",
    button_text_color: "#ffffff",
    background_type: "solid" as const,
  },
  forest: {
    name: "Forest",
    primary_color: "#22c55e",
    secondary_color: "#14b8a6",
    background_color: "#052e16",
    text_color: "#dcfce7",
    button_color: "#22c55e",
    button_text_color: "#052e16",
    background_type: "solid" as const,
  },
  monochrome: {
    name: "Monochrome",
    primary_color: "#ffffff",
    secondary_color: "#a1a1aa",
    background_color: "#18181b",
    text_color: "#fafafa",
    button_color: "#ffffff",
    button_text_color: "#18181b",
    background_type: "solid" as const,
  },
  coral: {
    name: "Coral",
    primary_color: "#fb7185",
    secondary_color: "#fbbf24",
    background_color: "#fff1f2",
    text_color: "#881337",
    button_color: "#fb7185",
    button_text_color: "#ffffff",
    background_type: "solid" as const,
  },
} as const;
