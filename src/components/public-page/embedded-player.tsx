type Props = {
  embedUrl: string;
  embedPlatform: string;
  title: string;
};

export function EmbeddedPlayer({ embedUrl, embedPlatform, title }: Props) {
  if (embedPlatform === "spotify") {
    // Convert regular URL to embed URL if needed
    const spotifyEmbedUrl = embedUrl.includes("/embed/")
      ? embedUrl
      : embedUrl.replace("open.spotify.com", "open.spotify.com/embed");

    return (
      <div className="mb-8">
        <iframe
          src={spotifyEmbedUrl}
          width="100%"
          height="152"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          className="rounded-xl"
          title={`${title} - Spotify Player`}
        />
      </div>
    );
  }

  if (embedPlatform === "apple_music") {
    const appleEmbedUrl = embedUrl.includes("embed.music.apple.com")
      ? embedUrl
      : embedUrl.replace("music.apple.com", "embed.music.apple.com");

    return (
      <div className="mb-8">
        <iframe
          src={appleEmbedUrl}
          width="100%"
          height="175"
          allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
          sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
          loading="lazy"
          className="rounded-xl"
          title={`${title} - Apple Music Player`}
        />
      </div>
    );
  }

  if (embedPlatform === "soundcloud") {
    const scEmbedUrl = `https://w.soundcloud.com/player/?url=${encodeURIComponent(embedUrl)}&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`;

    return (
      <div className="mb-8">
        <iframe
          src={scEmbedUrl}
          width="100%"
          height="166"
          allow="autoplay"
          loading="lazy"
          className="rounded-xl"
          title={`${title} - SoundCloud Player`}
        />
      </div>
    );
  }

  return null;
}
