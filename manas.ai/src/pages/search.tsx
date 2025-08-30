import { useState, useRef, useEffect, type JSX } from "react";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { Button } from "../components/ui/button";
import { addMessage, getLastUserMessages } from "../helper/indexDB";
import MessageInputBox from "../components/common/messageInput";
import { searchAsChat } from "../routers/searchRouter";
import CodeBlock from "../components/codeBlock";
import { v4 as uuidv4 } from "uuid";
const myUUID = uuidv4();

type ChatMessage = {
  id: string;
  role: "user" | "ai";
  text: string;
};
const Search = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  // const [loading, setLoading] = useState(false);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSend = async (msg: string) => {
    if (!msg.trim()) return;

    // const userId = crypto.randomUUID();
    setMessages((prev) => [...prev, { id: myUUID, role: "user", text: msg }]);
    await addMessage({ role: "user", text: msg });

    try {
      const lastUserMessages = await getLastUserMessages(5);
      const previousContext = lastUserMessages
        .slice(0, -1)
        .map((m) => `User: ${m.text}`)
        .join("\n");

      const latestMessage = lastUserMessages.length
        ? lastUserMessages[lastUserMessages.length - 1].text
        : msg;

      const loadingId = crypto.randomUUID();
      setMessages((prev) => [
        ...prev,
        { id: loadingId, role: "ai", text: "__loading__" },
      ]);

      const res = await searchAsChat({
        previous_context: previousContext,
        latest_message: latestMessage,
      });

      // update the right loading bubble
      setMessages((prev) =>
        prev.map((m) =>
          m.id === loadingId ? { ...m, text: res.ai_response } : m
        )
      );

      await addMessage({ role: "ai", text: res.ai_response });
    } catch (error) {
      console.error("Error while searching:", error);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatText = (text: string) => {
    const codeRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts: (string | JSX.Element)[] = [];
    let lastIndex = 0;

    let match;
    while ((match = codeRegex.exec(text)) !== null) {
      const [fullMatch, lang, code] = match;

      // Push text before code block
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }

      // Push code block using CodeBlock component
      parts.push(
        <CodeBlock key={lastIndex} language={lang || "text"} code={code} />
      );

      lastIndex = match.index + fullMatch.length;
    }

    // Push remaining text after last code block
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    // Apply **bold** and *semibold* to non-code text
    return parts.map((part, idx) => {
      if (typeof part === "string") {
        const innerParts = part.split(/(\*\*.*?\*\*|\*[^*\s][^*]*[^*\s]\*)/g);
        return innerParts.map((p, i) => {
          if (p.startsWith("**") && p.endsWith("**")) {
            return (
              <span key={`${idx}-${i}`} className="font-semibold text-gray-700">
                {p.slice(2, -2)}
              </span>
            );
          } else if (p.startsWith("*") && p.endsWith("*")) {
            return (
              <span key={`${idx}-${i}`} className="font-medium text-gray-600">
                {p.slice(1, -1)}
              </span>
            );
          } else {
            return p;
          }
        });
      } else {
        return part;
      }
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-32 justify-center"
      >
        {messages.length === 0 && (
          <>
            <div className="flex justify-center  mt-2">
              <img src="/theallset.png" className="w-6" />
            </div>
            <div className="text-center text-gray-500 dark:text-gray-400">
              Start a conversation by typing a message below
            </div>
          </>
        )}

        {messages.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex py-2 ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div className="flex items-end gap-1 max-w-[90%] sm:max-w-[70%]">
              {/* Message bubble */}
              <div
                className={`px-2 py-2 rounded-2xl whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-gray-50 text-gray-800"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                {msg.text === "__loading__" ? (
                  <div className="flex items-center gap-2 text-gray-500">
                    <span>Thinking</span>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" />
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-150" />
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-300" />
                    </div>
                  </div>
                ) : (
                  formatText(msg.text)
                )}
              </div>

              <Button
                onClick={() => handleCopy(msg.text, idx)}
                size="sm"
                className="p-1 text-gray-500 bg-white hover:bg-white  hover:text-gray-700 self-end"
              >
                {copiedIndex === idx ? <Check /> : <Copy />}
              </Button>
            </div>
          </motion.div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Input box fixed at bottom */}
      <div className="fixed bottom-0 left-0 lg:ml-60 sm:p-6 right-0 pb-4 px-4 flex justify-center bg-gradient-to-t from-white via-white to-transparent pt-20">
        <div className="w-full max-w-3xl">
          <MessageInputBox
            onSend={handleSend}
            placeholder="Type your message..."
          />
        </div>
      </div>
    </div>
  );
};

export default Search;
