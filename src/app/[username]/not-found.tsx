import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Music2 } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-4">
      <Music2 className="mb-4 h-12 w-12 text-zinc-600" />
      <h1 className="text-2xl font-bold text-white">Page not found</h1>
      <p className="mt-2 text-zinc-400">
        This artist page doesn&apos;t exist or isn&apos;t published yet.
      </p>
      <Link href="/" className="mt-6">
        <Button variant="outline" className="border-zinc-700 text-zinc-300">
          Go to Artistus
        </Button>
      </Link>
    </div>
  );
}
