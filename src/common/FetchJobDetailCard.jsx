import { useMemo, useState } from "react";
import { autosubmitApiV4 } from "../services/autosubmitApiV4";
import { cn } from "../services/utils";
import { Dialog } from "@headlessui/react";
import Modal from "./Modal";
import { statusCodeToStyle } from "../components/context/vars";
import JobHistoryModal from "./JobHistoryModal";
import { parseLogPath } from "../services/utils";
import LogModal from "./LogModal";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { secondsToDelta } from "../components/context/utils";


const calculateChunkDates = (date, currentChunk, chunkUnit, chunkSize = 1) => {
  if (!date || !chunkUnit || !chunkSize) return ["-", "-"];

  const year = parseInt(date.substring(0, 4));
  const month = parseInt(date.substring(4, 6)) - 1; // Months are 0-indexed
  const day = parseInt(date.substring(6, 8));
  let startDate = new Date(year, month, day);
  let endDate = new Date(year, month, day);

  if (currentChunk && chunkUnit) {
    let chunkPrev = (currentChunk - 1) * chunkSize;
    let chunkNext = currentChunk * chunkSize;
    if (chunkUnit === "year") {
      endDate.setFullYear(endDate.getFullYear() + chunkNext);
      startDate.setFullYear(startDate.getFullYear() + chunkPrev);
    } else if (chunkUnit === "month") {
      endDate.setMonth(endDate.getMonth() + chunkNext);
      startDate.setMonth(startDate.getMonth() + chunkPrev);
    } else if (chunkUnit === "day") {
      endDate.setDate(endDate.getDate() + chunkNext);
      startDate.setDate(startDate.getDate() + chunkPrev);
    } else if (chunkUnit === "hour") {
      endDate.setHours(endDate.getHours() + Math.floor(chunkNext / 24));
      startDate.setHours(startDate.getHours() + Math.floor(chunkPrev / 24));
    }
  }

  const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y} ${m} ${d}`;
  };

  return [formatDate(startDate), formatDate(endDate)];
};

const calcRunTime = (start, end) => {
  if (!start || !end) return "-";
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffMs = endDate - startDate;
  return diffMs / 1000; // return in seconds
};

const calcYPS = (chunkUnit, chunkSize) => {
  chunkSize = chunkSize * 1.0;
  if (chunkUnit === "year") {
    return chunkSize;
  } else if (chunkUnit === "month") {
    return chunkSize / 12;
  } else if (chunkUnit === "day") {
    return chunkSize / 365;
  } else if (chunkUnit === "hour") {
    return chunkSize / (365 * 24);
  }
  return 0.0;
};

/**
 * @param {Object} props - Component props
 * @param {string} props.expid - Experiment ID
 * @param {string} props.jobName - Job name to display in the card header
 * @returns {JSX.Element}
 */
const FetchJobDetailCard = ({ expid, jobName }) => {
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

  const {
    data: jobData,
    isFetching: isJobDataFetching,
    isError: isJobDataError,
    isUninitialized: isJobDataUninitialized,
  } = autosubmitApiV4.endpoints.getJobDetails.useQuery({
    expid: expid,
    job_name: jobName,
  });

  const [start_date, end_date] = useMemo(() => {
    if (!jobData) return ["-", "-"];
    return calculateChunkDates(
      jobData.date,
      jobData.chunk,
      jobData.chunk_unit,
      jobData.chunk_size,
    );
  }, [jobData]);

  const runTime = useMemo(() => {
    if (
      jobData &&
      jobData.start &&
      jobData.finish &&
      ["RUNNING", "COMPLETED", "FAILED"].includes(jobData.status)
    ) {
      return calcRunTime(jobData.start, jobData.finish);
    }
    return null;
  }, [jobData]);

  const SYPD = useMemo(() => {
    if (runTime && jobData.status === "COMPLETED" && jobData.chunk) {
      const yps = calcYPS(jobData.chunk_unit, jobData.chunk_size);
      if (runTime > 0 && yps > 0) {
        return (yps * 86400) / runTime;
      }
    }
    return null;
  }, [runTime]);

  if (isJobDataFetching || isJobDataUninitialized) {
    return (
      <div className="flex items-center justify-center bg-white">
        <div className="spinner-border dark:invert" role="status"></div>
      </div>
    );
  }

  if (isJobDataError || !jobData) {
    return (
      <div className="text-red-600 text-sm">
        Error fetching job details. Please try again.
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-1">
        <div className="flex gap-3 justify-evenly">
          <span className="grow">
            <strong>Start:</strong> {start_date}
          </span>
          <span className="grow">
            <strong>End:</strong> {end_date}
          </span>
        </div>
        <div className="flex gap-4">
          <span>
            <strong>Section:</strong> {jobData.section || "-"}
          </span>
        </div>
        <div className="flex gap-4 justify-evenly">
          <span className="grow">
            <strong>Member:</strong> {jobData.member || "-"}
          </span>
          <span className="grow">
            <strong>Chunk:</strong> {jobData.chunk || "-"}
          </span>
        </div>
        {jobData?.workflow_commit && (
          <div className="flex gap-4 justify-evenly">
            <span className="grow">
              <strong>Workflow Commit:</strong> {jobData.workflow_commit || "-"}
            </span>
          </div>
        )}
        <div className="flex gap-4 justify-evenly">
          <span className="grow">
            <strong>Platform:</strong> {jobData.platform || "-"}
          </span>
          {jobData.qos && (
            <span className="grow">
              <strong>QoS:</strong> {jobData.qos || "-"}
            </span>
          )}
          {jobData.remote_id && (
            <span className="grow">
              <strong>Remote ID:</strong> {jobData.remote_id || "-"}
            </span>
          )}
        </div>
        <div className="flex gap-4 justify-evenly">
          <span className="grow">
            <strong>Processors:</strong> {jobData.processors || "-"}
          </span>
          <span className="grow">
            <strong>Wallclock:</strong> {jobData.wallclock || "-"}
          </span>
        </div>
        <div className="flex gap-x-4 gap-y-1 flex-wrap">
          {/* TODO Queue/run times */}
          {runTime && (
            <div>
              <span
                className="rounded-full text-center px-4 w-full bg-success text-white"
                style={{ width: "100%" }}
              >
                <strong>Run: {secondsToDelta(runTime)}</strong>
              </span>
            </div>
          )}
          <div>
            <span
              className={cn(
                "rounded-full text-center px-4 w-full",
                `badge-status-${jobData.status.toLowerCase()}`,
              )}
            >
              <strong>Status: {jobData.status}</strong>
            </span>
          </div>
        </div>

        {/* TODO parent / children nodes */}

        <div className="flex flex-col gap-1 my-1">
          <div className="flex items-center h-8">
            <span className="h-full rounded-s bg-light px-2 text-sm flex items-center border font-mono">
              OUT
            </span>
            <input
              className="grow truncate form-input py-0 h-full rounded-none border"
              type="text"
              value={jobData.out_path_local || "Not Available"}
              id="g_out_t"
              readOnly
              disabled
            />
            <button
              className="btn btn-light text-sm h-full rounded-none border"
              disabled={!jobData.out_path_local}
              onClick={() => copyToClipboard(jobData.out_path_local || "")}
            >
              COPY
            </button>
            <button
              className="btn btn-dark text-sm h-full rounded-s-none border"
              disabled={!jobData.out_path_local}
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
              value={jobData.err_path_local || "Not Available"}
              id="g_err_t"
              readOnly
              disabled
            />
            <button
              className="btn btn-light text-sm h-full rounded-none border"
              disabled={!jobData.err_path_local}
              onClick={() => copyToClipboard(jobData.err_path_local || "")}
            >
              COPY
            </button>
            <button
              className="btn btn-dark text-sm h-full rounded-s-none border"
              disabled={!jobData.err_path_local}
              onClick={() => toggleModal("errlog")}
            >
              <i className="fa-solid fa-terminal"></i>
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          {jobData.submit && (
            <div className="flex items-center">
              <strong className="me-2">Submit: </strong>
              <span className="badge bg-light">{jobData.submit}</span>
            </div>
          )}
          {jobData.start && (
            <div className="flex items-center">
              <strong className="me-2">Start: </strong>
              <span className="badge bg-light">{jobData.start}</span>
            </div>
          )}
          {jobData.finish && (
            <div className="flex items-center">
              <strong className="me-2">Finish: </strong>
              <span className="badge bg-light">{jobData.finish}</span>
            </div>
          )}
        </div>

        {/* TODO performance metrics */}
        <div className="flex gap-x-4 gap-y-1 flex-wrap">
          {SYPD && (
            <div>
              <span
                className="bg-primary text-white rounded-full px-4"
                title="Generalization of Simulated Years per Day."
              >
                <strong>SYPD: </strong>
                {SYPD.toFixed(2)}
              </span>
            </div>
          )}
        </div>

        {/* TODO wrapper info */}

        <button
          className="btn btn-primary text-sm font-semibold"
          onClick={() => toggleModal("history")}
        >
          <i className="fa-solid fa-clock-rotate-left me-1"></i> Job History
        </button>
      </div>

      <LogModal
        logFile={parseLogPath(jobData.out_path_local)}
        show={showModal.outlog}
        onHide={() => toggleModal("outlog")}
      />

      <LogModal
        logFile={parseLogPath(jobData.err_path_local)}
        show={showModal.errlog}
        onHide={() => toggleModal("errlog")}
      />

      <JobHistoryModal
        expid={expid}
        jobName={jobData.name}
        show={showModal.history}
        onHide={() => toggleModal("history")}
      />
    </>
  );
};

export default FetchJobDetailCard;
