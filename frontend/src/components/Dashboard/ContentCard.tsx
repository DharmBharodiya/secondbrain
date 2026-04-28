import { useContext, useState } from "react";
import { MakeContentPublic } from "../../services/ContentService";
import Article from "./Article";
import InstagramImage from "./InstagramImage";
import SpotifyBanner from "./Spotify";
import TwitterEmbed from "./TwitterEmbed";
import YouTubeBanner from "./YoutubeBanner";
import { Trash, Edit2Icon } from "lucide-react";
import { AuthContext } from "../../Context/AuthContext";
import { useNavigate } from "react-router";
import EditContent from "../EditContent";
import ImageDisplay from "./ImageDisplay";
import { useDeleteContent } from "../../hooks/useContentQueries";
import { useQueryClient } from "@tanstack/react-query";

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
      | "instagram"
      | "pinterest"
      | "image";
    link: string;
    notes: string;
    _id: string;
    tags: Tags[];
    imageUrl: string;
    sharing: "public" | "private";
    createdAt: string;
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
    | "instagram"
    | "pinterest"
    | "image";
  link: string;
  notes: string;
  _id: string;
  tags: Tags[];
  imageUrl: string;
  sharing: "public" | "private";
  createdAt: string;
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
  const { token, setEditData } = useContext(AuthContext);
  // const [message, setMessage] = useState("");
  const [contentFormOpen, setContentFormOpen] = useState(false);
  const [pubOrPriv, setPubOrPriv] = useState(content.sharing);

  const navigate = useNavigate();

  const queryClient = useQueryClient();

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

  const deleteContentMutation = useDeleteContent();

  const handleDelete = async (content: Content) => {
    // const deleteMessage = await DeleteContentService({
    //   token,
    //   contentId: content._id,
    // });

    if (token) {
      deleteContentMutation.mutateAsync({
        token,
        contentId: content._id,
      });

      queryClient.invalidateQueries({ queryKey: ["userContent"] });
      queryClient.invalidateQueries({ queryKey: ["starredContent"] });

      setcardopen(false);
      // setMessage(deleteMessage);
      fetchContentAgain();
      navigate("/dashboard");
    }
  };

  const handleEdit = () => {
    console.log("Content object:", content);
    console.log("Content tags:", content.tags);
    // const tagTitles =
    //   content.tags?.map((tag) => tag.title).join(", ") || "No tags";
    // console.log(`Content tags: ${tagTitles}`);
    setEditData(content);
    setContentFormOpen(true);
  };

  const handlePublic = async (contentId: string) => {
    if (pubOrPriv === "public") {
      setPubOrPriv("private");
    } else if (pubOrPriv === "private") {
      setPubOrPriv("public");
    }

    if (token) {
      const resultMessage = await MakeContentPublic(token, contentId);

      console.log("Public message: ", resultMessage);
      // Update state based on actual API response
      if (resultMessage) {
        setPubOrPriv(resultMessage);
      }
    }
  };

  const { theme } = useContext(AuthContext);
  return (
    <div
      className={`${theme === "dark" ? "text-black" : "text-black"} w-full px-4 py-4 rounded-2xl bg-white grid grid-cols-2`}
    >
      {contentFormOpen && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50000 w-full">
          <div
            onClick={() => setContentFormOpen(false)}
            className="absolute inset-0"
          />
          <div className="relative z-51 mx-auto">
            <EditContent
              handleClick={() => setContentFormOpen((prev) => !prev)}
              contentFormOpenFunction={(value: boolean) =>
                setContentFormOpen(value)
              }
            />
          </div>
        </div>
      )}
      <div className="px-1 py-1 rounded-2xl z-15 bg-slate-100 border-2 border-slate-100 hover:border-gray-300 cursor-pointer outline-0 flex justify-center items-center max-h-100">
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

        {content.type === "image" && content.imageUrl && (
          <ImageDisplay url={content.imageUrl} />
        )}

        {content.type === "twitter" && content.link && (
          <TwitterEmbed url={content.link} />
        )}

        {content.type === "instagram" && content.link && (
          <InstagramImage url={content.link} />
        )}
      </div>
      <div className="ml-6 flex flex-col justify-around relative">
        <div className="mb-6 w-[90%]">
          <div>
            <p className="text-sm font-bold text-gray-500">
              {content.type.toUpperCase()}
            </p>
            <p className="text-sm mb-3 text-gray-500">
              {new Date(content.createdAt).toLocaleDateString("en-US", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
            <h1 className="text-4xl font-advercase">{content.title}</h1>
            <h1 className="text-md">{content.notes}</h1>
          </div>
          {content.tags.length > 0 && (
            <div>
              <h1 className="font-bold text-md mb-1">TAGS</h1>
              <div className="flex flex-wrap gap-2">
                {content.tags &&
                  content.tags.map((tag: Tags) => (
                    <div className="text-white bg-orange-600 rounded-full px-4 text-center font-semibold text-sm py-1 flex w-fit">
                      {tag.title}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center">
          <div>
            {content.link && (
              <div className="w-fit relative group mr-2">
                <a href={content.link} className="text-orange-600">
                  visit resource
                </a>
                <div className="border-2 z-10 border-orange-600 absolute w-full -left-30 opacity-0 group-hover:left-0 group-hover:opacity-100 transition-all duration-400 "></div>
              </div>
            )}
          </div>
          {content.link && <h1 className="text-sm text-orange-600">⬤</h1>}
          <button
            className="w-fit relative group ml-2 cursor-pointer"
            onClick={() => handleDelete(content)}
          >
            <Trash className="w-4 text-orange-600" />
            <div className="border-2 border-orange-600 absolute w-full -right-4 opacity-0 group-hover:left-0 group-hover:opacity-100 transition-all duration-400 "></div>
          </button>
          <h1 className="text-sm text-orange-600 ml-2">⬤</h1>
          <button
            className="w-fit relative group ml-2 cursor-pointer"
            onClick={() => handlePublic(content._id)}
          >
            <h1 className="text-orange-500">{pubOrPriv}</h1>
            <div className="border-2 border-orange-600 absolute w-full -right-4 opacity-0 group-hover:left-0 group-hover:opacity-100 transition-all duration-400 "></div>
          </button>
        </div>
        <div className="absolute top-0 right-0">
          <button
            className="bg-orange-500 hover:scale-104 transition-all duration-100 rounded-full p-2 cursor-pointer shadow-orange-500 shadow-xl font-semibold flex justify-center items-center text-white text-4xl mr-2"
            onClick={handleEdit}
          >
            <Edit2Icon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContentCard;
