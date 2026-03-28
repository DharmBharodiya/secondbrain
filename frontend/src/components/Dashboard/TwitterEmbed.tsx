import { useEffect, useRef, useState } from "react";

interface TwitterEmbedProps {
  url: string;
}

const TwitterEmbed = ({ url }: TwitterEmbedProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // Function to handle scaling based on container width
  const updateScale = () => {
    if (wrapperRef.current) {
      const containerWidth = wrapperRef.current.offsetWidth;
      // Twitter's minimum internal width is roughly 250px
      const minTwitterWidth = 250;

      if (containerWidth < minTwitterWidth) {
        setScale(containerWidth / minTwitterWidth);
      } else {
        setScale(1);
      }
    }
  };

  useEffect(() => {
    const renderTweet = () => {
      if ((window as any).twttr?.widgets) {
        (window as any).twttr.widgets.load(containerRef.current);
        // Wait a moment for the iframe to inject, then calculate scale
        setTimeout(updateScale, 500);
      }
    };

    if (!(window as any).twttr) {
      const script = document.createElement("script");
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      script.onload = renderTweet;
      document.body.appendChild(script);
    } else {
      renderTweet();
    }

    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [url]);

  return (
    <div
      ref={wrapperRef}
      className="w-full flex justify-center items-center overflow-visible"
      style={{
        // This ensures the height adjusts as the scaled element shrinks
        height: scale < 1 ? `${450 * scale}px` : "auto",
        minHeight: "150px",
      }}
    >
      <div
        ref={containerRef}
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top center",
          width: scale < 1 ? "250px" : "100%",
          transition: "transform 0.2s ease-out",
        }}
      >
        <blockquote
          className="twitter-tweet"
          data-theme="light"
          data-dnt="true"
        >
          <a href={url.replace("x.com", "twitter.com")}></a>
        </blockquote>
      </div>
    </div>
  );
};

export default TwitterEmbed;
