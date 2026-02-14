"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, CheckCircle, Mail } from "lucide-react";

type Props = {
  profileId: string;
  primaryColor: string;
};

export function EmailSignupForm({ profileId, primaryColor }: Props) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, profile_id: profileId }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        setSuccess(true);
      }
    } catch {
      setError("Something went wrong");
    }
    setLoading(false);
  }

  if (success) {
    return (
      <div className="mb-8 flex flex-col items-center gap-2 rounded-xl bg-white/5 p-6 text-center backdrop-blur-sm">
        <CheckCircle className="h-8 w-8" style={{ color: primaryColor }} />
        <p className="font-medium">You&apos;re subscribed!</p>
        <p className="text-sm opacity-60">Thanks for joining the mailing list.</p>
      </div>
    );
  }

  return (
    <div className="mb-8 rounded-xl bg-white/5 p-6 backdrop-blur-sm">
      <div className="mb-4 flex items-center justify-center gap-2">
        <Mail className="h-5 w-5" style={{ color: primaryColor }} />
        <p className="font-semibold">Stay in the loop</p>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="border-white/10 bg-white/5 text-current placeholder:opacity-40"
        />
        <Button
          type="submit"
          disabled={loading}
          className="shrink-0"
          style={{ backgroundColor: primaryColor, color: "#fff" }}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Subscribe"}
        </Button>
      </form>
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </div>
  );
}
