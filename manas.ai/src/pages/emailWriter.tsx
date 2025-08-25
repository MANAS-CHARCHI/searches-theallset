import { useRef, useState } from "react";
import MessageInputBox from "../components/common/messageInput";
import type { MessageInputBoxHandles } from "../components/common/messageInput";
import { generateEmail } from "../routers/writeEmailRouter";
import GeneratedEmailModal from "../components/generateEmailModal";
import { Mail } from "lucide-react";
import { Input } from "../components/ui/input";
import { motion } from "framer-motion";

const EmailWriter = () => {
  const messageRef = useRef<MessageInputBoxHandles>(null);
  const senderRef = useRef<HTMLInputElement>(null);
  const receiverRef = useRef<HTMLInputElement>(null);
  const [sender, setSender] = useState("");
  const [receiver, setReceiver] = useState("");
  const [generatedEmail, setGeneratedEmail] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (msg: string) => {
    const payload = { sender, receiver, context: msg };
    setModalOpen(true);
    setLoading(true);
    try {
      const response = await generateEmail(payload);
      setSender("");
      setReceiver("");
      if (senderRef.current) senderRef.current.value = "";
      if (receiverRef.current) receiverRef.current.value = "";

      setGeneratedEmail(response?.generated_email);
    } catch (err) {
      console.error("Failed to generate email:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" bg-gradient-to-br flex flex-col">
      {/* Header */}
      <div className="container mx-auto px-4 py-10 max-w-3xl flex-1">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center w-15 h-15 bg-white  rounded-2xl shadow-sm mb-4">
            <Mail className="w-10 h-10 text-gray-600" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-gray-700 tracking-tight">
            Quick Email Generator
          </h1>
          <p className="text-muted-foreground text-lg">
            Generate professional emails in seconds
          </p>
        </motion.div>

        {/* Sender/Receiver Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/70 rounded-2xl shadow-sm border border-white/20 backdrop-blur-md p-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <Input
              ref={senderRef}
              placeholder="Your name"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              className="h-12 text-base"
            />
            <Input
              ref={receiverRef}
              placeholder="Recipient's name"
              value={receiver}
              onChange={(e) => setReceiver(e.target.value)}
              className="h-12 text-base"
            />
          </div>
          <p className="text-sm text-gray-400 italic">
            Tip: Enter your name and recipient's name for better results.{" "}
          </p>
        </motion.div>
      </div>

      {/* Floating Input Bar */}
      <div className="sticky bottom-6 left-0 w-full px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white  backdrop-blur-lg  rounded-2xl p-4 max-w-2xl mx-auto"
        >
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-semibold text-gray-700 mb-1">
              Hi, I'm <span className="text-blue-600">Searches</span>
              <span className="text-xs pl-1 text-gray-400"> by theallset</span>
            </h2>
            <p className="text-xs text-gray-500 pb-3 text-center">
              Enter the purpose of your email below and I’ll generate it for
              you.
            </p>

            <MessageInputBox ref={messageRef} onSend={handleSendMessage} />
          </div>
        </motion.div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <GeneratedEmailModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          emailText={generatedEmail || ""}
          loading={loading}
        />
      )}
    </div>
  );
};

export default EmailWriter;
