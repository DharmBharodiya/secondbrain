const Article = ({ content }: any) => {
  return (
    <div className="w-full text-center flex justify-center flex-col items-center">
      <img className="w-13" src="src/assets/images/quotes.png" alt="quote" />
      <h1 className="font-advercase text-2xl">{content.notes}</h1>
      <img className="w-13" src="src/assets/images/quotes-2.png" alt="quote" />
    </div>
  );
};

export default Article;
