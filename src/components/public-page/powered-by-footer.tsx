import { Music2 } from "lucide-react";
import Link from "next/link";

export function PoweredByFooter() {
  return (
    <div className="flex items-center justify-center gap-1.5 pb-4 pt-8 opacity-40">
      <Music2 className="h-3.5 w-3.5" />
      <Link href="/" className="text-xs hover:opacity-80">
        Powered by Artistus
      </Link>
    </div>
  );
}
