import { useEffect, useRef, useState, useMemo } from "react";
import { useCopyToClipboard } from "@uidotdev/usehooks";

const EVENTS_TIMEOUT = 2500;

/**
 * A button that copies text to the clipboard and provides temporary
 * visual feedback.
 *
 * The button displays one of two states:
 *
 * - `idle`: The text can be copied.
 * - `copied`: Copy button has been clicked and the text is being copied.
 *
 * The feedback state is automatically reset after `EVENTS_TIMEOUT`
 * milliseconds. The state is also reset whenever the `text` prop changes.
 * The library used, kept for compatibility, limits the implementation of a
 * failed state, so the button will always display a success state when clicked.
 *
 * @param {Object} props
 * @param {string} [props.text=""] - Text to copy to the clipboard.
 *   The button is disabled when the value is empty or contains only
 *   whitespace.
 * @param {string} [props.copyText=""] - Text displayed next to the copy
 *   icon. If empty, only the icon is displayed.
 * @param {string} [props.bgColorClass=""] - CSS class for the button
 *   background color.
 * @param {string} [props.iconColorClass="text-black"] - CSS class for
 *   the copy icon.
 * @param {string} [props.iconColorClickedClass="text-success"] - CSS
 *   class for the icon displayed after a successful copy.
 * @param {string} [props.iconSizeClass="text-xs"] - CSS class controlling
 *   the icon size.
 * @param {string} [props.roundedClass="rounded-full"] - CSS class for
 *   the button border radius.
 * @param {string} [props.borderClass=""] - CSS class for the button border.
 * @param {number} [props.bgSize=6] - Size used to construct the button's
 *   width and height utility classes.
 *
 * @returns {JSX.Element} A button that copies the provided text.
 */
const CopyButton = ({
  text = "",
  copyText = "",
  bgColorClass = "",
  iconColorClass = "text-black",
  iconColorClickedClass = "text-success",
  iconSizeClass = "text-xs",
  roundedClass = "rounded-full",
  borderClass = "",
  bgSize = 6,
}) => {
  const [status, setStatus] = useState("idle");
  const timeoutRef = useRef(null);
  const [, copyToClipboard] = useCopyToClipboard();

  const disableButton =
    typeof text !== "string" || text.trim() === "";

  /**
   * Reset the feedback state when the text changes and clean up any
   * pending timeout when the component is unmounted or the text changes.
   */
  useEffect(() => {
    setStatus("idle");

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [text]);

  /**
   * Copy the current text to the clipboard and display the corresponding
   * feedback state.
   */
  const handleCopy = async () => {
    if (disableButton) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    copyToClipboard(text);
    setStatus("copied");

    timeoutRef.current = setTimeout(() => {
      setStatus("idle");
      timeoutRef.current = null;
    }, EVENTS_TIMEOUT);
  };

  const statusConfiguration = useMemo(
    () => ({
      idle: {
        icon: `fa-regular fa-copy ${iconColorClass}`,
        label: "Copy to clipboard",
      },
      copied: {
        icon: `fa-solid fa-check ${iconColorClickedClass}`,
        label: "Copied!",
      },
    }),
    [iconColorClass, iconColorClickedClass]
  );

  const { icon, label } = statusConfiguration[status];

  const widthClass = () => {
    if (!copyText) {
      return `w-${bgSize}`;
    }
    return "px-2";
  }

  return (
    <button
      type="button"
      disabled={disableButton}
      className={`${iconSizeClass} cursor-pointer ${roundedClass} ${widthClass()} h-${bgSize} flex items-center justify-center ${bgColorClass} disabled:cursor-not-allowed disabled:opacity-50 ${borderClass}`}
      onClick={handleCopy}
      title={label}
      aria-label={label}
    >
      <div className={`flex items-center gap-2`}>
        <i className={icon} />
        {copyText && <span className={`${iconColorClass}`}>{copyText}</span>}
      </div>
    </button>
  );
};

export default CopyButton;
