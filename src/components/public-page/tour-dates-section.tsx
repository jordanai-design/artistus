"use client";

import type { TourDate } from "@/types";
import { Badge } from "@/components/ui/badge";

type Props = {
  tourDates: TourDate[];
  profileId: string;
  primaryColor: string;
  buttonColor: string;
  buttonTextColor: string;
  buttonClass: string;
};

export function TourDatesSection({ tourDates, profileId, primaryColor, buttonColor, buttonTextColor, buttonClass }: Props) {
  function handleClick(date: TourDate) {
    if (!date.ticket_url) return;
    navigator.sendBeacon?.(
      "/api/analytics/track",
      JSON.stringify({
        type: "link_click",
        profile_id: profileId,
        link_type: "tour",
        link_id: date.id,
        url: date.ticket_url,
      })
    );
  }

  return (
    <div className="mb-8 space-y-4">
      <h2 className="text-center text-sm font-semibold uppercase tracking-wider opacity-60">
        Tour Dates
      </h2>
      <div className="space-y-2">
        {tourDates.map((date) => {
          const eventDate = new Date(date.event_date);
          return (
            <div
              key={date.id}
              className="flex items-center gap-4 rounded-xl bg-white/5 p-4 backdrop-blur-sm"
            >
              <div
                className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-lg text-center"
                style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
              >
                <span className="text-xs font-bold uppercase">
                  {eventDate.toLocaleDateString("en-US", { month: "short" })}
                </span>
                <span className="text-lg font-bold">{eventDate.getDate()}</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate font-semibold">{date.event_name}</p>
                  {date.is_sold_out && (
                    <Badge className="bg-red-500/20 text-red-400 text-xs">Sold Out</Badge>
                  )}
                </div>
                <p className="truncate text-sm opacity-60">
                  {date.venue} &middot; {date.city}
                </p>
              </div>
              {date.ticket_url && !date.is_sold_out && !date.is_cancelled && (
                <a
                  href={date.ticket_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleClick(date)}
                  className={`shrink-0 px-4 py-2 text-sm font-medium transition-opacity hover:opacity-80 ${buttonClass}`}
                  style={{ backgroundColor: buttonColor, color: buttonTextColor }}
                >
                  Tickets
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
