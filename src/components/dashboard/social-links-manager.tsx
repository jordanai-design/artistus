"use client";

import { useState } from "react";
import { createSocialLink, deleteSocialLink, toggleSocialLinkVisibility } from "@/actions/social-links";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SOCIAL_PLATFORMS } from "@/lib/constants";
import { Plus, Trash2, Share2, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { SocialLink } from "@/types";

export function SocialLinksManager({ socialLinks }: { socialLinks: SocialLink[] }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleCreate(formData: FormData) {
    setLoading(true);
    const result = await createSocialLink(formData);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Social link added");
      setOpen(false);
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    const result = await deleteSocialLink(id);
    if (result.error) toast.error(result.error);
    else toast.success("Social link deleted");
    setDeletingId(null);
  }

  async function handleToggle(id: string, current: boolean) {
    const result = await toggleSocialLinkVisibility(id, !current);
    if (result.error) toast.error(result.error);
  }

  return (
    <div className="space-y-4">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Add Social Link
          </Button>
        </DialogTrigger>
        <DialogContent className="border-zinc-800 bg-zinc-900">
          <DialogHeader>
            <DialogTitle className="text-white">Add Social Link</DialogTitle>
          </DialogHeader>
          <form action={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-zinc-300">Platform</Label>
              <select name="platform" required className="flex h-10 w-full rounded-md border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-white">
                {Object.entries(SOCIAL_PLATFORMS).map(([key, platform]) => (
                  <option key={key} value={key}>{platform.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">URL</Label>
              <Input name="url" type="url" placeholder="https://..." required className="border-zinc-700 bg-zinc-800/50 text-white placeholder:text-zinc-500" />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Custom Label (optional)</Label>
              <Input name="label" placeholder="e.g., My YouTube Channel" className="border-zinc-700 bg-zinc-800/50 text-white placeholder:text-zinc-500" />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Social Link
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {socialLinks.length === 0 ? (
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Share2 className="mb-4 h-12 w-12 text-zinc-600" />
            <p className="text-lg font-medium text-zinc-400">No social links yet</p>
            <p className="text-sm text-zinc-500">Connect your social media profiles</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {socialLinks.map((link) => {
            const platform = SOCIAL_PLATFORMS[link.platform as keyof typeof SOCIAL_PLATFORMS];
            return (
              <Card key={link.id} className="border-zinc-800 bg-zinc-900/50">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800">
                    <Share2 className="h-5 w-5 text-zinc-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-white">{platform?.name ?? link.platform}</p>
                    <p className="truncate text-sm text-zinc-500">{link.url}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleToggle(link.id, link.is_visible)} className="p-2 text-zinc-400 hover:text-white">
                      {link.is_visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                    <button onClick={() => handleDelete(link.id)} disabled={deletingId === link.id} className="p-2 text-zinc-400 hover:text-red-400">
                      {deletingId === link.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
