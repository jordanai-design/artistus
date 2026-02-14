"use client";

import { useState } from "react";
import { createMusicLink, deleteMusicLink, toggleMusicLinkVisibility } from "@/actions/music-links";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MUSIC_PLATFORMS } from "@/lib/constants";
import { Plus, Trash2, Music, Eye, EyeOff, GripVertical, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { MusicLink } from "@/types";

export function MusicLinksManager({ musicLinks }: { musicLinks: MusicLink[] }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleCreate(formData: FormData) {
    setLoading(true);
    const result = await createMusicLink(formData);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Music link added");
      setOpen(false);
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    const result = await deleteMusicLink(id);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Music link deleted");
    }
    setDeletingId(null);
  }

  async function handleToggleVisibility(id: string, currentVisibility: boolean) {
    const result = await toggleMusicLinkVisibility(id, !currentVisibility);
    if (result.error) toast.error(result.error);
  }

  return (
    <div className="space-y-4">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Add Music Link
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[90vh] overflow-y-auto border-zinc-800 bg-zinc-900 sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">Add Music Link</DialogTitle>
          </DialogHeader>
          <form action={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-zinc-300">Title</Label>
              <Input name="title" placeholder="Song or album name" required className="border-zinc-700 bg-zinc-800/50 text-white placeholder:text-zinc-500" />
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-300">Type</Label>
              <select name="type" required className="flex h-10 w-full rounded-md border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-white">
                <option value="track">Track</option>
                <option value="album">Album</option>
                <option value="ep">EP</option>
                <option value="playlist">Playlist</option>
              </select>
            </div>

            <div className="space-y-3">
              <Label className="text-zinc-300">Streaming Links</Label>
              {Object.entries(MUSIC_PLATFORMS).map(([key, platform]) => (
                <div key={key} className="flex items-center gap-2">
                  <span className="w-28 text-xs text-zinc-400">{platform.name}</span>
                  <Input
                    name={`${key}_url`}
                    placeholder={`${platform.name} URL`}
                    className="border-zinc-700 bg-zinc-800/50 text-white placeholder:text-zinc-500"
                  />
                </div>
              ))}
              <div className="flex items-center gap-2">
                <span className="w-28 text-xs text-zinc-400">Custom</span>
                <Input name="custom_url" placeholder="Other platform URL" className="border-zinc-700 bg-zinc-800/50 text-white placeholder:text-zinc-500" />
              </div>
              <Input name="custom_url_label" placeholder="Custom link label (e.g., Bandcamp)" className="border-zinc-700 bg-zinc-800/50 text-white placeholder:text-zinc-500" />
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-300">Embed Player</Label>
              <select name="embed_platform" className="flex h-10 w-full rounded-md border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-white">
                <option value="">None</option>
                <option value="spotify">Spotify</option>
                <option value="apple_music">Apple Music</option>
                <option value="soundcloud">SoundCloud</option>
              </select>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Music Link
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {musicLinks.length === 0 ? (
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Music className="mb-4 h-12 w-12 text-zinc-600" />
            <p className="text-lg font-medium text-zinc-400">No music links yet</p>
            <p className="text-sm text-zinc-500">Add your first music link to get started</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {musicLinks.map((link) => (
            <Card key={link.id} className="border-zinc-800 bg-zinc-900/50">
              <CardContent className="flex items-center gap-4 p-4">
                <GripVertical className="h-5 w-5 shrink-0 cursor-grab text-zinc-600" />

                {link.cover_art_url ? (
                  <img
                    src={link.cover_art_url}
                    alt={link.title}
                    className="h-12 w-12 rounded object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded bg-zinc-800">
                    <Music className="h-6 w-6 text-zinc-500" />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-white">{link.title}</p>
                  <p className="text-sm capitalize text-zinc-500">{link.type}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleVisibility(link.id, link.is_visible)}
                    className="p-2 text-zinc-400 hover:text-white"
                    title={link.is_visible ? "Hide" : "Show"}
                  >
                    {link.is_visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => handleDelete(link.id)}
                    disabled={deletingId === link.id}
                    className="p-2 text-zinc-400 hover:text-red-400"
                  >
                    {deletingId === link.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
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
