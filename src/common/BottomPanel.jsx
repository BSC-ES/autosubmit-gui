import { cn } from "../services/utils";
import { useDefault, useLocalStorage } from "@uidotdev/usehooks";
import CopyButton from "./CopyButton";

const BottomPanel = ({ children, title, onClose, allowTitleCopy = false }) => {
  const [defaultExpanded, saveDefaultExpanded] = useLocalStorage(
    "asgui.layout.experiment.bpanel.expanded",
    true
  );
  const [expand, setExpand] = useDefault(defaultExpanded);

  const toggleExpand = () => {
    setExpand(!expand);
    saveDefaultExpanded(!expand);
  };

  const handleClose = () => {
    if (onClose) onClose();
  };

  return (
    <div className="z-20 drop-shadow-lg fixed bottom-0 right-0 w-screen md:right-[2vw] md:w-[30rem]">
      <div
        id="bottom-panel-header"
        className="flex gap-3 px-6 py-3 bg-neutral-700 text-white items-center"
        onDoubleClick={toggleExpand}
      >
        <div className="me-auto flex items-center gap-2 min-w-0">
          <span className="text-lg truncate font-bold min-w-0 flex-1">{title}</span>
          {allowTitleCopy &&
            <CopyButton
              text={title}
              bgColorClass="bg-neutral-600 hover:bg-neutral-800"
              iconColorClass="text-white"
            />
          }
        </div>
        <div
          className="cursor-pointer rounded-full w-8 h-8 flex items-center justify-center hover:bg-neutral-600"
          onClick={toggleExpand}
          title="Collapse toggle"
        >
          <i className={cn("fa-solid", expand ? "fa-angle-down" : "fa-angle-up")} />
        </div>
        {onClose && (
          <div
            className="cursor-pointer rounded-full w-8 h-8 flex items-center justify-center hover:bg-neutral-800"
            onClick={handleClose}
            title="Close panel"
          >
            <i className="fa-solid fa-xmark" />
          </div>
        )}
      </div>

      {expand && (
        <div
          id="bottom-panel-content"
          className="px-6 py-4 max-h-[55vh] overflow-auto bg-white text-black custom-scrollbar"
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default BottomPanel;
