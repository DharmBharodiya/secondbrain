import { useEffect } from "react";

interface InstagramEmbedProps {
  url: string; // We extract the link from your embed code
}

const InstagramEmbed = ({ url }: InstagramEmbedProps) => {
  useEffect(() => {
    // 1. Check if the Instagram window object exists
    if ((window as any).instgrm) {
      // 2. Force Instagram to scan the DOM for the new blockquote
      (window as any).instgrm.Embeds.process();
    } else {
      // 3. If the script isn't loaded yet, add it to the body
      const script = document.createElement("script");
      script.src = "//www.instagram.com/embed.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, [url]);

  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
      <blockquote
        className="instagram-media"
        data-instgrm-captioned
        data-instgrm-permalink={url}
        data-instgrm-version="14"
        style={{
          background: "#FFF",
          border: "0",
          borderRadius: "3px",
          boxShadow: "0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)",
          margin: "1px",
          maxWidth: "540px",
          minWidth: "326px",
          padding: "0",
          width: "99.375%",
        }}
      >
        {/* The link inside acts as the fallback while loading */}
        <div style={{ padding: "16px" }}>
          <a
            href={url}
            style={{
              background: "#FFFFFF",
              line_height: "0",
              padding: "0 0",
              textAlign: "center",
              textDecoration: "none",
              width: "100%",
              borderRadius: "15px",
            }}
            target="_blank"
            rel="noopener noreferrer"
          >
            Loading Instagram Post...
          </a>
        </div>
      </blockquote>
    </div>
  );
};

export default InstagramEmbed;
