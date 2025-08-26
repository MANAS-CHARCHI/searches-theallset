import { useState } from "react";
import { Clipboard, Check } from "lucide-react";

const CodeBlock = ({ code, language }: { code: string; language?: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative bg-gray-50 rounded-lg p-4 my-4 overflow-x-auto font-mono text-sm text-gray-900 border border-gray-200 shadow-sm">
      {/* Language badge */}
      {language && (
        <div className="absolute top-2 left-2 bg-gray-200 text-gray-700 text-xs font-semibold px-2 py-0.5 rounded z-10">
          {language}
        </div>
      )}

      {/* Copy icon */}
      <div
        onClick={handleCopy}
        className="absolute top-2 right-2 flex items-center space-x-1 cursor-pointer text-gray-500 hover:text-gray-700 transition z-10"
      >
        {copied ? <Check className="w-4 h-4 text-gray-500" /> : <Clipboard className="w-4 h-4" />}
        <span className="text-xs select-none">{copied ? "Copied" : "Copy"}</span>
      </div>

      {/* Code content with padding top if language badge exists */}
      <pre className={`whitespace-pre-wrap ${language ? "pt-6" : ""}`}>{code}</pre>
    </div>
  );
};

export default CodeBlock;
