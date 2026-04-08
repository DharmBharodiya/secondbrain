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

  const { token } = useContext(AuthContext);

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
    <div className="w-full flex flex-col justify-center items-center">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">
          Chat with your{" "}
          <span className="font-advercase font-normal">Archive</span>
        </h1>
      </div>
      <div>
        <input
          type="text"
          placeholder="Enter your question..."
          className="outline-none border-orange-500 border-2 px-3 py-1 rounded-md"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button
          className="bg-orange-500 px-3 py-1 cursor-pointer rounded-md text-white font-bold ml-2"
          onClick={handleQuestionSubmit}
        >
          Ask
        </button>
      </div>
      <div className="w-[30%] mt-8 flex flex-col h-full overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`${msg.role === "user" ? "justify-end" : "justify-start"} flex`}
          >
            <h1
              className={`${msg.role === "user" ? "bg-orange-500 text-white p-3 rounded-bl-md" : "bg-orange-300 p-4 text-black rounded-br-md"} max-w-[80%] text-sm rounded-tr-md rounded-tl-md whitespace-pre-wrap`}
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
          <div>
            <h1>loading...</h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
