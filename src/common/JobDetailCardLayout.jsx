import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { secondsToDelta } from "../components/context/utils";
import { cn, parseLogPath } from "../services/utils";
import JobHistoryModal from "./JobHistoryModal";
import LogModal from "./LogModal";
import Modal from "./Modal";

/**
 * Presentational component for job detail cards.
 * Shared layout used by both JobDetailCard and FetchJobDetailCard.
 *
 * @param {Object} props
 * @param {string} props.expid - Experiment ID
 * @param {string} props.jobName - Job name for history modal
 * @param {string} props.startDate - Formatted start date
 * @param {string} props.endDate - Formatted end date
 * @param {string} [props.section] - Job section
 * @param {string} [props.member] - Job member
 * @param {string} [props.chunk] - Job chunk
 * @param {string} [props.split] - Job split
 * @param {string} [props.splits] - Job total splits
 * @param {string} [props.workflowCommit] - Workflow commit hash
 * @param {string} [props.platform] - Platform name
 * @param {string} [props.qos] - QoS value
 * @param {string} [props.remoteId] - Remote ID
 * @param {string} [props.processors] - Number of processors
 * @param {string} [props.wallclock] - Wallclock value
 * @param {number|null} [props.queueTime] - Queue time in seconds
 * @param {string} [props.queueLabel] - Label for queue time ("Queue" or "Submit")
 * @param {string} [props.queueBgColor] - Background color for queue badge
 * @param {React.ReactNode} [props.queueTimeExtra] - Extra content after queue time (e.g. tooltip)
 * @param {number|null} [props.runTime] - Run time in seconds
 * @param {string} props.status - Job status string
 * @param {string} [props.statusClassName] - CSS class for status badge
 * @param {Object} [props.statusStyle] - Inline style for status badge
 * @param {Array<{name: string, status: string, statusClassName?: string, statusStyle?: Object}>} [props.children] - Children dependencies
 * @param {Array<{name: string, status: string, statusClassName?: string, statusStyle?: Object}>} [props.parents] - Parent dependencies
 * @param {string} [props.outPath] - Output log path
 * @param {string} [props.errPath] - Error log path
 * @param {string} [props.submitTime] - Submit timestamp
 * @param {string} [props.startTime] - Start timestamp
 * @param {string} [props.finishTime] - Finish timestamp
 * @param {string} [props.SYPD] - SYPD value
 * @param {string} [props.ASYPD] - ASYPD value
 * @param {string} [props.wrapper] - Wrapper name
 */
const JobDetailCardLayout = ({
  expid,
  jobName,
  startDate,
  endDate,
  section,
  member,
  chunk,
  split,
  splits,
  workflowCommit,
  platform,
  qos,
  remoteId,
  processors,
  wallclock,
  queueTime,
  queueLabel = "Queue",
  queueBgColor = "pink",
  queueTimeExtra,
  runTime,
  status,
  statusClassName,
  statusStyle,
  children = [],
  parents = [],
  outPath,
  errPath,
  submitTime,
  startTime,
  finishTime,
  SYPD,
  ASYPD,
  wrapper,
}) => {
  const copyToClipboard = useCopyToClipboard()[1];

  const [showModal, setShowModal] = useState({
    children: false,
    parents: false,
    outlog: false,
    errlog: false,
    history: false,
  });
  const toggleModal = (modal) => {
    setShowModal({
      ...showModal,
      [modal]: !showModal[modal],
    });
  };

  return (
    <>
      <div className="flex flex-col gap-1">
        <div className="flex gap-3 justify-evenly">
          <span className="grow">
            <strong>Start:</strong> {startDate || "-"}
          </span>
          <span className="grow">
            <strong>End:</strong> {endDate || "-"}
          </span>
        </div>
        <div className="flex gap-4 justify-evenly">
          <span className="grow">
            <strong>Section:</strong> {section || "-"}
          </span>
          <span className="grow">
            <strong>Member:</strong> {member || "-"}
          </span>
        </div>
        <div className="flex gap-4 justify-evenly">
          <span className="grow">
            <strong>Chunk:</strong> {chunk || "-"}
          </span>
          <span className="grow">
            <strong>Split:</strong> {split || "-"} / {splits || "-"}
          </span>
        </div>
        {workflowCommit && (
          <div className="flex gap-4 justify-evenly">
            <span className="grow">
              <strong>Workflow Commit:</strong> {workflowCommit || "-"}
            </span>
          </div>
        )}
        <div className="flex gap-4 justify-evenly">
          <span className="grow">
            <strong>Platform:</strong> {platform || "-"}
          </span>
          {qos && (
            <span className="grow">
              <strong>QoS:</strong> {qos || "-"}
            </span>
          )}
          {typeof remoteId !== "undefined" && (
            <span className="grow">
              <strong>Remote ID:</strong> {remoteId || "-"}
            </span>
          )}
        </div>
        <div className="flex gap-4 justify-evenly">
          <span className="grow">
            <strong>Processors:</strong> {processors || "-"}
          </span>
          <span className="grow">
            <strong>Wallclock:</strong> {wallclock || "-"}
          </span>
        </div>
        <div className="flex gap-x-4 gap-y-1 flex-wrap">
          {queueTime != null && (
            <div>
              <span
                className="rounded-full text-center px-4 w-full text-black"
                style={{ backgroundColor: queueBgColor }}
              >
                <strong>
                  {queueLabel}: {secondsToDelta(queueTime)} {queueTimeExtra}
                </strong>
              </span>
            </div>
          )}
          {runTime != null && (
            <div>
              <span className="rounded-full text-center px-4 w-full bg-success text-white">
                <strong>Run: {secondsToDelta(runTime)}</strong>
              </span>
            </div>
          )}
          <div>
            <span
              className={cn(
                "rounded-full text-center px-4 w-full",
                statusClassName,
              )}
              style={statusStyle}
            >
              <strong>Status: {status}</strong>
            </span>
          </div>
        </div>

        <div className="flex gap-2 items-center flex-wrap">
          <strong>Dependencies: </strong>
          <button
            className="btn btn-dark text-sm px-4 rounded-lg"
            onClick={() => toggleModal("children")}
            disabled={children.length <= 0}
          >
            <strong>CHILDREN:</strong> {children.length || "0"}
          </button>
          <button
            className="btn btn-dark text-sm px-4 rounded-lg"
            onClick={() => toggleModal("parents")}
            disabled={parents.length <= 0}
          >
            <strong>PARENTS:</strong> {parents.length || "0"}
          </button>
        </div>

        <div className="flex flex-col gap-1 my-1">
          <div className="flex items-center h-8">
            <span className="h-full rounded-s bg-light px-2 text-sm flex items-center border font-mono">
              OUT
            </span>
            <input
              className="grow truncate form-input py-0 h-full rounded-none border"
              type="text"
              value={outPath || "Not Available"}
              id={`g_out_t_${jobName}`}
              readOnly
              disabled
            />
            <button
              className="btn btn-light text-sm h-full rounded-none border"
              disabled={!outPath}
              onClick={() => copyToClipboard(outPath || "")}
            >
              COPY
            </button>
            <button
              className="btn btn-dark text-sm h-full rounded-s-none border"
              disabled={!outPath}
              onClick={() => toggleModal("outlog")}
            >
              <i className="fa-solid fa-terminal"></i>
            </button>
          </div>

          <div className="flex items-center h-8">
            <span className="h-full rounded-s bg-light px-2 text-sm flex items-center border font-mono">
              ERR
            </span>
            <input
              className="grow truncate form-input py-0 h-full rounded-none border"
              type="text"
              value={errPath || "Not Available"}
              id={`g_err_t_${jobName}`}
              readOnly
              disabled
            />
            <button
              className="btn btn-light text-sm h-full rounded-none border"
              disabled={!errPath}
              onClick={() => copyToClipboard(errPath || "")}
            >
              COPY
            </button>
            <button
              className="btn btn-dark text-sm h-full rounded-s-none border"
              disabled={!errPath}
              onClick={() => toggleModal("errlog")}
            >
              <i className="fa-solid fa-terminal"></i>
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          {submitTime && (
            <div className="flex items-center">
              <strong className="me-2">Submit: </strong>
              <span className="badge bg-light">{submitTime}</span>
            </div>
          )}
          {startTime && (
            <div className="flex items-center">
              <strong className="me-2">Start: </strong>
              <span className="badge bg-light">{startTime}</span>
            </div>
          )}
          {finishTime && (
            <div className="flex items-center">
              <strong className="me-2">Finish: </strong>
              <span className="badge bg-light">{finishTime}</span>
            </div>
          )}
        </div>

        <div className="flex gap-x-4 gap-y-1 flex-wrap">
          {SYPD && (
            <div>
              <span
                className="bg-primary text-white rounded-full px-4"
                title="Generalization of Simulated Years per Day."
              >
                <strong>SYPD: </strong>
                {SYPD}
              </span>
            </div>
          )}
          {ASYPD && (
            <div>
              <span
                className="bg-primary text-white rounded-full px-4"
                title="Generalization of Actual SYPD."
              >
                <strong>ASYPD: </strong>
                {ASYPD}
              </span>
            </div>
          )}
        </div>

        {wrapper && (
          <div className="flex flex-wrap gap-4">
            <span className="flex flex-wrap gap-x-2 items-center">
              <strong>Wrapper:</strong>{" "}
              <span className="badge bg-light">{wrapper}</span>
            </span>
          </div>
        )}

        <button
          className="btn btn-primary text-sm font-semibold"
          onClick={() => toggleModal("history")}
        >
          <i className="fa-solid fa-clock-rotate-left me-1"></i> Job History
        </button>
      </div>

      <Modal show={showModal.children} onClose={() => toggleModal("children")}>
        <Dialog.Title
          className={
            "bg-dark text-white py-4 px-8 text-2xl font-semibold rounded-t-lg flex justify-between items-center"
          }
        >
          <div>Children List</div>
          <div
            className="cursor-pointer"
            onClick={() => toggleModal("children")}
          >
            <i className="fa-solid fa-xmark"></i>
          </div>
        </Dialog.Title>
        <div className="bg-white text-black py-6 px-6 rounded-b-lg">
          <ul className="list-disc ms-8">
            {children.map((item, index) => (
              <li key={index}>
                {item.name}{" "}
                <span
                  className={cn("badge", item.statusClassName)}
                  style={item.statusStyle}
                >
                  {item.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Modal>

      <Modal show={showModal.parents} onClose={() => toggleModal("parents")}>
        <Dialog.Title
          className={
            "bg-dark text-white py-4 px-8 text-2xl font-semibold rounded-t-lg flex justify-between items-center"
          }
        >
          <div>Parents List</div>
          <div
            className="cursor-pointer"
            onClick={() => toggleModal("parents")}
          >
            <i className="fa-solid fa-xmark"></i>
          </div>
        </Dialog.Title>
        <div className="bg-white text-black py-6 px-6 rounded-b-lg">
          <ul className="list-disc ms-8">
            {parents.map((item, index) => (
              <li key={index}>
                {item.name}{" "}
                <span
                  className={cn("badge", item.statusClassName)}
                  style={item.statusStyle}
                >
                  {item.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Modal>

      <LogModal
        logFile={parseLogPath(outPath)}
        show={showModal.outlog}
        onHide={() => toggleModal("outlog")}
      />

      <LogModal
        logFile={parseLogPath(errPath)}
        show={showModal.errlog}
        onHide={() => toggleModal("errlog")}
      />

      <JobHistoryModal
        expid={expid}
        jobName={jobName}
        show={showModal.history}
        onHide={() => toggleModal("history")}
      />
    </>
  );
};

export default JobDetailCardLayout;
