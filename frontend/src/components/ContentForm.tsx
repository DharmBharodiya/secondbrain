import { useContext, useState } from "react";
import { Link, X } from "lucide-react";
import { UploadContentService } from "../services/ContentService";
import { AuthContext } from "../Context/AuthContext";

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
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [link, setLink] = useState("");
  const [tags, setTags] = useState("");
  const [notes, setNotes] = useState("");
  const [separatedTags, setSeparatedTags] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  const { token } = useContext(AuthContext);

  const tagsSorted = () => {
    const newTags = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");
    setSeparatedTags(newTags);
  };

  const handleSubmit = async () => {
    tagsSorted();

    try {
      if (token) {
        const result = await UploadContentService({
          token,
          title,
          type,
          notes,
          separatedTags,
          link,
        });

        setMessage(result);

        // Reset form fields
        setTitle("");
        setType("");
        setLink("");
        setTags("");
        setNotes("");
        setSeparatedTags([]);

        setTimeout(() => {
          contentFormOpenFunction(false);
        }, 1000);

        // Call callback to refresh dashboard
        if (onContentAdded) {
          onContentAdded();
        }
      }
    } catch (e) {
      console.log("Error" + e);
    }
  };

  return (
    <div className="w-full p-5 rounded-md relative bg-white flex justify-center items-center flex-col">
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
            <option value="instagram">instagram</option>
            <option value="youtube">youtube</option>
            <option value="twitter">twitter</option>
            <option value="spotify">spotify</option>
            <option value="article">article</option>
            <option value="quote">quote</option>
            <option value="note">note</option>
            <option value="default">default</option>
          </select>
        </div>
        <button
          className="flex w-full justify-center hover:shadow-orange-500 hover:shadow-xl transition-all duration-100 cursor-pointer bg-orange-600 px-3 py-2 rounded-md text-white mt-3"
          onClick={handleSubmit}
        >
          add to your archive
          <img
            className="ml-2 w-6 h-6"
            src="src/assets/images/white-logo.PNG"
          />
        </button>
        {message !== "" && <p className="text-center text-black">{message}</p>}
      </div>
    </div>
  );
};

export default ContentForm;
