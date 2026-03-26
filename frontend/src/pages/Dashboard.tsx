import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import { UserFetchService } from "../services/AuthService";
import { FetchContentService } from "../services/ContentService";
import YouTubeBanner from "../components/Dashboard/YoutubeBanner";
import SpotifyBanner from "../components/Dashboard/Spotify";

import { SearchIcon, ArrowUpRight } from "lucide-react";
import Article from "../components/Dashboard/Article";
import TwitterEmbed from "../components/Dashboard/TwitterEmbed";
import InstagramEmbed from "../components/Dashboard/InstagramEmbed";
import InstagramImage from "../components/Dashboard/InstagramImage";

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
    | "instagram";
  link: string;
  notes: string;
  _id: string;
  tags: [];
};

// type Tags = {
//   _id: string;
//   title: string;
// };

const Dashboard = () => {
  const [username, setUsername] = useState("");
  const [userContent, setUserContent] = useState<UserContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const context = useContext(AuthContext);
  const token = context?.token;

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (token) {
        try {
          setLoading(true);
          setError("");
          const result = await UserFetchService(token);
          const fetchedUserContent: UserContent[] =
            await FetchContentService(token);

          setUserContent(fetchedUserContent);
          setUsername(result.user.username);
        } catch (e) {
          console.log("User fetch error: " + e);
          setError("Failed to load data. Please try again.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserProfile();
  }, [token]);

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

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center mt-10">{error}</div>;
  }

  return (
    <div className="p-6 mt-10 w-full min-h-screen  flex flex-col justify-center items-center bg-slate-200">
      <div className="mb-8">
        <h1 className="text-2xl font-advercase">{username}'s Dashboard</h1>
      </div>
      <div className="mb-10 flex justify-center items-center w-full">
        <input
          type="text"
          placeholder="Search..."
          className="font-garamond text-4xl px-4 text-gray-400 font-bold outline-0"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="bg-orange-600 rounded-full p-2 text-xs cursor-pointer shadow-orange-500 shadow-xl font-semibold flex justify-center items-center">
          <SearchIcon className="text-white" />
        </button>
      </div>

      <div className="w-[90%] columns-1 sm:columns-2 lg:columns-4 rounded-lg gap-2">
        {userContent.map((content) => (
          <div key={content._id} className="break-inside-avoid relative group">
            <div>
              <div className="px-1 py-1 rounded-2xl bg-slate-100 border-2 border-slate-100 hover:border-gray-300 cursor-pointer outline-0">
                {/* for spotify */}
                {content.type === "spotify" && content.link && (
                  <SpotifyBanner link={content.link} height="152" />
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
                {/* <div className="flex items-center">
                {content.tags.map((tag: Tags) => (
                  <div
                    key={tag._id}
                    className="bg-gray-200 text-xs rounded-full px-2 py-1 max-w-fit w-fit"
                  >
                    <h1>{tag.title}</h1>
                  </div>
                ))}
              </div> */}
              </div>
              <div className="flex justify-center items-center flex-col mt-1">
                <h1 className="text-slate-600 text-xs">{content.title}</h1>
              </div>
              {content.link ? (
                <div className="w-fit bottom-10 right-4 absolute group-hover:flex justify-center items-center bg-orange-600/90 rounded-lg text-xs pr-10 py-2 px-3 hidden">
                  <a href={content.link} target="_blank">
                    {content.link.slice(6, 18)}...
                    <ArrowUpRight className="w-4 float-right absolute top-1 right-4" />
                  </a>
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface InstagramSmallProps {
  url: string;
  scale?: number; // e.g., 0.5 for half size
}

export default Dashboard;
