type ImageProps = {
  url: string;
};

const ImageDisplay = ({ url }: ImageProps) => {
  return (
    <div className="w-fit h-fit rounded-lg flex justify-center items-center bg-gray-500 overflow-hidden">
      <img
        src={url}
        className="rounded-lg max-h-96 max-w-96 w-full h-full object-cover"
      />
    </div>
  );
};

export default ImageDisplay;
