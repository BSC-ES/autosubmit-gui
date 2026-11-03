import { useMemo } from "react";
import { autosubmitApiV4 } from "../services/autosubmitApiV4";
import JobDetailCardLayout from "./JobDetailCardLayout";
import * as Tooltip from "@radix-ui/react-tooltip";

const formatDate = (date) => {
  if (!date) return "-";
  const formattedDate = String(date).match(/^(\d{4})(\d{2})(\d{2})$/);

  return formattedDate?.slice(1).join(" ") ?? "-";
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
      startDate={formatDate(jobData.start_date)}
      endDate={formatDate(jobData.end_date)}
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
