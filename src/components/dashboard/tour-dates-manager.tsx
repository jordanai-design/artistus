"use client";

import { useState } from "react";
import { createTourDate, deleteTourDate, toggleTourDateVisibility } from "@/actions/tour-dates";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, CalendarDays, Eye, EyeOff, MapPin, Ticket, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { TourDate } from "@/types";

export function TourDatesManager({ tourDates }: { tourDates: TourDate[] }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleCreate(formData: FormData) {
    setLoading(true);
    const result = await createTourDate(formData);
    if (result.error) toast.error(result.error);
    else { toast.success("Tour date added"); setOpen(false); }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    const result = await deleteTourDate(id);
    if (result.error) toast.error(result.error);
    else toast.success("Tour date deleted");
    setDeletingId(null);
  }

  async function handleToggle(id: string, current: boolean) {
    const result = await toggleTourDateVisibility(id, !current);
    if (result.error) toast.error(result.error);
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  const isPast = (dateStr: string) => new Date(dateStr) < new Date();

  return (
    <div className="space-y-4">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Add Tour Date
          </Button>
        </DialogTrigger>
        <DialogContent className="border-zinc-800 bg-zinc-900">
          <DialogHeader>
            <DialogTitle className="text-white">Add Tour Date</DialogTitle>
          </DialogHeader>
          <form action={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-zinc-300">Event Name</Label>
              <Input name="event_name" placeholder="Show or festival name" required className="border-zinc-700 bg-zinc-800/50 text-white placeholder:text-zinc-500" />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Venue</Label>
              <Input name="venue" placeholder="Venue name" required className="border-zinc-700 bg-zinc-800/50 text-white placeholder:text-zinc-500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-zinc-300">City</Label>
                <Input name="city" placeholder="City, State" required className="border-zinc-700 bg-zinc-800/50 text-white placeholder:text-zinc-500" />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Country Code</Label>
                <Input name="country_code" placeholder="US" maxLength={2} className="border-zinc-700 bg-zinc-800/50 text-white placeholder:text-zinc-500" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Date & Time</Label>
              <Input name="event_date" type="datetime-local" required className="border-zinc-700 bg-zinc-800/50 text-white" />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Ticket URL</Label>
              <Input name="ticket_url" type="url" placeholder="https://..." className="border-zinc-700 bg-zinc-800/50 text-white placeholder:text-zinc-500" />
            </div>
            <input type="hidden" name="is_sold_out" value="false" />
            <input type="hidden" name="is_cancelled" value="false" />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Tour Date
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {tourDates.length === 0 ? (
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CalendarDays className="mb-4 h-12 w-12 text-zinc-600" />
            <p className="text-lg font-medium text-zinc-400">No tour dates yet</p>
            <p className="text-sm text-zinc-500">Add your upcoming shows and events</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {tourDates.map((date) => (
            <Card key={date.id} className={`border-zinc-800 bg-zinc-900/50 ${isPast(date.event_date) ? "opacity-50" : ""}`}>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded bg-zinc-800 text-center">
                  <span className="text-xs font-medium text-indigo-400">
                    {new Date(date.event_date).toLocaleDateString("en-US", { month: "short" })}
                  </span>
                  <span className="text-lg font-bold text-white">
                    {new Date(date.event_date).getDate()}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-white">{date.event_name}</p>
                    {date.is_sold_out && <Badge className="bg-red-500/20 text-red-400">Sold Out</Badge>}
                    {date.is_cancelled && <Badge className="bg-zinc-500/20 text-zinc-400">Cancelled</Badge>}
                    {isPast(date.event_date) && <Badge variant="outline" className="border-zinc-700 text-zinc-500">Past</Badge>}
                  </div>
                  <p className="text-sm text-zinc-400">
                    <MapPin className="mr-1 inline h-3 w-3" />
                    {date.venue} &middot; {date.city}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {date.ticket_url && (
                    <a href={date.ticket_url} target="_blank" rel="noopener noreferrer" className="p-2 text-zinc-400 hover:text-indigo-400">
                      <Ticket className="h-4 w-4" />
                    </a>
                  )}
                  <button onClick={() => handleToggle(date.id, date.is_visible)} className="p-2 text-zinc-400 hover:text-white">
                    {date.is_visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                  <button onClick={() => handleDelete(date.id)} disabled={deletingId === date.id} className="p-2 text-zinc-400 hover:text-red-400">
                    {deletingId === date.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
