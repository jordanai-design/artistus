"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Download, Users } from "lucide-react";
import type { Subscriber } from "@/types";

export function SubscribersManager({ subscribers }: { subscribers: Subscriber[] }) {
  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  async function handleExport() {
    try {
      const res = await fetch("/api/export/subscribers");
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "subscribers.csv";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // Silent fail - toast would be better but keeping it simple
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="border-zinc-700 text-zinc-300">
            <Users className="mr-1 h-3 w-3" />
            {subscribers.length} subscribers
          </Badge>
        </div>
        {subscribers.length > 0 && (
          <Button variant="outline" size="sm" onClick={handleExport} className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        )}
      </div>

      {subscribers.length === 0 ? (
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Mail className="mb-4 h-12 w-12 text-zinc-600" />
            <p className="text-lg font-medium text-zinc-400">No subscribers yet</p>
            <p className="text-sm text-zinc-500">
              Fans can subscribe through your public page
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">Source</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map((sub) => (
                    <tr key={sub.id} className="border-b border-zinc-800/50">
                      <td className="px-4 py-3 text-sm text-white">{sub.email}</td>
                      <td className="px-4 py-3 text-sm text-zinc-400">{sub.name || "-"}</td>
                      <td className="px-4 py-3 text-sm text-zinc-400">{formatDate(sub.subscribed_at)}</td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="border-zinc-700 text-xs text-zinc-400">
                          {sub.source}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
