import { CopyButton } from "./CopyButton";
import { useMemo } from "react";
import { cn } from "../services/utils";

const CommandPreview = ({ command, className }) => {
  const formattedCommand = useMemo(() => {
    if (typeof command !== "string") return "";
    return command.split("\n").map((line, index) => <p key={index}>{line}</p>);
  }, [command]);

  return (
    <div
      className={cn(
        "bg-black text-white px-2 font-mono relative py-4 pt-8",
        className,
      )}
    >
      <div className="absolute top-2 right-2">
        <CopyButton
          text={formattedCommand}
          copyText="Copy command"
          iconColorClickedClass="text-green-900"
          bgColorClass="bg-white/70 hover:bg-white/60"
          roundedClass="rounded-md"
        />
      </div>

      <div className="mt-1">
        {formattedCommand}
      </div>
    </div>
  );
};

export default CommandPreview;
