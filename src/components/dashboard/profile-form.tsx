"use client";

import { useState, useRef } from "react";
import { updateProfile, updateAvatar, togglePublished } from "@/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GENRES } from "@/lib/constants";
import { Loader2, Camera, X } from "lucide-react";
import { toast } from "sonner";
import type { Profile } from "@/types";

export function ProfileForm({ profile }: { profile: Profile }) {
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<string[]>(profile.genre_tags ?? []);
  const [isPublished, setIsPublished] = useState(profile.is_published);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initials = profile.display_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    formData.set("genre_tags", selectedGenres.join(","));
    const result = await updateProfile(formData);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Profile updated successfully");
    }
    setLoading(false);
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarLoading(true);
    const formData = new FormData();
    formData.append("avatar", file);
    const result = await updateAvatar(formData);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Avatar updated");
    }
    setAvatarLoading(false);
  }

  async function handlePublishToggle(checked: boolean) {
    setIsPublished(checked);
    const result = await togglePublished(checked);
    if (result.error) {
      toast.error(result.error);
      setIsPublished(!checked);
    } else {
      toast.success(checked ? "Page published!" : "Page unpublished");
    }
  }

  function toggleGenre(genre: string) {
    setSelectedGenres((prev) =>
      prev.includes(genre)
        ? prev.filter((g) => g !== genre)
        : prev.length < 5
        ? [...prev, genre]
        : prev
    );
  }

  return (
    <div className="space-y-6">
      {/* Publish toggle */}
      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardContent className="flex items-center justify-between p-4">
          <div>
            <p className="font-medium text-white">Publish page</p>
            <p className="text-sm text-zinc-400">
              Make your page visible at artistus.com/{profile.username}
            </p>
          </div>
          <Switch checked={isPublished} onCheckedChange={handlePublishToggle} />
        </CardContent>
      </Card>

      {/* Avatar */}
      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardHeader>
          <CardTitle className="text-white">Profile Picture</CardTitle>
          <CardDescription className="text-zinc-400">
            Upload a profile picture. Max 2MB.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-20 w-20">
                {profile.avatar_url && <AvatarImage src={profile.avatar_url} alt={profile.display_name} />}
                <AvatarFallback className="bg-indigo-500/20 text-indigo-400 text-xl">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 rounded-full bg-indigo-500 p-1.5 text-white transition hover:bg-indigo-400"
                disabled={avatarLoading}
              >
                {avatarLoading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Camera className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
            <div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={avatarLoading}
                className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              >
                Upload new picture
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile info */}
      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardHeader>
          <CardTitle className="text-white">Profile Information</CardTitle>
          <CardDescription className="text-zinc-400">
            This information will be displayed on your public page
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="display_name" className="text-zinc-300">Artist Name</Label>
              <Input
                id="display_name"
                name="display_name"
                defaultValue={profile.display_name}
                required
                className="border-zinc-700 bg-zinc-800/50 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username" className="text-zinc-300">Username</Label>
              <div className="flex items-center rounded-md border border-zinc-700 bg-zinc-800/50">
                <span className="pl-3 text-sm text-zinc-500">artistus.com/</span>
                <Input
                  id="username"
                  name="username"
                  defaultValue={profile.username}
                  required
                  className="border-0 bg-transparent text-white focus-visible:ring-0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="text-zinc-300">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                defaultValue={profile.bio ?? ""}
                placeholder="Tell your fans about yourself..."
                maxLength={500}
                rows={3}
                className="border-zinc-700 bg-zinc-800/50 text-white placeholder:text-zinc-500"
              />
              <p className="text-xs text-zinc-500">Max 500 characters</p>
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-300">
                Genres <span className="text-zinc-500">(max 5)</span>
              </Label>
              <div className="flex flex-wrap gap-2">
                {GENRES.map((genre) => (
                  <Badge
                    key={genre}
                    variant={selectedGenres.includes(genre) ? "default" : "outline"}
                    className={`cursor-pointer transition ${
                      selectedGenres.includes(genre)
                        ? "bg-indigo-500 text-white hover:bg-indigo-600"
                        : "border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-zinc-300"
                    }`}
                    onClick={() => toggleGenre(genre)}
                  >
                    {genre}
                    {selectedGenres.includes(genre) && (
                      <X className="ml-1 h-3 w-3" />
                    )}
                  </Badge>
                ))}
              </div>
            </div>

            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
