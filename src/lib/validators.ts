import { z } from "zod";
import { RESERVED_USERNAMES } from "./constants";

// Auth
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .regex(
      /^[a-z0-9][a-z0-9-]*[a-z0-9]$/,
      "Username must be lowercase alphanumeric with hyphens, cannot start or end with a hyphen"
    )
    .refine(
      (val) => !RESERVED_USERNAMES.has(val),
      "This username is reserved"
    ),
  display_name: z
    .string()
    .min(1, "Display name is required")
    .max(100, "Display name must be at most 100 characters"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Profile
export const profileSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .regex(
      /^[a-z0-9][a-z0-9-]*[a-z0-9]$/,
      "Username must be lowercase alphanumeric with hyphens"
    )
    .refine(
      (val) => !RESERVED_USERNAMES.has(val),
      "This username is reserved"
    ),
  display_name: z
    .string()
    .min(1, "Display name is required")
    .max(100, "Display name must be at most 100 characters"),
  bio: z.string().max(500, "Bio must be at most 500 characters").nullable(),
  genre_tags: z
    .array(z.string())
    .max(5, "Maximum 5 genre tags"),
});

// Music Links
export const musicLinkSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  type: z.enum(["track", "album", "ep", "playlist"]),
  spotify_url: z.string().url().nullable().or(z.literal("")),
  apple_music_url: z.string().url().nullable().or(z.literal("")),
  youtube_music_url: z.string().url().nullable().or(z.literal("")),
  soundcloud_url: z.string().url().nullable().or(z.literal("")),
  tidal_url: z.string().url().nullable().or(z.literal("")),
  amazon_music_url: z.string().url().nullable().or(z.literal("")),
  deezer_url: z.string().url().nullable().or(z.literal("")),
  custom_url: z.string().url().nullable().or(z.literal("")),
  custom_url_label: z.string().max(50).nullable().or(z.literal("")),
  embed_platform: z.enum(["spotify", "apple_music", "soundcloud"]).nullable(),
});

// Social Links
export const socialLinkSchema = z.object({
  platform: z.enum([
    "instagram", "tiktok", "twitter", "youtube", "facebook",
    "snapchat", "threads", "discord", "twitch", "website", "other",
  ]),
  url: z.string().url("Invalid URL"),
  label: z.string().max(50).nullable().or(z.literal("")),
});

// Merch Links
export const merchLinkSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  url: z.string().url("Invalid URL"),
  platform: z.enum(["shopify", "bigcartel", "bandcamp", "etsy", "custom"]).nullable(),
  price: z.string().max(20).nullable().or(z.literal("")),
});

// Tour Dates
export const tourDateSchema = z.object({
  event_name: z.string().min(1, "Event name is required").max(200),
  venue: z.string().min(1, "Venue is required").max(200),
  city: z.string().min(1, "City is required").max(100),
  country_code: z.string().length(2).nullable().or(z.literal("")),
  event_date: z.string().min(1, "Date is required"),
  ticket_url: z.string().url().nullable().or(z.literal("")),
  is_sold_out: z.boolean().default(false),
  is_cancelled: z.boolean().default(false),
});

// Subscriber (for fan email signup)
export const subscriberSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().max(100).nullable().or(z.literal("")),
});

// Page Settings / Appearance
export const pageSettingsSchema = z.object({
  theme_preset: z.string(),
  primary_color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  secondary_color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  background_color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  text_color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  background_type: z.enum(["solid", "gradient", "image"]),
  background_gradient: z.string().nullable(),
  font_family: z.string(),
  button_style: z.enum(["rounded", "pill", "square", "outline"]),
  button_color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  button_text_color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  layout_style: z.enum(["standard", "compact", "magazine"]),
  show_powered_by: z.boolean(),
});

// Type exports from schemas
export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type MusicLinkInput = z.infer<typeof musicLinkSchema>;
export type SocialLinkInput = z.infer<typeof socialLinkSchema>;
export type MerchLinkInput = z.infer<typeof merchLinkSchema>;
export type TourDateInput = z.infer<typeof tourDateSchema>;
export type SubscriberInput = z.infer<typeof subscriberSchema>;
export type PageSettingsInput = z.infer<typeof pageSettingsSchema>;
