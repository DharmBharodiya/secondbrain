import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import SpotifyBanner from "../components/Dashboard/Spotify";
import YouTubeBanner from "../components/Dashboard/YoutubeBanner";
import Article from "../components/Dashboard/Article";
import TwitterEmbed from "../components/Dashboard/TwitterEmbed";
import InstagramImage from "../components/Dashboard/InstagramImage";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import Button from "../components/Button";
import { motion } from "framer-motion";
import ImageDisplay from "../components/Dashboard/ImageDisplay";
import Navbar from "../components/Navbar";
import { useShareBoard } from "../hooks/useContentQueries";
import { AuthContext } from "@/Context/AuthContext";
import CommentsPage from "./CommentsPage";

type UserContent = {
  _id: string;
  title: string;
  type: string;
  link: string;
  tags: string[];
  notes: string;
  imageUrl: string;
  createdAt: string;
};

type userType = {
  _id: string;
  username: string;
  password: string;
  sharedQuote?: string;
};

const ShareBoard = () => {
  const [userContent, setUserContent] = useState<UserContent[]>();
  const { shareId } = useParams();
  const { theme } = useContext(AuthContext);
  const [userData, setUserData] = useState<userType>();
  const [commentsOpen, setCommentsOpen] = useState(false);

  const { data: result, refetch } = useShareBoard(shareId);

  // Move state update to useEffect to prevent infinite loop
  useEffect(() => {
    if (result) {
      setUserContent(result.content);
      setUserData(result.shareQuote);
    }
  }, [result]);

  useEffect(() => {
    refetch();
  }, [shareId, refetch]);

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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <>
      <Navbar />
      <div
        className={`w-full min-h-screen pt-20 md:pt-24 ${theme === "dark" ? "bg-black text-white" : "bg-white text-black"} overflow-x-hidden`}
      >
        <div className="px-4 md:px-6 py-8 md:py-12 text-center">
          <h1 className="text-xl md:text-3xl font-advercase mb-2">
            {userData?.username}'s Shared Archive
          </h1>
          <h1 className="text-sm md:text-base mb-4">{userData?.sharedQuote}</h1>
          <Button
            variant="orange"
            text="Create your own archive like this"
            extraStyles="shadow-orange-500 shadow-xl transition-all duration-75 mt-3"
          />
        </div>

        {/* Floating Comments Button */}
        <div
          className="bg-orange-500 rounded-full p-3 flex justify-center items-center fixed bottom-6 right-4 md:bottom-10 md:right-6 cursor-pointer shadow-xl shadow-orange-500 hover:scale-102 transition-all duration-100 group z-50"
          onClick={() => setCommentsOpen(!commentsOpen)}
        >
          <h1 className="text-sm bg-white text-black px-2 py-1 border-black absolute whitespace-nowrap bottom-14 right-0 hidden group-hover:block">
            Comments
          </h1>
          <MessageCircle className="w-6 md:w-7 h-6 md:h-7 text-white" />
        </div>

        {/* Comments Modal */}
        {commentsOpen && shareId && (
          <div className="fixed bottom-20 md:bottom-24 right-4 md:right-6 w-[calc(100vw-2rem)] md:w-96 h-96 bg-white rounded-lg shadow-2xl z-40 flex flex-col overflow-hidden">
            <div className="bg-orange-500 text-white p-4 flex justify-between items-center">
              <h2 className="font-semibold">Comments</h2>
              <button
                onClick={() => setCommentsOpen(false)}
                className="text-white hover:bg-orange-600 w-8 h-8 rounded-full cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-auto">
              <CommentsPage shareId={shareId} />
            </div>
          </div>
        )}

        <div className="w-full flex justify-center items-center px-4 md:px-6 pb-8 md:pb-12">
          {userContent && userContent.length > 0 ? (
            <motion.div
              className="w-full max-w-6xl columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4"
              variants={container}
              initial="show"
              animate="show"
            >
              {userContent.map((content: UserContent) => (
                <motion.div
                  key={content._id}
                  className="break-inside-avoid relative group mb-4"
                  variants={item}
                >
                  <div>
                    <div className="px-1 py-1 rounded-2xl bg-slate-100 border-2 border-slate-100 hover:border-gray-300 cursor-pointer outline-0 flex justify-center w-full">
                      {/* for spotify */}
                      {content.type === "spotify" && content.link && (
                        <SpotifyBanner link={content.link} height="152" />
                      )}
                      {content.type === "youtube" && content.link
                        ? (() => {
                            const videoId = getYouTubeId(content.link);

                            if (!videoId)
                              return <span>Invalid YouTube Link</span>;

                            return <YouTubeBanner videoId={videoId} />;
                          })()
                        : null}
                      {content.type === "image" && content.imageUrl ? (
                        <ImageDisplay url={content.imageUrl} />
                      ) : null}
                      {content.type === "quote" ? (
                        <div className="flex justify-center items-center w-full">
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
                    <div className="flex justify-between px-2 md:px-3 items-center mt-1 gap-2">
                      <h1
                        className={`text-xs truncate ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}
                      >
                        {content.title.slice(0, 14) + ".."}
                      </h1>
                      <h1
                        className={`text-xs flex-shrink-0 ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}
                      >
                        {new Date(content.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </h1>
                    </div>
                    {content.link ? (
                      <div className="w-fit bottom-10 right-4 absolute group-hover:flex justify-center items-center bg-orange-600/90 rounded-lg text-xs pr-10 py-2 px-3 hidden">
                        <a href={content.link} target="_blank">
                          {content.link.slice(8, 18)}...
                          <ArrowUpRight className="w-4 float-right absolute top-1 right-4" />
                        </a>
                      </div>
                    ) : null}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <p className="font-advercase text-lg md:text-xl text-center py-12">
              No links yet. Start building your archive
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default ShareBoard;
