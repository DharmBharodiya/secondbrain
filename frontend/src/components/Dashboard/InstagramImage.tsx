import { useEffect, useRef } from "react";

interface InstagramImageOnlyProps {
  url: string;
}

const InstagramImage = ({ url }: InstagramImageOnlyProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Force Instagram to process the embed when the component mounts
    if ((window as any).instgrm) {
      (window as any).instgrm.Embeds.process();
    } else {
      const script = document.createElement("script");
      script.src = "//www.instagram.com/embed.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, [url]);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "500px",
        aspectRatio: "1 / 1", // Forces a square look
        overflow: "hidden", // This is the "Clipper"
        position: "relative",
        borderRadius: "12px",
        border: "1px solid #dbdbdb",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-55px", // Pushes the Instagram Header out of the top
          left: "-1px",
          width: "calc(100% + 2px)",
        }}
      >
        <blockquote
          className="instagram-media"
          data-instgrm-permalink={url}
          data-instgrm-version="14"
          style={{
            background: "#FFF",
            border: "0",
            margin: "0",
            padding: "0",
            width: "100%",
          }}
        >
          {/* Fallback link */}
          <a href={url}>Loading...</a>
        </blockquote>
      </div>

      {/* Optional: A transparent "Shield" div on top to prevent 
         users from clicking the invisible links inside the iframe 
      */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 10,
          cursor: "default",
        }}
      />
    </div>
  );
};

export default InstagramImage;
