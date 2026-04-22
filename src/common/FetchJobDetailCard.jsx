import { useMemo } from "react";
import { autosubmitApiV4 } from "../services/autosubmitApiV4";
import JobDetailCardLayout from "./JobDetailCardLayout";
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

  const normalizedChildren = useMemo(
    () =>
      (jobChildren?.children || []).map((item) => ({
        name: item.job_name,
        status: item.status,
        statusClassName: item.status
          ? `badge-status-${item.status.toLowerCase()}`
          : undefined,
      })),
    [jobChildren],
  );

  const normalizedParents = useMemo(
    () =>
      (jobParents?.parents || []).map((item) => ({
        name: item.job_name,
        status: item.status,
        statusClassName: item.status
          ? `badge-status-${item.status.toLowerCase()}`
          : undefined,
      })),
    [jobParents],
  );

  const wrapperQueueTooltip = jobData?.last_wrapper ? (
    <Tooltip.Provider>
      <Tooltip.Root delayDuration={300}>
        <Tooltip.Trigger
          className="cursor-help"
          aria-label="Wrapper job warning: queue time may be shorter than shown"
        >
          <i
            className="fa-solid fa-warning opacity-70 text-sm"
            aria-hidden="true"
          />
        </Tooltip.Trigger>
        <Tooltip.Content
          side="right"
          align="center"
          className="text-xs bg-black/85 text-white px-2 py-1 rounded max-w-[16rem] text-center font-normal"
        >
          The job belongs to a wrapper. The real queue time may be shorter than
          this, because the submit time is when the wrapper is submitted, not
          the job itself.
          <Tooltip.Arrow />
        </Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>
  ) : null;

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
    <JobDetailCardLayout
      expid={expid}
      jobName={jobName}
      startDate={start_date}
      endDate={end_date}
      section={jobData.section}
      member={jobData.member}
      chunk={jobData.chunk}
      split={jobData.split}
      splits={jobData.splits}
      workflowCommit={jobData.workflow_commit}
      platform={jobData.platform}
      qos={jobData.qos}
      remoteId={jobData.remote_id}
      processors={jobData.processors}
      wallclock={jobData.wallclock}
      queueTime={queueTime}
      queueTimeExtra={wrapperQueueTooltip}
      runTime={runTime}
      status={jobData.status}
      statusClassName={`badge-status-${jobData.status.toLowerCase()}`}
      childJobs={normalizedChildren}
      parentJobs={normalizedParents}
      outPath={jobData.out_path_local}
      errPath={jobData.err_path_local}
      submitTime={jobData.submit}
      startTime={jobData.start}
      finishTime={jobData.finish}
      SYPD={SYPD ? SYPD.toFixed(2) : null}
      wrapper={jobData.last_wrapper}
    />
  );
};

export default FetchJobDetailCard;
