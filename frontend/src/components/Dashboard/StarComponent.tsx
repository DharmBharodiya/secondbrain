import { useContext, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { StarContent } from "../../services/ContentService";
import { useStarContent } from "../../hooks/useContentQueries";

interface starredContent {
  _id: string;
  userId: string;
  imageUrl?: string;
  link?: string;
  notes?: string;
  sharing: "public" | "private";
  tags: string[];
  type: string;
  title: string;
}

const StarComponent = ({
  contentId,
  starredContent = [],
}: {
  contentId: string;
  starredContent?: starredContent[];
}) => {
  // const [starred, setStarred] = useState(false);

  const [starred, setStarred] = useState(() => {
    if (starredContent && starredContent.length > 0) {
      return starredContent
        .filter((cont) => cont !== null && cont !== undefined)
        .some((cont) => cont._id === contentId);
    }
    return false;
  });

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
