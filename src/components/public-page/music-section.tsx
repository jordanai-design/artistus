"use client";

import type { MusicLink } from "@/types";
import { MUSIC_PLATFORMS } from "@/lib/constants";
import { Music } from "lucide-react";

type Props = {
  musicLinks: MusicLink[];
  profileId: string;
  buttonColor: string;
  buttonTextColor: string;
  buttonClass: string;
};

export function MusicSection({ musicLinks, profileId, buttonColor, buttonTextColor, buttonClass }: Props) {
  function handleClick(link: MusicLink, platform: string, url: string) {
    navigator.sendBeacon?.(
      "/api/analytics/track",
      JSON.stringify({
        type: "link_click",
        profile_id: profileId,
        link_type: "music",
        link_id: link.id,
        platform,
        url,
      })
    );
  }

  const platformFields = [
    { key: "spotify_url", platform: "spotify" },
    { key: "apple_music_url", platform: "apple_music" },
    { key: "youtube_music_url", platform: "youtube_music" },
    { key: "soundcloud_url", platform: "soundcloud" },
    { key: "tidal_url", platform: "tidal" },
    { key: "amazon_music_url", platform: "amazon_music" },
    { key: "deezer_url", platform: "deezer" },
  ] as const;

  return (
    <div className="mb-8 space-y-4">
      <h2 className="text-center text-sm font-semibold uppercase tracking-wider opacity-60">
        Music
      </h2>
      {musicLinks.map((link) => {
        const availablePlatforms = platformFields.filter(
          (p) => link[p.key as keyof MusicLink]
        );

        return (
          <div key={link.id} className="rounded-xl bg-white/5 p-4 backdrop-blur-sm">
            <div className="mb-3 flex items-center gap-3">
              {link.cover_art_url ? (
                <img
                  src={link.cover_art_url}
                  alt={link.title}
                  className="h-14 w-14 rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-white/10">
                  <Music className="h-7 w-7 opacity-50" />
                </div>
              )}
              <div>
                <p className="font-semibold">{link.title}</p>
                <p className="text-sm capitalize opacity-60">{link.type}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {availablePlatforms.map((p) => {
                const meta = MUSIC_PLATFORMS[p.platform as keyof typeof MUSIC_PLATFORMS];
                const url = link[p.key as keyof MusicLink] as string;
                return (
                  <a
                    key={p.platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleClick(link, p.platform, url)}
                    className={`flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium transition-opacity hover:opacity-80 ${buttonClass}`}
                    style={{ backgroundColor: buttonColor, color: buttonTextColor }}
                  >
                    {meta?.name ?? p.platform}
                  </a>
                );
              })}
              {link.custom_url && (
                <a
                  href={link.custom_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleClick(link, "custom", link.custom_url!)}
                  className={`flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium transition-opacity hover:opacity-80 ${buttonClass}`}
                  style={{ backgroundColor: buttonColor, color: buttonTextColor }}
                >
                  {link.custom_url_label || "Listen"}
                </a>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
