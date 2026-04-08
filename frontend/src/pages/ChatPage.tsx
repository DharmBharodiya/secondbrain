import { useContext, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import { ChatWithAI } from "../services/ContentService";
import ReactMarkdown from "react-markdown";

const ChatPage = () => {
  const [question, setQuestion] = useState("");

  const [messages, setMessages] = useState<
    { role: "assistant" | "user"; content: string }[]
  >([]);

  const [loading, setLoading] = useState(false);

  const { token, theme } = useContext(AuthContext);

  const handleQuestionSubmit = async () => {
    if (question.trim() === "") return;

    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setLoading(true);
    if (token) {
      const data = await ChatWithAI(token, question);

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.answer },
      ]);
      setLoading(false);
      setQuestion("");
    }
  };

  return (
    <div
      className={`w-full h-full flex flex-col justify-between p-4 bg-white ${theme === "dark" ? "text-black" : "text-black"}`}
    >
      <div className="mb-4">
        <h1
          className={`text-lg font-semibold ${theme === "dark" ? "text-black" : "text-black"}`}
        >
          Chat with your{" "}
          <span className="font-advercase font-normal">Archive</span>
        </h1>
      </div>
      <div className="flex-1 overflow-y-auto mb-4 space-y-3 flex flex-col">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`${msg.role === "user" ? "justify-end" : "justify-start"} flex`}
          >
            <h1
              className={`${msg.role === "user" ? "bg-orange-500 text-white p-3 rounded-bl-md" : "bg-orange-300 p-3 text-black rounded-br-md"} max-w-[80%] text-sm rounded-tr-md rounded-tl-md whitespace-pre-wrap wrap-break-word`}
            >
              <ReactMarkdown
                components={{
                  ul: ({ children }) => (
                    <ul className="list-disc pl-5 space-y-1">{children}</ul>
                  ),
                  p: ({ children }) => <p className="mb-2">{children}</p>,
                }}
              >
                {msg.content}
              </ReactMarkdown>
            </h1>
          </div>
        ))}
        {loading && (
          <div className="text-sm text-gray-500">
            <h1>Thinking...</h1>
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Enter your question..."
          className="outline-none border-orange-500 border-2 px-3 py-2 rounded-md flex-1 text-sm"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleQuestionSubmit()}
        />
        <button
          className="bg-orange-500 px-4 py-2 cursor-pointer rounded-md text-white font-bold hover:bg-orange-600 transition-colors"
          onClick={handleQuestionSubmit}
        >
          Ask
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
