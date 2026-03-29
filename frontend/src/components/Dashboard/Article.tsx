import quoteTop from "../../assets/images/quotes.png";
import quoteBottom from "../../assets/images/quotes-2.png";
import { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";

const Article = ({ content }: any) => {
  const { theme } = useContext(AuthContext);

  return (
    <div
      className={`w-full text-center flex justify-center flex-col items-center ${theme === "dark" ? "text-black" : "text-black"}`}
    >
      <img className="w-13" src={quoteTop} alt="quote" />
      <h1 className="font-advercase text-2xl">{content.title}</h1>
      <img className="w-13" src={quoteBottom} alt="quote" />
    </div>
  );
};

export default Article;
