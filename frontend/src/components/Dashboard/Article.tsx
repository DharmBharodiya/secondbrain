import quoteTop from "../../assets/images/quotes.png";
import quoteBottom from "../../assets/images/quotes-2.png";

const Article = ({ content }: any) => {
  return (
    <div className="w-full text-center flex justify-center flex-col items-center">
      <img className="w-13" src={quoteTop} alt="quote" />
      <h1 className="font-advercase text-2xl">{content.title}</h1>
      <img className="w-13" src={quoteBottom} alt="quote" />
    </div>
  );
};

export default Article;
