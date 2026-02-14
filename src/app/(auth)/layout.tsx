import { Music2 } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <Music2 className="h-8 w-8 text-indigo-500" />
            <span className="text-2xl font-bold text-white">Artistus</span>
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
