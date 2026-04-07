import { useContext, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { StarContent } from "../../services/ContentService";
import { useStarContent } from "../../hooks/useContentQueries";

const StarComponent = ({ contentId }: { contentId: string }) => {
  const [starred, setStarred] = useState(false);

  const { token } = useContext(AuthContext);

  const starMutation = useStarContent();

  const starContent = async () => {
    if (token) {
      //   console.log("Token: ", token, " ContentId: ", contentId);
      // const res = await StarContent(contentId, token);
      const res = starMutation.mutateAsync({ contentId, token });

      console.log(res);
    }
  };

  const handleStarClick = () => {
    setStarred((prev) => !prev);
    starContent();
  };

  return (
    <button
      className={`text-2xl ${starred ? "text-amber-800" : "text-blacks"}`}
      onClick={handleStarClick}
    >
      ★
    </button>
  );
};

export default StarComponent;
