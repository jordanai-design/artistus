import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

type Props = {
  displayName: string;
  bio: string | null;
  avatarUrl: string | null;
  genreTags: string[];
  primaryColor: string;
};

export function ArtistHeader({ displayName, bio, avatarUrl, genreTags, primaryColor }: Props) {
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="mb-8 flex flex-col items-center text-center">
      <Avatar className="mb-4 h-24 w-24 ring-2 ring-offset-2 ring-offset-transparent" style={{ "--tw-ring-color": primaryColor } as React.CSSProperties}>
        {avatarUrl && <AvatarImage src={avatarUrl} alt={displayName} />}
        <AvatarFallback className="text-2xl" style={{ backgroundColor: `${primaryColor}33`, color: primaryColor }}>
          {initials}
        </AvatarFallback>
      </Avatar>

      <h1 className="text-2xl font-bold">{displayName}</h1>

      {bio && (
        <p className="mt-2 max-w-sm text-sm opacity-80">{bio}</p>
      )}

      {genreTags.length > 0 && (
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {genreTags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="border-current/20 text-xs opacity-70"
            >
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
