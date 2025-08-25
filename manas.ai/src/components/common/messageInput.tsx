import { Send } from "lucide-react";
import { useState, forwardRef, useImperativeHandle, useRef } from "react";

export interface MessageInputBoxHandles {
  handleSend: () => void;
  message: string;
}

interface MessageInputBoxProps {
  placeholder?: string;
  onSend?: (message: string) => void;
}

const MessageInputBox = forwardRef<
  MessageInputBoxHandles,
  MessageInputBoxProps
>(({ placeholder = "Write Here... ", onSend }, ref) => {
  const [message, setMessage] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

    // Send message to parent
    onSend?.(trimmedMessage);

    // Clear input
    setMessage("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  useImperativeHandle(ref, () => ({
    handleSend,
    message,
  }));
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // stop new line
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    e.target.style.height = "auto";
    const maxHeight = 150;
    e.target.style.height =
      e.target.scrollHeight > maxHeight
        ? `${maxHeight}px`
        : `${e.target.scrollHeight}px`;
  };

  return (
    <div className="relative w-full  flex items-center">
      <textarea
        ref={textareaRef}
        value={message}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        rows={1}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded-xl px-4 py-2 pr-12 shadow-sm focus:outline-none resize-none overflow-y-auto"
      />
      {message.trim() && (
        <button
          onClick={handleSend}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-700 hover:text-gray-900"
        >
          <Send size={20} />
        </button>
      )}
    </div>
  );
});

export default MessageInputBox;
