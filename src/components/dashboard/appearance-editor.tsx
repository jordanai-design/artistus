"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { THEME_PRESETS, FONT_OPTIONS } from "@/lib/constants";
import { Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import type { PageSettings } from "@/types";

export function AppearanceEditor({ settings }: { settings: PageSettings | null }) {
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState({
    theme_preset: settings?.theme_preset ?? "default",
    primary_color: settings?.primary_color ?? "#6366f1",
    secondary_color: settings?.secondary_color ?? "#a855f7",
    background_color: settings?.background_color ?? "#0f0f0f",
    text_color: settings?.text_color ?? "#ffffff",
    background_type: settings?.background_type ?? "solid",
    background_gradient: settings?.background_gradient ?? null,
    font_family: settings?.font_family ?? "Inter",
    button_style: settings?.button_style ?? "rounded",
    button_color: settings?.button_color ?? "#6366f1",
    button_text_color: settings?.button_text_color ?? "#ffffff",
    layout_style: settings?.layout_style ?? "standard",
    show_powered_by: settings?.show_powered_by ?? true,
  });

  function applyPreset(key: string) {
    const preset = THEME_PRESETS[key as keyof typeof THEME_PRESETS];
    if (!preset) return;
    setFormState((prev) => ({
      ...prev,
      theme_preset: key,
      primary_color: preset.primary_color,
      secondary_color: preset.secondary_color,
      background_color: preset.background_color,
      text_color: preset.text_color,
      button_color: preset.button_color,
      button_text_color: preset.button_text_color,
      background_type: preset.background_type,
    }));
  }

  async function handleSave() {
    setLoading(true);
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("page_settings")
        .update(formState)
        .eq("id", user.id);

      if (error) throw error;
      toast.success("Appearance saved");
    } catch (err) {
      toast.error("Failed to save appearance");
    }
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      {/* Theme Presets */}
      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardHeader>
          <CardTitle className="text-white">Theme Presets</CardTitle>
          <CardDescription className="text-zinc-400">Quick start with a pre-built theme</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Object.entries(THEME_PRESETS).map(([key, preset]) => (
              <button
                key={key}
                onClick={() => applyPreset(key)}
                className={`relative flex flex-col items-center gap-2 rounded-lg border p-3 transition ${
                  formState.theme_preset === key
                    ? "border-indigo-500 bg-indigo-500/10"
                    : "border-zinc-800 hover:border-zinc-700"
                }`}
              >
                <div className="flex gap-1">
                  <div className="h-6 w-6 rounded-full" style={{ backgroundColor: preset.primary_color }} />
                  <div className="h-6 w-6 rounded-full" style={{ backgroundColor: preset.background_color }} />
                </div>
                <span className="text-xs text-zinc-300">{preset.name}</span>
                {formState.theme_preset === key && (
                  <Check className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-indigo-500 text-white p-0.5" />
                )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Colors */}
      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardHeader>
          <CardTitle className="text-white">Colors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { key: "primary_color", label: "Primary" },
              { key: "secondary_color", label: "Secondary" },
              { key: "background_color", label: "Background" },
              { key: "text_color", label: "Text" },
              { key: "button_color", label: "Button" },
              { key: "button_text_color", label: "Button Text" },
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center gap-3">
                <input
                  type="color"
                  value={formState[key as keyof typeof formState] as string}
                  onChange={(e) => setFormState((prev) => ({ ...prev, [key]: e.target.value }))}
                  className="h-10 w-10 cursor-pointer rounded border border-zinc-700 bg-transparent"
                />
                <div>
                  <Label className="text-zinc-300">{label}</Label>
                  <p className="text-xs text-zinc-500">{formState[key as keyof typeof formState] as string}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Typography & Layout */}
      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardHeader>
          <CardTitle className="text-white">Typography & Layout</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-zinc-300">Font</Label>
            <select
              value={formState.font_family}
              onChange={(e) => setFormState((prev) => ({ ...prev, font_family: e.target.value }))}
              className="flex h-10 w-full rounded-md border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-white"
            >
              {FONT_OPTIONS.map((font) => (
                <option key={font.value} value={font.value}>{font.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label className="text-zinc-300">Button Style</Label>
            <div className="flex gap-2">
              {(["rounded", "pill", "square", "outline"] as const).map((style) => (
                <button
                  key={style}
                  onClick={() => setFormState((prev) => ({ ...prev, button_style: style }))}
                  className={`rounded-lg border px-4 py-2 text-sm capitalize transition ${
                    formState.button_style === style
                      ? "border-indigo-500 bg-indigo-500/10 text-indigo-400"
                      : "border-zinc-700 text-zinc-400 hover:border-zinc-600"
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-zinc-300">Layout</Label>
            <div className="flex gap-2">
              {(["standard", "compact", "magazine"] as const).map((layout) => (
                <button
                  key={layout}
                  onClick={() => setFormState((prev) => ({ ...prev, layout_style: layout }))}
                  className={`rounded-lg border px-4 py-2 text-sm capitalize transition ${
                    formState.layout_style === layout
                      ? "border-indigo-500 bg-indigo-500/10 text-indigo-400"
                      : "border-zinc-700 text-zinc-400 hover:border-zinc-600"
                  }`}
                >
                  {layout}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={loading} className="w-full sm:w-auto">
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save Appearance
      </Button>
    </div>
  );
}
