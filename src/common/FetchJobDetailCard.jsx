import { Dialog } from "@headlessui/react";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { useMemo, useState } from "react";
import { secondsToDelta } from "../components/context/utils";
import { autosubmitApiV4 } from "../services/autosubmitApiV4";
import { cn, parseLogPath } from "../services/utils";
import JobHistoryModal from "./JobHistoryModal";
import LogModal from "./LogModal";
import Modal from "./Modal";
import * as Tooltip from "@radix-ui/react-tooltip";

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

  const { data: jobParents } = autosubmitApiV4.endpoints.getJobParents.useQuery(
    {
      expid: expid,
      job_name: jobName,
      include_status: true,
    },
  );

  const { data: jobChildren } =
    autosubmitApiV4.endpoints.getJobChildren.useQuery({
      expid: expid,
      job_name: jobName,
      include_status: true,
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

  const queueTime = useMemo(() => {
    if (
      jobData &&
      jobData.submit &&
      jobData.start &&
      ["RUNNING", "COMPLETED", "FAILED"].includes(jobData.status)
    ) {
      return calcRunTime(jobData.submit, jobData.start);
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
  }, [runTime, jobData]);

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
          {queueTime && (
            <div>
              <span className="rounded-full text-center px-4 w-full bg-[pink] text-black">
                <strong>
                  Queue: {secondsToDelta(queueTime)}{" "}
                  {jobData.last_wrapper && (
                    <Tooltip.Provider>
                      <Tooltip.Root delayDuration={300}>
                        <Tooltip.Trigger className="cursor-help">
                          <i className="fa-solid fa-warning opacity-70 text-sm" />
                        </Tooltip.Trigger>
                        <Tooltip.Content
                          side="right"
                          align="center"
                          className="text-xs bg-black/85 text-white px-2 py-1 rounded max-w-[16rem] text-center font-normal"
                        >
                          The job belongs to a wrapper. The real queue time may
                          be shorter than this, because the submit time is when
                          the wrapper is submitted, not the job itself.
                          <Tooltip.Arrow />
                        </Tooltip.Content>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                  )}
                </strong>
              </span>
            </div>
          )}

          {runTime && (
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
                `badge-status-${jobData.status.toLowerCase()}`,
              )}
            >
              <strong>Status: {jobData.status}</strong>
            </span>
          </div>
        </div>

        <div className="flex gap-2 items-center flex-wrap">
          <strong>Dependencies: </strong>
          <button
            className="btn btn-dark text-sm px-4 rounded-lg"
            onClick={() => toggleModal("children")}
            disabled={jobChildren?.children?.length <= 0}
          >
            <strong>CHILDREN:</strong> {jobChildren?.children?.length || "0"}
          </button>
          <button
            className="btn btn-dark text-sm px-4 rounded-lg"
            onClick={() => toggleModal("parents")}
            disabled={jobParents?.parents?.length <= 0}
          >
            <strong>PARENTS:</strong> {jobParents?.parents?.length || "0"}
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
              value={jobData.out_path_local || "Not Available"}
              id={`g_out_t_${jobName}`}
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
              id={`g_err_t_${jobName}`}
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

        {jobData?.last_wrapper && (
          <div className="flex flex-wrap gap-4">
            <span className="flex flex-wrap gap-x-2 items-center">
              <strong>Wrapper:</strong>{" "}
              <span key={jobData.last_wrapper} className="badge bg-light">
                {jobData.last_wrapper}
              </span>
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
            {jobChildren?.children?.map((item, index) => (
              <li key={index}>
                {item.job_name}{" "}
                {item.status && (
                  <span
                    className={cn(
                      "badge",
                      `badge-status-${item.status.toLowerCase()}`,
                    )}
                  >
                    {item.status}
                  </span>
                )}
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
            {jobParents?.parents?.map((item, index) => (
              <li key={index}>
                {item.job_name}{" "}
                {item.status && (
                  <span
                    className={cn(
                      "badge",
                      `badge-status-${item.status.toLowerCase()}`,
                    )}
                  >
                    {item.status}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </Modal>

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
        jobName={jobName}
        show={showModal.history}
        onHide={() => toggleModal("history")}
      />
    </>
  );
};

export default FetchJobDetailCard;
