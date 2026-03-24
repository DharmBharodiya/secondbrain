import Navbar from "./components/Navbar";
import Hero from "./components/Hero";

function App() {
  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center bg-gray-200 selection:bg-orange-600 selection:text-white">
      <Navbar />
      <Hero />
    </div>
  );
}

export default App;
