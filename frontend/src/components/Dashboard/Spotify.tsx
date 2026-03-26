import { useMemo } from "react";

interface SpotifyBannerProps {
  link: string;
  height?: "80" | "152" | "352"; // Compact, Standard Banner, or Full Card
}

const SpotifyBanner = ({ link, height = "152" }: SpotifyBannerProps) => {
  // Use useMemo to prevent re-calculating the URL on every re-render
  const embedUrl = useMemo(() => {
    if (!link) return null;

    // Check if it's already an embed link
    if (link.includes("/embed/")) return link;

    // Convert standard link to embed format
    // Matches: https://developer.spotify.com/documentation/embeds8
    // Result:  https://developer.spotify.com/documentation/embeds9
    return link.replace("open.spotify.com/", "open.spotify.com/embed/");
  }, [link]);

  if (!embedUrl) return null;

  return (
    <div style={{ width: "100%", borderRadius: "12px", overflow: "hidden" }}>
      <iframe
        title="Spotify Player"
        src={embedUrl}
        width="100%"
        height={height}
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        style={{ border: "none", margin: "0" }}
        scrolling="no"
      />
    </div>
  );
};

export default SpotifyBanner;
