import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { TourDatesManager } from "@/components/dashboard/tour-dates-manager";

export default async function TourDatesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: tourDates } = await supabase
    .from("tour_dates")
    .select("*")
    .eq("profile_id", user.id)
    .order("event_date", { ascending: true });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Tour Dates</h1>
        <p className="text-zinc-400">
          Manage your upcoming shows and events
        </p>
      </div>
      <TourDatesManager tourDates={tourDates ?? []} />
    </div>
  );
}
