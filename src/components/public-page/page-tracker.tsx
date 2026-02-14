"use client";

import { useEffect } from "react";

export function PageTracker({ profileId }: { profileId: string }) {
  useEffect(() => {
    // Only track once per session
    const sessionKey = `tracked_${profileId}`;
    if (sessionStorage.getItem(sessionKey)) return;
    sessionStorage.setItem(sessionKey, "1");

    navigator.sendBeacon?.(
      "/api/analytics/track",
      JSON.stringify({
        type: "page_view",
        profile_id: profileId,
      })
    );
  }, [profileId]);

  return null;
}
