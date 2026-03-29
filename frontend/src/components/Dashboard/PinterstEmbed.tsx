interface PinterestEmbedProps {
  url: string; // The full Pinterest URL or just the ID
}

const PinterestEmbed = ({ url }: PinterestEmbedProps) => {
  // Extract the ID from the URL if a full URL is passed

  // Example URL: https://www.pinterest.com/pin/2111131073102591/

  const pinId = url.split("/pin/")[1]?.replace("/", "") || url;

  return (
    <div className="w-full flex justify-center">
      <div
        className="relative w-full overflow-hidden rounded-lg border border-slate-200"
        style={{
          // Aspect Ratio calculation: (Height / Width) * 100

          // (330 / 345) * 100 = ~95.65%

          paddingBottom: "97%",

          height: 0,
        }}
      >
        <iframe
          src={`https://assets.pinterest.com/ext/embed.html?id=${pinId}`}
          className="absolute top-0 left-0 w-full h-full"
          frameBorder="0"
          scrolling="no"
          title="Pinterest Pin"
        />
      </div>
    </div>
  );
};

export default PinterestEmbed;
