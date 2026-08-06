import { useState } from "react";
import ProgressBar from "./ProgressBar";
import { truncateText, secondsToDelta } from "../components/context/utils";
import * as Tooltip from "@radix-ui/react-tooltip";
import { AnimatePresence, motion } from "framer-motion";
import { DotLoader } from "./Loaders";

const ExperimentEtaView = ({
  selectedEtaSection,
  onSelectedEtaSectionChange,
  sections,
  etaData,
  isEtaError,
  etaError,
  etaTotalChunks,
  etaCompletedChunks,
  isMobile = false,
}) => {
  const etaSeconds =
    etaData?.eta_seconds != null
      ? secondsToDelta(etaData.eta_seconds)
      : "--:--:--";

  const showEtaLoader = !etaData && !isEtaError;

  const getEtaErrorMessage = (etaError) => {
    const detail = etaError?.data?.error_message;

    switch (etaError?.status) {
      case 400:
        return detail
          ? `${detail}. The finish time cannot be estimated.`
          : "The finish time cannot be estimated because the request is invalid.";

      case 500:
        return "The finish time cannot be estimated due to an internal server error.";

      default:
        return `${detail ? `${detail}. ` : ""}The finish time cannot be estimated.`;
    }
  };

  const [isMinimized, setIsMinimized] = useState(false);

  const positionClass = isMobile
    ? ""
    : "absolute right-4 top-4 z-10 backdrop-blur-md";

  const containerClass = isMobile
    ? "w-full rounded-lg border p-4"
    : "w-full rounded-lg border p-4 bg-white/50 shadow-lg backdrop-blur-md";

  return (
    <AnimatePresence mode="wait">
      {isMinimized ? (
        <motion.div
          key="eta-minimized"
          layout
          layoutId="eta-shell"
          initial={{ opacity: 0.9, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0.9, scale: 0.98 }}
          transition={{ duration: 0.14, ease: [0.14, 1, 0.36, 1] }}
          className={positionClass}
        >
          <button
            title="Show ETA panel"
            type="button"
            className="flex items-center gap-2 rounded-lg border bg-white/50 px-4 py-2 shadow-lg backdrop-blur-md"
            onClick={() => setIsMinimized(false)}
          >
            <i className="fa-solid fa-clock-rotate-left"></i>
            <span>{etaSeconds}</span>
            <i className="fa-solid fa-up-right-and-down-left-from-center ml-2"></i>
          </button>
        </motion.div>
      ) : (
        <motion.div
          key="eta-expanded"
          layout
          layoutId="eta-shell"
          initial={{ opacity: 0.95, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0.95, scale: 0.98 }}
          transition={{ duration: 0.14, ease: [0.14, 1, 0.36, 1] }}
          className={positionClass}
        >
          <div className={containerClass}>
            <div className="mb-3 flex justify-between gap-3">
              <div className="font-semibold">
                <i className="fa-solid fa-clock-rotate-left"></i>
                <span className="ml-2">Estimated finish time</span>
              </div>
              {!isMobile && (
                <button
                  title="Minimize ETA panel"
                  type="button"
                  className="rounded-md px-2 py-1 text-sm hover:bg-neutral-100"
                  onClick={() => setIsMinimized(true)}
                >
                  <i className="fa-solid fa-compress"></i>
                </button>
              )}
            </div>

            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <label>
                    Estimated finish time for section:{" "}
                    <Tooltip.Provider>
                      <Tooltip.Root delayDuration={300}>
                        <Tooltip.Trigger asChild>
                          <i className="fa-solid fa-circle-question"></i>
                        </Tooltip.Trigger>
                        <Tooltip.Portal>
                          <Tooltip.Content
                            side="bottom"
                            className="text-xs bg-black/85 text-white px-2 py-1 rounded max-w-[16rem] text-center z-10"
                          >
                            The Estimated Time of Arrival (ETA) is calculated based on the average time taken to
                            complete previous tasks in the selected section. Only sections running within chunks can
                            be selected.
                            <Tooltip.Arrow />
                          </Tooltip.Content>
                        </Tooltip.Portal>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                  </label>

                  <select
                    className="form-select border dark:bg-neutral-100 dark:text-black max-w-[15rem]"
                    value={selectedEtaSection}
                    onChange={(e) => onSelectedEtaSectionChange(e.target.value)}
                  >
                    {sections.map((section) => (
                      <option key={section} value={section}>
                        {truncateText(section, 15)}
                      </option>
                    ))}
                  </select>
                </div>

                {showEtaLoader ? (
                  <DotLoader className="mt-4 mb-2" />
                ) : isEtaError ? (
                  <p className="pt-3 max-w-[40rem] text-sm text-red-700 ">
                    <i className="fa-solid fa-triangle-exclamation me-1"></i>{" "}
                    {getEtaErrorMessage(etaError)}
                  </p>
                ) : (
                  <div
                    className="font-bold"
                    title="Estimated finish time in format 'dd - hh:mm:ss'"
                  >
                    {etaSeconds}
                  </div>
                )}
              </div>

              {!showEtaLoader && !isEtaError && (
                <div className="text-end">
                  <div className="text-sm">
                    Completed chunks: {etaCompletedChunks ?? "N/A"} / {etaTotalChunks ?? "N/A"}
                  </div>
                  <div
                    className="text-sm"
                    title="Average time per chunk in format 'dd - hh:mm:ss'"
                  >
                    Avg. time per chunk:{" "}
                    {etaData?.avg_runtime_per_chunk_seconds != null
                      ? secondsToDelta(etaData.avg_runtime_per_chunk_seconds)
                      : "--:--:--"}
                  </div>
                </div>
              )}
            </div>

            {!showEtaLoader && !isEtaError && (
              <div className="mt-2 mb-2">
                <ProgressBar
                  value={etaCompletedChunks ?? 0}
                  max={etaTotalChunks ?? 1}
                  indicatorClass="bg-primary"
                  containerClass="h-[14px]"
                  animated={
                    etaCompletedChunks !== null &&
                    etaTotalChunks !== null &&
                    etaCompletedChunks < etaTotalChunks
                  }
                />
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ExperimentEtaView;
