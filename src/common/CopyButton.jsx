import { useState } from "react";

const EVENTS_TIMEOUT = 2500;

export const CopyButton = ({
  title = "",
  bgColorClass = "",
  hoverBgColorClass = "",
  iconColorClass = "text-black",
  iconColorClickedClass = "text-green-500",
  iconSizeClass = "text-xs",
  bgSize = 6
}) => {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  const disableButton = typeof title !== "string" || title.trim() === "";

  const handleCopy = async () => {
    if (disableButton) return;

    try {
      await navigator.clipboard.writeText(title);
      setCopied(true);
      setTimeout(() => setCopied(false), EVENTS_TIMEOUT);
    } catch (err) {
      setFailed(true);
      setTimeout(() => setFailed(false), EVENTS_TIMEOUT);
    }
  }

  let iconClass = `fa-regular fa-copy ${iconColorClass}`;

  if (copied) {
    iconClass = `fa-solid fa-check ${iconColorClickedClass}`;
  }

  if (failed) {
    iconClass = `fa-solid fa-triangle-exclamation text-orange-500`;
  }

  return (
    <button
      type="button"
      disabled={disableButton}
      className={`${iconSizeClass} cursor-pointer rounded-full w-${bgSize} h-${bgSize} flex items-center justify-center ${bgColorClass} hover:${hoverBgColorClass} disabled:cursor-not-allowed disabled:opacity-50`}
      onClick={handleCopy}
      title="Click to copy"
    >
      <i className={iconClass} />
    </button>
  );
}
