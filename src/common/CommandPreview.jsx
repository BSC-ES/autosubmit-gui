import { useCopyToClipboard } from "@uidotdev/usehooks";
import { useState } from "react";
import { cn } from "../services/utils";

const CommandPreview = ({ command, className }) => {
  const copyToClipboard = useCopyToClipboard()[1];
  const [copied, setCopied] = useState("Copy to clipboard");

  const handleCopy = () => {
    copyToClipboard(command);
    setCopied("Copied!");
    setTimeout(() => {
      setCopied("Copy to clipboard");
    }, 2000);
  };

  return (
    <div
      className={cn(
        "bg-black text-white px-2 font-mono relative py-4 pt-8",
        className,
      )}
    >
      <button
        className="absolute top-2 text-sm right-2 opacity-50 text-black bg-white px-2 rounded"
        onClick={handleCopy}
      >
        <i className="fa-regular fa-copy"></i> {copied}
      </button>
      {command}
    </div>
  );
};

export default CommandPreview;
