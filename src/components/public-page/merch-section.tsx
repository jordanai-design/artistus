"use client";

import type { MerchLink } from "@/types";
import { ShoppingBag } from "lucide-react";

type Props = {
  merchLinks: MerchLink[];
  profileId: string;
  buttonColor: string;
  buttonTextColor: string;
  buttonClass: string;
};

export function MerchSection({ merchLinks, profileId, buttonColor, buttonTextColor, buttonClass }: Props) {
  function handleClick(link: MerchLink) {
    navigator.sendBeacon?.(
      "/api/analytics/track",
      JSON.stringify({
        type: "link_click",
        profile_id: profileId,
        link_type: "merch",
        link_id: link.id,
        platform: link.platform,
        url: link.url,
      })
    );
  }

  return (
    <div className="mb-8 space-y-4">
      <h2 className="text-center text-sm font-semibold uppercase tracking-wider opacity-60">
        Merch & Store
      </h2>
      <div className="space-y-3">
        {merchLinks.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleClick(link)}
            className={`flex items-center gap-4 p-4 transition-opacity hover:opacity-80 ${buttonClass} bg-white/5 backdrop-blur-sm`}
          >
            {link.image_url ? (
              <img src={link.image_url} alt={link.title} className="h-14 w-14 rounded-lg object-cover" />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-white/10">
                <ShoppingBag className="h-7 w-7 opacity-50" />
              </div>
            )}
            <div className="flex-1">
              <p className="font-semibold">{link.title}</p>
              {link.price && <p className="text-sm opacity-60">{link.price}</p>}
            </div>
            <span
              className={`shrink-0 px-4 py-2 text-sm font-medium ${buttonClass}`}
              style={{ backgroundColor: buttonColor, color: buttonTextColor }}
            >
              Shop
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
