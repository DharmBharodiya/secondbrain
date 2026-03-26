import { useEffect, useRef } from "react";

interface TwitterEmbedProps {
  url: string;
}

const TwitterEmbed = ({ url }: TwitterEmbedProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Function to render the tweet
    const renderTweet = () => {
      if ((window as any).twttr && (window as any).twttr.widgets) {
        (window as any).twttr.widgets.load(containerRef.current);
      }
    };

    // 2. Load the Twitter SDK script if it doesn't exist
    if (!(window as any).twttr) {
      const script = document.createElement("script");
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      script.onload = renderTweet;
      document.body.appendChild(script);
    } else {
      renderTweet();
    }
  }, [url]);

  return (
    <div
      ref={containerRef}
      style={{ display: "flex", justifyContent: "center", width: "100%" }}
    >
      <blockquote className="twitter-tweet" data-theme="light">
        <a href={url.replace("x.com", "twitter.com")}>Loading tweet...</a>
      </blockquote>
    </div>
  );
};

export default TwitterEmbed;
