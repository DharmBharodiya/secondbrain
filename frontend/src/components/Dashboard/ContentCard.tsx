import { useContext, useState } from "react";
import { DeleteContentService } from "../../services/ContentService";
import Article from "./Article";
import InstagramImage from "./InstagramImage";
import SpotifyBanner from "./Spotify";
import TwitterEmbed from "./TwitterEmbed";
import YouTubeBanner from "./YoutubeBanner";
import { Trash } from "lucide-react";
import { AuthContext } from "../../Context/AuthContext";
import { useNavigate } from "react-router";

type UserContent = {
  content: {
    title: string;
    type:
      | "youtube"
      | "twitter"
      | "spotify"
      | "default"
      | "article"
      | "quote"
      | "note"
      | "instagram";
    link: string;
    notes: string;
    _id: string;
    tags: [];
  };
  setcardopen: (value: boolean) => void;
  fetchContentAgain: () => void;
};

type Content = {
  title: string;
  type:
    | "youtube"
    | "twitter"
    | "spotify"
    | "default"
    | "article"
    | "quote"
    | "note"
    | "instagram";
  link: string;
  notes: string;
  _id: string;
  tags: [];
};

type Tags = {
  _id: string;
  title: string;
};

const ContentCard = ({
  content,
  setcardopen,
  fetchContentAgain,
}: UserContent) => {
  const { token } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const getYouTubeId = (url: string): string | null => {
    // Regex covers:
    // - youtube.com/watch?v=ID
    // - youtu.be/ID
    // - youtube.com/embed/ID
    // - youtube.com/v/ID
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    // Return the ID if it's the standard 11 characters, otherwise null
    return match && match[2].length === 11 ? match[2] : null;
  };

  const handleDelete = async (content: Content) => {
    const deleteMessage = await DeleteContentService({
      token,
      contentId: content._id,
    });

    setcardopen(false);
    setMessage(deleteMessage);
    fetchContentAgain();
    navigate("/dashboard");
  };

  return (
    <div className="w-full px-4 py-4 rounded-2xl bg-white grid grid-cols-2">
      <div className="px-1 py-1 rounded-2xl bg-slate-100 border-2 border-slate-100 hover:border-gray-300 cursor-pointer outline-0 flex justify-center items-center">
        {/* for spotify */}
        {content.type === "spotify" && content.link && (
          <SpotifyBanner link={content.link} height="352" />
        )}
        {content.type === "youtube" && content.link
          ? (() => {
              const videoId = getYouTubeId(content.link);

              if (!videoId) return <span>Invalid YouTube Link</span>;

              return <YouTubeBanner videoId={videoId} />;
            })()
          : null}
        {content.type === "quote" ? (
          <div className="flex justify-center items-center">
            <Article content={content} />
          </div>
        ) : null}

        {content.type === "twitter" && content.link && (
          <TwitterEmbed url={content.link} />
        )}

        {content.type === "instagram" && content.link && (
          <InstagramImage url={content.link} />
        )}
      </div>
      <div className="ml-6 flex flex-col justify-around">
        <div className="mb-6">
          <div>
            <p className="text-sm font-bold">{content.type.toUpperCase()}</p>
            <h1 className="text-4xl font-advercase">{content.title}</h1>
            <h1 className="text-md">{content.notes}</h1>
          </div>
          <div>
            <h1 className="font-bold text-md mb-1">TAGS</h1>
            <div className="flex gap-2">
              {content.tags.map((tag: Tags) => (
                <div className="text-white bg-orange-600 rounded-full px-4 text-center font-semibold text-sm py-1 flex w-fit">
                  {tag.title}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center">
          <div>
            {content.link && (
              <div className="w-fit relative group mr-2">
                <a href={content.link} className="text-orange-600">
                  visit resource
                </a>
                <div className="border-2 border-orange-600 absolute w-full -left-30 opacity-0 group-hover:left-0 group-hover:opacity-100 transition-all duration-400 "></div>
              </div>
            )}
          </div>
          <h1 className="text-sm text-orange-600">⬤</h1>
          <button
            className="w-fit relative group ml-2 cursor-pointer"
            onClick={() => handleDelete(content)}
          >
            <Trash className="w-4 text-orange-600" />
            <div className="border-2 border-orange-600 absolute w-full -right-4 opacity-0 group-hover:left-0 group-hover:opacity-100 transition-all duration-400 "></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContentCard;
