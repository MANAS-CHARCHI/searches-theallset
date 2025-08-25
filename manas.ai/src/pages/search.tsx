import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { Button } from "../components/ui/button";
import { addMessage, getLastUserMessages } from "../helper/indexDB";
import MessageInputBox from "../components/common/messageInput";
import { searchAsChat } from "../routers/searchRouter";
type ChatMessage = {
  role: "ai" | "user"; // notice "user" instead of "user"
  text: string;
};
const Search = () => {
  const [messages, setMessages] = useState<
    { role: "user" | "ai"; text: string }[]
  >([]);
  const [copied, setCopied] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSend = async (msg: string) => {
    if (!msg.trim()) return;
    // Add user message locally & store in IndexedDB
    setMessages((prev: ChatMessage[]) => [
      ...prev,
      { role: "user", text: msg },
    ]);
    await addMessage({ role: "user", text: msg });
    try {
      // Get last 10 messages for context
      const lastUserMessages = await getLastUserMessages(10);
      // Convert to single string for context (or array if backend supports)
      const previousContext = lastUserMessages
        .slice(0, -1)
        .map((m) => `User: ${m.text}`)
        .join("\n");
      const latestMessage = lastUserMessages.length
        ? lastUserMessages[lastUserMessages.length - 1].text
        : msg;
      const res = await searchAsChat({
        previous_context: previousContext,
        latest_message: latestMessage,
      });
      // Add AI message locally & store in IndexedDB
      setMessages((prev) => [...prev, { role: "ai", text: res.ai_response }]);
      await addMessage({ role: "ai", text: res.ai_response });
    } catch (error) {
      console.error("Error while searching:", error);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-32 justify-center"
      >
        {messages.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
            Start a conversation by typing a message below
          </div>
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
            <div className="flex items-end gap-1 max-w-[70%]">
              {/* Message bubble */}
              <div
                className={`px-2 py-2 rounded-2xl whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-gray-50 text-gray-800"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                {msg.text}
              </div>

              <Button
                onClick={() => handleCopy(msg.text)}
                size="sm"
                className="p-1 text-gray-500 bg-white hover:bg-white  hover:text-gray-700 self-end"
              >
                {copied === msg.text ? <Check /> : <Copy />}
              </Button>
            </div>
          </motion.div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Input box fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 pb-4 px-4 flex justify-center bg-gradient-to-t from-white via-white to-transparent pt-20">
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
