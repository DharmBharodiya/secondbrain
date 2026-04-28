import { useContext, useEffect, useState, useRef, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../Context/AuthContext";
import {
  useFetchStarredContent,
  useFetchUser,
  useFetchUserContent,
  useSetSharedBoard,
} from "../hooks/useContentQueries";
import YouTubeBanner from "../components/Dashboard/YoutubeBanner";
import SpotifyBanner from "../components/Dashboard/Spotify";

import {
  SearchIcon,
  ArrowUpRight,
  PlusIcon,
  Share2,
  Pizza,
} from "lucide-react";
import Article from "../components/Dashboard/Article";
import TwitterEmbed from "../components/Dashboard/TwitterEmbed";
import InstagramImage from "../components/Dashboard/InstagramImage";
import ContentForm from "../components/ContentForm";
import ContentCard from "../components/Dashboard/ContentCard";
import { motion } from "framer-motion";
import PinterestImage from "../components/Dashboard/PinterstEmbed";
import ImageDisplay from "../components/Dashboard/ImageDisplay";
import Sidebar from "../components/Dashboard/Sidebar";
import StarComponent from "../components/Dashboard/StarComponent";
import Settings from "../components/Settings";
import ChatPage from "./ChatPage";
import Navbar2 from "@/components/Navbar2";
import { FolderContent } from "@/Context/FolderContext";

type Tags = {
  _id: string;
  title: string;
};

type UserContent = {
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

const Dashboard = () => {
  const [username, setUsername] = useState("");
  const [search, setSearch] = useState("");
  const [searchUserContent, setSearchUserContent] = useState<UserContent[]>([]);

  const [contentFormOpen, setContentFormOpen] = useState(false);
  const [contentCardOpen, setContentCardOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<UserContent>();
  const [shareValue, setShareValue] = useState(false);
  const [shareMessage, setShareMessage] = useState("");
  const [settings, setSettings] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const { folders, setFolders } = useContext(FolderContent);

  const contentScrollRef = useRef<HTMLDivElement>(null);

  const context = useContext(AuthContext);
  const token = context?.token as string;

  const { theme, starredOpened, setStarredOpened } = useContext(AuthContext);

  const { data: UserDetails } = useFetchUser(token);
  const { data: userContent = [] } = useFetchUserContent(token);
  const { data: starredContent = [] } = useFetchStarredContent(token);
  const shareBrainMutation = useSetSharedBoard();

  // Update username when user details are fetched
  useEffect(() => {
    if (UserDetails?.user?.username) {
      setUsername(UserDetails.user.username);
    }
  }, [UserDetails]);

  // Filter out null values from starred content (deleted items)
  const displayContent = useMemo(() => {
    let filtered = starredOpened
      ? starredContent.filter((item) => item !== null && item !== undefined)
      : userContent;

    // Filter by content type if a specific folder is selected
    if (folders && folders !== "all") {
      filtered = filtered.filter((content) => content.type === folders);
    }

    return filtered;
  }, [starredOpened, starredContent, userContent, folders]);

  const queryClient = useQueryClient();

  useEffect(() => {
    setStarredOpened(false);
  }, []);

  useEffect(() => {
    console.log("Starred Content: ", starredContent);
  }, [starredContent]);

  // Filter content based on search
  useEffect(() => {
    if (search.trim() === "") {
      setSearchUserContent(displayContent);
    } else {
      const filtered = displayContent.filter(
        (content) =>
          content.title.toLowerCase().includes(search.toLowerCase()) ||
          content.notes?.toLowerCase().includes(search.toLowerCase()) ||
          content.link?.toLowerCase().includes(search.toLowerCase()),
      );
      setSearchUserContent(filtered);
    }
  }, [search, displayContent]);

  useEffect(() => {
    const validUserContent = userContent.filter(
      (c) => c !== null && c !== undefined,
    );
    const validStarredContent = starredContent.filter(
      (c) => c !== null && c !== undefined,
    );

    console.log(
      "All user content types:",
      validUserContent.map((c) => ({ title: c.title, type: c.type })),
    );
    console.log(
      "All starred content types:",
      validStarredContent.map((c) => ({ title: c.title, type: c.type })),
    );
  }, [userContent, starredContent]);

  useEffect(() => {
    if (shareMessage) {
      const timer = setTimeout(() => {
        setShareMessage("");
      }, 15000);

      return () => clearTimeout(timer);
    }
  }, [shareMessage]);

  // Handle content added - invalidate queries to refetch fresh data
  const handleContentAdded = () => {
    queryClient.invalidateQueries({ queryKey: ["userContent"] });
    queryClient.invalidateQueries({ queryKey: ["starredContent"] });
  };

  const handleShare = async () => {
    try {
      const newShareValue = !shareValue;
      setShareValue(newShareValue);
      console.log("Share button clicked, newShareValue:", newShareValue);

      const res = await shareBrainMutation.mutateAsync({
        token,
        shareValue: newShareValue,
      });

      console.log("Share response full:", res);
      console.log("Share response fields:", Object.keys(res));
      console.log("Share response.userId:", res.userId);
      console.log("Share response.message:", res.message);

      if (res.userId) {
        setUserSharedQuote(res.userId);
        console.log("1. usersharedquote: ", userSharedQuote);
      } else if (res._id) {
        setUserSharedQuote(res._id);
        console.log("2. usersharedquote: ", userSharedQuote);
      } else {
        console.warn("No userId or _id found in response");
      }
      setShareMessage(res.message);
    } catch (error) {
      console.error("Share error:", error);
      setShareMessage("Error updating share settings");
      setShareValue((prev) => !prev); // revert state on error
    }
  };

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
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.08, // delay between each child
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <>
      <div className="md:hidden">
        <Navbar2 scrollElement={contentScrollRef.current} />
      </div>

      <div
        className={`${theme === "dark" ? "bg-black text-white" : "bg-slate-200 text-black"} w-full flex h-screen relative `}
      >
        <div
          className="bg-orange-500 rounded-full p-3 flex justify-center items-center absolute bottom-10 right-15 cursor-pointer shadow-xl shadow-orange-500 hover:scale-102 hover:bottom-11 hover:right-16 transition-all duration-100 group z-50"
          onClick={() => setChatOpen(!chatOpen)}
        >
          <h1 className="text-sm bg-white text-black px-2 py-1 border-black absolute whitespace-nowrap bottom-14 right-0 hidden group-hover:block">
            Chat with Archive
          </h1>
          <Pizza className="w-7 h-7 text-white" />
        </div>

        {chatOpen && (
          <div className="fixed bottom-24 right-6 w-96 h-96 bg-white rounded-lg shadow-2xl z-40 flex flex-col overflow-hidden md:bottom-24 md:right-6">
            <div className="bg-orange-500 text-white p-4 flex justify-between items-center">
              <h2 className="font-semibold">Archive Bot</h2>
              <button
                onClick={() => setChatOpen(false)}
                className="text-white hover:bg-orange-600 w-8 h-8 rounded-full cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-auto">
              <ChatPage />
            </div>
          </div>
        )}
        <div className="md:block hidden">
          <Sidebar settings={settings} setSettings={setSettings} />
        </div>
        <div className="h-screen w-full flex flex-col flex-1">
          {settings ? (
            <div className="w-full flex items-center h-screen">
              <Settings username={username} setUsername={setUsername} />
            </div>
          ) : (
            <div
              ref={contentScrollRef}
              className="p-6 md:pt-10 flex items-center flex-col pt-30 h-screen max-w-full overflow-x-hidden overflow-y-auto"
            >
              <div className="mb-8">
                <h1 className="text-2xl font-advercase">
                  {username || "User"}'s Dashboard
                </h1>
              </div>
              <div className="mb-10 flex justify-center items-center w-full">
                <input
                  type="text"
                  placeholder="Search..."
                  className="font-garamond text-2xl md:text-4xl px-4 text-gray-400 font-bold outline-0"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button className="bg-orange-500 hover:scale-104 transition-all duration-100 rounded-full p-2 text-xs cursor-pointer shadow-orange-500 shadow-xl font-semibold flex justify-center items-center mr-2">
                  <SearchIcon className="text-white" />
                </button>
                <button
                  className="bg-orange-500 hover:scale-104 transition-all duration-100 rounded-full p-2 cursor-pointer shadow-orange-500 shadow-xl font-semibold flex justify-center items-center text-white text-4xl mr-2"
                  onClick={() => {
                    setContentFormOpen((prev) => !prev);
                  }}
                >
                  <PlusIcon />
                </button>
                <button
                  className="bg-orange-500 hover:scale-104 transition-all duration-100 rounded-full p-2 cursor-pointer shadow-orange-500 shadow-xl font-semibold flex justify-center items-center text-white text-4xl"
                  onClick={handleShare}
                >
                  <Share2 />
                </button>
              </div>

              <div className="mb-3 h-6">
                {shareMessage && shareValue ? (
                  <a
                    href={`http://localhost:5173${shareMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-600 hover:text-orange-700 underline"
                  >
                    Access Sharable Link
                  </a>
                ) : shareMessage && !shareValue ? (
                  <p className="text-green-600">Sharing restricted.</p>
                ) : null}
              </div>

              {contentFormOpen && (
                <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50000 w-full">
                  <motion.div
                    onClick={() => setContentFormOpen(false)}
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                  <motion.div
                    className="relative z-51 mx-auto"
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ContentForm
                      handleClick={() => setContentFormOpen((prev) => !prev)}
                      onContentAdded={handleContentAdded}
                      contentFormOpenFunction={(value: boolean) =>
                        setContentFormOpen(value)
                      }
                    />
                  </motion.div>
                </div>
              )}

              {contentCardOpen && (
                <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50000">
                  <div
                    onClick={() => setContentCardOpen(false)}
                    className="absolute inset-0"
                  />
                  <div className="relative z-51 w-[90%]">
                    {selectedContent && (
                      <ContentCard
                        setcardopen={setContentCardOpen}
                        fetchContentAgain={handleContentAdded}
                        content={selectedContent}
                      />
                    )}
                  </div>
                </div>
              )}

              <motion.div
                className="w-[90%] columns-2 lg:columns-4 rounded-lg gap-2 z-10"
                variants={container}
                initial="show"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
              >
                {displayContent && displayContent.length > 0 ? (
                  displayContent.map((content: UserContent) => (
                    <motion.div
                      variants={item}
                      key={content._id}
                      className="break-inside-avoid relative group mb-2 w-full max-h-fit"
                      onClick={() => {
                        setSelectedContent(content);
                        console.log("SelectedContent:", content);
                        setContentCardOpen(true);
                      }}
                    >
                      <div>
                        <div className="px-1 py-1 rounded-2xl bg-slate-100 border-2 flex justify-center border-slate-100 hover:border-gray-300 cursor-pointer outline-0">
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

                          {/* Inside searchUserContent.map in Dashboard.tsx */}
                          {content.type === "twitter" && content.link && (
                            <div className="w-full flex justify-center items-start min-h-50 overflow-visible">
                              <TwitterEmbed url={content.link} />
                            </div>
                          )}

                          {content.type === "pinterest" && content.link && (
                            <div className="w-full mb-2">
                              <PinterestImage url={content.link} />
                            </div>
                          )}
                          {content.type === "instagram" && content.link && (
                            <InstagramImage url={content.link} />
                          )}
                        </div>
                        <div className="flex justify-between px-3 mt-1 mb-1">
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
                        <div
                          className="w-8 h-8 top-3 right-4 absolute group-hover:flex justify-center items-center bg-white/80 rounded-full text-xs p-2 hidden"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <StarComponent
                            contentId={content._id}
                            starredContent={starredContent}
                          />
                        </div>
                        {content.link ? (
                          <div className="w-fit bottom-3 right-4 absolute group-hover:flex justify-center items-center bg-orange-600/90 rounded-lg text-xs pr-10 py-2 px-3 hidden">
                            <a href={content.link} target="_blank">
                              {content.link.slice(8, 18)}...
                              <ArrowUpRight className="w-4 float-right absolute top-1 right-4" />
                            </a>
                          </div>
                        ) : null}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="font-advercase text-xl">
                    {folders !== "all"
                      ? `No ${folders} posts yet`
                      : "No links yet. Start building your archive"}
                  </p>
                )}
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
