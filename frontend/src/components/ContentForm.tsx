import { useContext, useState } from "react";
import { Link, X } from "lucide-react";
import { AuthContext } from "../Context/AuthContext";
import whiteLogo from "../assets/images/white-logo.PNG";
import { useUploadNewContent } from "../hooks/useContentQueries";

interface ContentFormProps {
  handleClick: () => void;
  onContentAdded?: () => void;
  contentFormOpenFunction: (value: boolean) => void;
}

const ContentForm = ({
  handleClick,
  onContentAdded,
  contentFormOpenFunction,
}: ContentFormProps) => {
  const { token } = useContext(AuthContext);

  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [link, setLink] = useState("");
  const [tags, setTags] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [sharing, setSharing] = useState("private");

  const uploadContentMutation = useUploadNewContent();

  const tagsSorted = () => {
    const newTags = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");
    return newTags;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      // preview only for images
      // if (selectedFile.type.startsWith("image/")) {
      //   const url = URL.createObjectURL(selectedFile);
      //   // setPreview(url);
      // } else {
      //   // setPreview(null);
      // }
    }
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!title.trim()) {
      setMessage("Please enter a title");
      return;
    }
    if (!type) {
      setMessage("Please select a content type");
      return;
    }

    const separatedTagsArray = tagsSorted();
    console.log("Separated tags:", separatedTagsArray);
    console.log("Original tags:", tags);
    console.log("Type being sent:", type);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("type", type);
    formData.append("link", link);
    formData.append("sharing", sharing);
    separatedTagsArray.forEach((tag) => formData.append("tags", tag));
    formData.append("notes", notes);
    if (file) {
      formData.append("file", file);
    }

    const isImageHere = () => {
      if (type === "image") {
        if (file) {
          return true;
        } else {
          setMessage("Please select an image to upload.");
          return false;
        }
      }
    };

    try {
      if (token && isImageHere()) {
        const result = await uploadContentMutation.mutateAsync({
          token,
          formData,
        });

        setMessage(result);

        // Reset form fields
        setTitle("");
        setType("");
        setLink("");
        setTags("");
        setNotes("");
        setFile(null);

        setTimeout(() => {
          contentFormOpenFunction(false);
        }, 1000);

        // Call callback to refresh dashboard
        if (onContentAdded) {
          onContentAdded();
        }
      }
    } catch (e: any) {
      console.log("Error:", e.message);
      setMessage(e.message || "Failed to add content");
    }
  };

  const { theme } = useContext(AuthContext);

  return (
    <div
      className={`${theme === "dark" ? "text-black" : "text-black"} w-80 md:w-100 p-5 rounded-md relative bg-white flex justify-center items-center flex-col`}
    >
      <button
        className="bg-orange-600 rounded-full absolute -right-4 -top-4 p-2 cursor-pointer shadow-orange-500 shadow-xl font-semibold flex justify-center items-center text-white text-4xl"
        onClick={handleClick}
      >
        <X />
      </button>
      <div>
        <h1 className="font-advercase text-xl">add something worth keeping</h1>
      </div>
      <div className="w-full flex justify-center items-center flex-col mt-5">
        <input
          className="text-2xl w-full border-b-2 border-orange-600 outline-0 mb-3 text-center font-garamond font-light text-gray-600"
          type="text"
          placeholder="Give it a name.."
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="text"
          name="notes"
          className="text-2xl w-full border-b-2 border-orange-600 outline-0 mb-3 text-center font-garamond font-light text-gray-600"
          placeholder="Add your thoughts.."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <div className="w-full flex justify-center items-center">
          <Link className="text-orange-600" />
          <input
            type="text"
            name="link"
            className="text-2xl w-full border-b-2 border-orange-600 outline-0 mb-3 text-center font-garamond font-light text-gray-600"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="Paste a link or source.."
          />
        </div>
        <input
          type="text"
          name="tags"
          value={tags}
          className="text-2xl w-full border-b-2 border-orange-600 outline-0 mb-3 text-center font-garamond font-light text-gray-600"
          onChange={(e) => setTags(e.target.value)}
          placeholder="Tags - work, fun..."
        />

        <div className="flex justify-center w-full my-2 mt-2">
          <p className="font-garamond text-xl">Type : </p>
          <select
            name="type"
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="text-orange-600 border-2 border-orange-600 px-2 py-1 rounded-md ml-2 cursor-pointer"
          >
            <option value="" disabled>
              Select a type
            </option>
            <option value="instagram">instagram</option>
            <option value="pinterest">pinterest</option>
            <option value="youtube">youtube</option>
            <option value="twitter">twitter</option>
            <option value="spotify">spotify</option>
            <option value="quote">quote</option>
            <option value="image">image</option>
            <option value="default">default</option>
          </select>
        </div>
        {type === "image" ? (
          <input
            type="file"
            name="file"
            className="text-2xl w-full border-b-2 border-orange-600 outline-0 mb-3 text-center font-garamond font-light text-gray-600"
            onChange={handleFileChange}
          />
        ) : null}
        <div className="flex justify-center w-full my-2 mt-2">
          <p className="font-garamond text-xl">Sharing : </p>
          <select
            name="sharing"
            id="sharing"
            value={sharing}
            onChange={(e) => {
              setSharing(e.target.value);
              console.log("Sharing: ", sharing);
            }}
            className="text-orange-600 border-2 border-orange-600 px-2 py-1 rounded-md ml-2 cursor-pointer"
          >
            <option value="public">public</option>
            <option value="private">private</option>
          </select>
        </div>
        <button
          className="flex w-full justify-center hover:shadow-orange-500 hover:shadow-xl transition-all duration-100 cursor-pointer bg-orange-600 px-3 py-2 rounded-md text-white mt-3"
          onClick={handleSubmit}
        >
          add to your archive
          <img className="ml-2 w-6 h-6" src={whiteLogo} alt="logo" />
        </button>
        {message !== "" && (
          <p
            className={`text-center text-sm mt-3 ${
              message.includes("Please") ||
              message.includes("long") ||
              message.includes("Error")
                ? "text-red-600"
                : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}

        {title.length <= 0 && (
          <p className="text-red-600">Please enter title</p>
        )}
      </div>
    </div>
  );
};

export default ContentForm;
