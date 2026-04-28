import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import SpotifyBanner from "../components/Dashboard/Spotify";
import YouTubeBanner from "../components/Dashboard/YoutubeBanner";
import Article from "../components/Dashboard/Article";
import TwitterEmbed from "../components/Dashboard/TwitterEmbed";
import InstagramImage from "../components/Dashboard/InstagramImage";
import { ArrowUpRight } from "lucide-react";
import Button from "../components/Button";
import { motion } from "framer-motion";
import ImageDisplay from "../components/Dashboard/ImageDisplay";
import Navbar from "../components/Navbar";
import { useShareBoard } from "../hooks/useContentQueries";
import { AuthContext } from "@/Context/AuthContext";

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
  const { userSharedQuote, theme } = useContext(AuthContext);
  const [userData, setUserData] = useState<userType>();

  const { data: result, refetch } = useShareBoard(shareId);

  useEffect(() => {
    console.log("shareboard thingy: ", userSharedQuote);
  }, [userSharedQuote]);

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
      <div>
        <div className="mt-32 mb-8 text-center">
          <h1 className="text-2xl font-advercase">
            {" "}
            {userData?.username}'s Shared Archive
          </h1>
          <h1>{userData?.sharedQuote}</h1>
          <Button
            variant="orange"
            text="Create your own archive like this"
            extraStyles="shadow-orange-500 shadow-xl transition-all duration-75 mt-3"
          />
        </div>
        <div className="w-full flex justify-center items-center">
          {userContent && userContent.length > 0 ? (
            <motion.div
              className="w-[90%] columns-1 xs:columns-2 md:columns-3 lg:columns-4 rounded-lg gap-2"
              variants={container}
              initial="show"
              animate="show"
            >
              {userContent.map((content: UserContent) => (
                <motion.div
                  key={content._id}
                  className="break-inside-avoid relative group"
                  variants={item}
                >
                  <div>
                    <div className="px-1 py-1 rounded-2xl bg-slate-100 border-2 border-slate-100 hover:border-gray-300 cursor-pointer outline-0 flex justify-center">
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
                    <div className="flex justify-between px-3 items-center mt-1">
                      <h1
                        className={`${theme === "dark" ? "text-slate-300" : "text-slate-600 text-xs"} text-xs`}
                      >
                        {/* {content.title} */}
                        {(() => {
                          const createdDate = new Date(content.createdAt);
                          const currentDate = new Date();
                          const diffTime = Math.abs(
                            currentDate.getTime() - createdDate.getTime(),
                          );
                          const diffDays = Math.ceil(
                            diffTime / (1000 * 60 * 60 * 24),
                          );
                          return diffDays === 0
                            ? "Today"
                            : diffDays === 1
                              ? "1 day ago"
                              : `${diffDays} days ago`;
                        })()}
                      </h1>
                      <h1
                        className={`${theme === "dark" ? "text-slate-300" : "text-slate-600 text-xs"} text-xs`}
                      >
                        {/* {content.title} */}
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
            <p className="font-advercase text-xl text-center">
              No links yet. Start building your archive
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default ShareBoard;
