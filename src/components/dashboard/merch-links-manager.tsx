"use client";

import { useState } from "react";
import { createMerchLink, deleteMerchLink, toggleMerchLinkVisibility } from "@/actions/merch-links";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, ShoppingBag, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { MerchLink } from "@/types";

export function MerchLinksManager({ merchLinks }: { merchLinks: MerchLink[] }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleCreate(formData: FormData) {
    setLoading(true);
    const result = await createMerchLink(formData);
    if (result.error) toast.error(result.error);
    else { toast.success("Merch link added"); setOpen(false); }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    const result = await deleteMerchLink(id);
    if (result.error) toast.error(result.error);
    else toast.success("Merch link deleted");
    setDeletingId(null);
  }

  async function handleToggle(id: string, current: boolean) {
    const result = await toggleMerchLinkVisibility(id, !current);
    if (result.error) toast.error(result.error);
  }

  return (
    <div className="space-y-4">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Add Merch Link
          </Button>
        </DialogTrigger>
        <DialogContent className="border-zinc-800 bg-zinc-900">
          <DialogHeader>
            <DialogTitle className="text-white">Add Merch Link</DialogTitle>
          </DialogHeader>
          <form action={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-zinc-300">Title</Label>
              <Input name="title" placeholder="Product or store name" required className="border-zinc-700 bg-zinc-800/50 text-white placeholder:text-zinc-500" />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">URL</Label>
              <Input name="url" type="url" placeholder="https://..." required className="border-zinc-700 bg-zinc-800/50 text-white placeholder:text-zinc-500" />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Platform</Label>
              <select name="platform" className="flex h-10 w-full rounded-md border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-white">
                <option value="">Select platform</option>
                <option value="shopify">Shopify</option>
                <option value="bigcartel">Big Cartel</option>
                <option value="bandcamp">Bandcamp</option>
                <option value="etsy">Etsy</option>
                <option value="custom">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Price (optional)</Label>
              <Input name="price" placeholder="$25.00" className="border-zinc-700 bg-zinc-800/50 text-white placeholder:text-zinc-500" />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Merch Link
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {merchLinks.length === 0 ? (
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ShoppingBag className="mb-4 h-12 w-12 text-zinc-600" />
            <p className="text-lg font-medium text-zinc-400">No merch links yet</p>
            <p className="text-sm text-zinc-500">Add your merch and store links</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {merchLinks.map((link) => (
            <Card key={link.id} className="border-zinc-800 bg-zinc-900/50">
              <CardContent className="flex items-center gap-4 p-4">
                {link.image_url ? (
                  <img src={link.image_url} alt={link.title} className="h-12 w-12 rounded object-cover" />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded bg-zinc-800">
                    <ShoppingBag className="h-6 w-6 text-zinc-500" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-white">{link.title}</p>
                  <p className="text-sm text-zinc-500">{link.price || "No price set"}</p>
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
          ))}
        </div>
      )}
    </div>
  );
}
