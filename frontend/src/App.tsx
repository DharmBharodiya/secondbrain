import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import HeroCardMaster from "./components/HeroCardMaster";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center bg-white selection:bg-orange-600 selection:text-white">
      <Navbar />
      <Hero />
      <HeroCardMaster />
      <Footer />
    </div>
  );
}

export default App;
