import { useMemo } from "react";

interface PinterestImageProps {
  url: string;
  width?: number; // Default width to fetch
}

const PinterestImage = ({ url, width = 600 }: PinterestImageProps) => {
  const imageUrl = useMemo(() => {
    if (!url) return null;

    // 1. Extract the ID from the URL (works for full links)
    const match = url.match(/pin\/(\d+)/);
    const pinId = match ? match[1] : null;

    if (!pinId) return null;

    // 2. Point to the Pinterest Image CDN
    // '736x' is one of Pinterest's high-res standard widths.
    // You can also try 'originals' but some pins block it.
    return `https://i.pinimg.com/736x/${pinId.substring(0, 2)}/${pinId.substring(2, 4)}/${pinId.substring(4, 6)}/${pinId}.jpg`;

    // NOTE: If the folder structure above fails (it varies),
    // the safest "No-Code" way is to use the 736x direct link:
    // return `https://i.pinimg.com/736x/${pinId}.jpg`; // Some IDs work directly like this
  }, [url]);

  // If the CDN guess fails, we fall back to a "Scraper" approach
  // or a simple placeholder.
  if (!imageUrl) return <div>Invalid Pin URL</div>;

  return (
    <div style={{ width: "100%", borderRadius: "12px", overflow: "hidden" }}>
      <img
        src={`https://i.pinimg.com/736x/d9/0e/73/d90e733f389a741c8812fae1c0409ed9.jpg`}
        alt="Pinterest Pin"
        style={{
          width: "100%",
          height: "auto",
          display: "block",
          objectFit: "cover",
        }}
        // If the direct JPG guess fails (sometimes they are .png or .webp)
        onError={(e) => {
          (e.target as HTMLImageElement).src =
            "https://via.placeholder.com/400x600?text=View+on+Pinterest";
        }}
      />
    </div>
  );
};

export default PinterestImage;
