"use client";

import type { SocialLink } from "@/types";
import { SOCIAL_PLATFORMS } from "@/lib/constants";
import {
  Instagram,
  Youtube,
  Facebook,
  Globe,
  Link,
  Music,
  MessageCircle,
  Gamepad2,
  Tv,
  AtSign,
} from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  instagram: Instagram,
  youtube: Youtube,
  facebook: Facebook,
  website: Globe,
  other: Link,
  tiktok: Music,
  twitter: AtSign,
  snapchat: MessageCircle,
  threads: AtSign,
  discord: Gamepad2,
  twitch: Tv,
};

type Props = {
  socialLinks: SocialLink[];
  profileId: string;
  primaryColor: string;
};

export function SocialIconsBar({ socialLinks, profileId, primaryColor }: Props) {
  function handleClick(link: SocialLink) {
    navigator.sendBeacon?.(
      "/api/analytics/track",
      JSON.stringify({
        type: "link_click",
        profile_id: profileId,
        link_type: "social",
        link_id: link.id,
        platform: link.platform,
        url: link.url,
      })
    );
  }

  return (
    <div className="mb-8 flex flex-wrap justify-center gap-3">
      {socialLinks.map((link) => {
        const Icon = ICON_MAP[link.platform] ?? Link;
        const platform = SOCIAL_PLATFORMS[link.platform as keyof typeof SOCIAL_PLATFORMS];
        return (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleClick(link)}
            title={link.label ?? platform?.name ?? link.platform}
            className="flex h-10 w-10 items-center justify-center rounded-full transition-transform hover:scale-110"
            style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
          >
            <Icon className="h-5 w-5" />
          </a>
        );
      })}
    </div>
  );
}
