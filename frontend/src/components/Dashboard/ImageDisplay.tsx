type ImageProps = {
  url: string;
};

const ImageDisplay = ({ url }: ImageProps) => {
  return (
    <div className="w-fit h-auto rounded-lg bg-gray-500">
      <img src={url} className="rounded-lg" />
    </div>
  );
};

export default ImageDisplay;
