import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Copy, Check } from "lucide-react";
import { Skeleton } from "../components/ui/skeleton";

interface GeneratedEmailModalProps {
  open: boolean;
  onClose: () => void;
  emailText: string;
  loading?: boolean;
}

export default function GeneratedEmailModal({
  open,
  onClose,
  emailText,
  loading = false,
}: GeneratedEmailModalProps) {
  const [copied, setCopied] = useState<string | null>(null);

  // 🪄 split subject + body
  const { subject, body } = useMemo(() => {
    const lines = emailText.split("\n");
    const subjectLine = lines.find((line) =>
      line.toLowerCase().startsWith("subject:")
    );
    const subject = subjectLine ? subjectLine.replace(/^Subject:\s*/i, "") : "";
    const body = emailText.replace(subjectLine || "", "").trim();
    return { subject, body };
  }, [emailText]);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-gray-700">Generated Email</DialogTitle>
        </DialogHeader>
        {loading ? (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-2 text-gray-700">
                Subject
              </h2>
              <Skeleton className="h-6 w-3/4 rounded-md" />
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-2 text-gray-700">Body</h2>
              <Skeleton className="h-32 w-full rounded-md" />
            </div>
          </div>
        ) : (
          <>
            {/* Subject */}
            <div className="mb-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-700">Subject</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(subject, "subject")}
                >
                  {copied === "subject" ? <Check /> : <Copy />}
                </Button>
              </div>
              <div className="bg-gray-100 p-3 rounded-md text-sm mt-2">
                {subject}
              </div>
            </div>

            {/* Body */}
            <div>
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-700">Body</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(body, "body")}
                >
                  {copied === "body" ? <Check /> : <Copy />}
                </Button>
              </div>
              <div className="bg-gray-100 p-3 rounded-md overflow-y-auto max-h-80 whitespace-pre-wrap text-sm mt-2">
                {body}
              </div>
            </div>

            {/* Close button */}
            <div className="flex justify-end gap-2 mt-6 text-gray-700">
              <Button onClick={onClose}>Close</Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
