import Footer from "../components/Footer";
import Hero from "../components/Hero";
import HeroCardMaster from "../components/HeroCardMaster";
import Navbar from "../components/Navbar";

const HomePage = () => {
  return (
    <div className="w-full min-h-screen relative flex flex-col bg-white justify-center items-center">
      <Hero />
      <HeroCardMaster />
      <Footer />
    </div>
  );
};

export default HomePage;
