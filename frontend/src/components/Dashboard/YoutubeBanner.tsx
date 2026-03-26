import { useState } from "react";

const YouTubeBanner = ({ videoId }: { videoId: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  // High-res thumbnail URL
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  return (
    <div
      style={{
        width: "100%",
        aspectRatio: "16/9",
        borderRadius: "12px",
        overflow: "hidden",
        position: "relative",
        backgroundColor: "#000",
      }}
    >
      {!isPlaying ? (
        /* 1. THE FAKE BANNER (Just the image) */
        <div
          onClick={() => setIsPlaying(true)}
          style={{ cursor: "pointer", width: "100%", height: "100%" }}
        >
          <img
            src={thumbnailUrl}
            alt="Play Video"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          {/* Optional: Add a custom play icon here if you want one that matches YOUR design */}
        </div>
      ) : (
        /* 2. THE ACTUAL PLAYER (Swaps in on click) */
        <iframe
          style={{ width: "100%", height: "100%", border: "none" }}
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0`}
          title="YouTube video player"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        ></iframe>
      )}
    </div>
  );
};

export default YouTubeBanner;
