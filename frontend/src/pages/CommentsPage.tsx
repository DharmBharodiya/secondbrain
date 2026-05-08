import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import { fetchComments, postComment } from "../services/ContentService";
import { getRandomUsername, getRandomColor } from "../lib/utils";

type Comment = {
  _id: string;
  comment: string;
  userId: string;
  shareId: string;
  createdAt: string;
};

interface CommentsPageProps {
  shareId: string;
}

const CommentsPage = ({ shareId }: CommentsPageProps) => {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { token, theme } = useContext(AuthContext);

  // Fetch comments on mount or when shareId changes
  useEffect(() => {
    const loadComments = async () => {
      if (!token || !shareId) return;
      try {
        setLoading(true);
        const data = await fetchComments(token, shareId);
        setComments(data.comments || []);
        setError("");
      } catch (err) {
        setError("Failed to load comments");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadComments();
  }, [shareId, token]);

  const handleCommentSubmit = async () => {
    if (commentText.trim() === "") return;

    if (!token) {
      setError("Please log in to comment");
      return;
    }

    try {
      setLoading(true);
      await postComment(token, shareId, commentText);

      // Add the new comment optimistically
      const newComment: Comment = {
        _id: Date.now().toString(),
        comment: commentText,
        userId: "You",
        shareId: shareId,
        createdAt: new Date().toISOString(),
      };

      setComments((prev) => [newComment, ...prev]);
      setCommentText("");
      setError("");

      // Refetch comments to ensure consistency
      const data = await fetchComments(token, shareId);
      setComments(data.comments || []);
    } catch (err) {
      setError("Failed to post comment");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className={`w-full h-full flex flex-col justify-between p-4 ${theme === "dark" ? "bg-black text-white" : "bg-white text-black"}`}
    >
      <style>{`
        .comments-scroll::-webkit-scrollbar {
          width: 8px;
        }
        .comments-scroll::-webkit-scrollbar-track {
          background: ${theme === "dark" ? "#1f2937" : "#f3f4f6"};
          border-radius: 4px;
        }
        .comments-scroll::-webkit-scrollbar-thumb {
          background: #f97316;
          border-radius: 4px;
        }
        .comments-scroll::-webkit-scrollbar-thumb:hover {
          background: #ea580c;
        }
      `}</style>
      <div className="mb-4">
        <h1
          className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-black"}`}
        >
          Comments
        </h1>
        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
      </div>

      <div className="flex-1 overflow-y-auto mb-4 space-y-3 flex flex-col comments-scroll">
        {loading && comments.length === 0 ? (
          <div className="text-sm text-gray-500">
            <h1>Loading comments...</h1>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-sm text-gray-500 text-center py-8">
            <h1>No comments yet. Be the first to comment!</h1>
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment._id}
              className={`border-l-4 border-orange-500 p-3 rounded-r-md ${theme === "dark" ? "bg-gray-900" : "bg-gray-100"}`}
            >
              <div className="flex justify-between items-start gap-2">
                <div className="flex items-center gap-2 flex-1">
                  <div
                    className="w-6 h-6 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor: getRandomColor(comment.userId),
                    }}
                    title={getRandomUsername(comment.userId)}
                  />
                  <p className="text-xs font-semibold text-orange-500 truncate">
                    {comment.userId === "You"
                      ? "You"
                      : getRandomUsername(comment.userId)}
                  </p>
                </div>
                <span className="text-xs text-gray-500 flex-shrink-0">
                  {formatDate(comment.createdAt)}
                </span>
              </div>
              <p className="text-sm mt-2 whitespace-pre-wrap break-words">
                {comment.comment}
              </p>
            </div>
          ))
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Add a comment..."
          className={`outline-none border-2 border-orange-500 px-3 py-2 rounded-md flex-1 text-sm ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"}`}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleCommentSubmit()}
          disabled={loading || !token}
        />
        <button
          className={`bg-orange-500 px-4 py-2 rounded-md text-white font-bold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
          onClick={handleCommentSubmit}
          disabled={loading || !token}
        >
          {loading ? "..." : "Post"}
        </button>
      </div>
      {!token && (
        <p className="text-xs text-gray-500 text-center mt-2">
          Please log in to comment
        </p>
      )}
    </div>
  );
};

export default CommentsPage;
