import Navbar from "@/components/Navbar";
import { NavLink, useParams } from "react-router";

const infoContent = [
  {
    title: "Explore",
    description: "Discover and browse your collection",
    content:
      "Dive into your curated collection of articles, images, quotes, and more. With powerful search and filtering options, finding exactly what you saved has never been easier. Explore by content type, folder, or simply search your entire archive.",
    icon: "🔍",
  },
  {
    title: "Why Archive",
    description: "Never lose important information again",
    content:
      "In the digital age, information overload is real. Archive helps you capture, organize, and preserve the content that matters most. Whether it's inspiring quotes, research articles, or beautiful imagery, your Archive is your personal knowledge vault that grows with you.",
    icon: "💾",
  },
  {
    title: "How it works",
    description: "Get started in three simple steps",
    content:
      "1. Save: Capture articles, images, quotes, and more from across the web. 2. Organize: Sort content into folders and tag them for easy discovery. 3. Access: Search and retrieve your archived content anytime, anywhere. Your Archive is always there when you need it.",
    icon: "⚙️",
  },
  {
    title: "What's New",
    description: "Latest features and improvements",
    content:
      "We're constantly improving Archive to serve you better. Recent updates include enhanced search capabilities, new sharing options to collaborate with friends, improved mobile experience, and support for more content types. Stay tuned for more exciting features coming soon!",
    icon: "✨",
  },
];

const InfoPage = () => {
  const { topic } = useParams();
  const currentContent = infoContent.find((item) => item.title === topic);

  return (
    <>
      <Navbar />
      <div className="w-full min-h-screen bg-gradient-to-b to-orange-950 to-black px-6 py-20">
        <div className="max-w-4xl mx-auto mt-40">
          <div className="text-center mb-12">
            <h1 className="text-6xl font-advercase text-white mb-4">
              {currentContent?.icon} {currentContent?.title}
            </h1>
            <p className="text-xl text-white/90">
              {currentContent?.description}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 flex justify-center flex-col items-center">
            <p className="text-lg text-gray-700 leading-relaxed">
              {currentContent?.content}
            </p>
            <button className="bg-orange-500 w-fit mt-5 text-white px-4 py-2 rounded-md">
              <NavLink to={"/"}>Go back</NavLink>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default InfoPage;
