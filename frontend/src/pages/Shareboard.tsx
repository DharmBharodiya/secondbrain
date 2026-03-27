import { useEffect, useState } from "react";
import { GetSharedContent } from "../services/ContentService";
import { useParams } from "react-router";
import SpotifyBanner from "../components/Dashboard/Spotify";
import YouTubeBanner from "../components/Dashboard/YoutubeBanner";
import Article from "../components/Dashboard/Article";
import TwitterEmbed from "../components/Dashboard/TwitterEmbed";
import InstagramImage from "../components/Dashboard/InstagramImage";
import { ArrowUpRight } from "lucide-react";
import Button from "../components/Button";

type UserContent = {
  _id: string;
  title: string;
  type: string;
  link: string;
  tags: string[];
  notes: string;
};

const ShareBoard = () => {
  const [userContent, setUserContent] = useState<UserContent[]>();
  const { shareId } = useParams();

  async function FetchUserContent() {
    if (!shareId) return;

    const result = await GetSharedContent(shareId);
    setUserContent(result);
  }

  useEffect(() => {
    const callingFunction = async () => {
      await FetchUserContent();
    };

    callingFunction();
  }, [shareId]);

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

  return (
    <div>
      <div className="mt-32 mb-8 text-center">
        <h1 className="text-2xl font-advercase"> Shared Archive</h1>
        <Button
          variant="orange"
          text="Create your own archive like this"
          extraStyles="shadow-orange-500 shadow-xl transition-all duration-75 mt-3"
        />
      </div>
      <div className="w-full flex justify-center items-center">
        <div className="w-[90%] columns-1 xs:columns-2 md:columns-3 lg:columns-4 rounded-lg gap-2">
          {userContent ? (
            userContent.map((content: UserContent) => (
              <div
                key={content._id}
                className="break-inside-avoid relative group"
                // onClick={() => {
                //   setSelectedContent(content);
                //   setContentCardOpen(true);
                // }}
              >
                <div>
                  <div className="px-1 py-1 rounded-2xl bg-slate-100 border-2 border-slate-100 hover:border-gray-300 cursor-pointer outline-0">
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
                        {content.link.slice(8, 18)}...
                        <ArrowUpRight className="w-4 float-right absolute top-1 right-4" />
                      </a>
                    </div>
                  ) : null}
                </div>
              </div>
            ))
          ) : (
            <p className="font-advercase text-xl">
              No links yet. Start building your archive
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareBoard;
