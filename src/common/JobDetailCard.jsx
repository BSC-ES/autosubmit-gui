import { useEffect, useMemo, useState } from "react";
import { statusCodeToStyle } from "../components/context/vars";
import JobDetailCardLayout from "./JobDetailCardLayout";

const JobDetailCard = ({ expid, jobData, jobs }) => {
  const [jobDependencies, setJobDependencies] = useState({
    children: [],
    parents: [],
  });

  useEffect(() => {
    if (Array.isArray(jobs) && jobData) {
      let newChildren = [];
      let newParents = [];
      if (Array.isArray(jobData.children_list)) {
        newChildren = jobs.filter((job) =>
          jobData.children_list.includes(job.id),
        );
      }
      if (Array.isArray(jobData.parent_list)) {
        newParents = jobs.filter((job) => jobData.parent_list.includes(job.id));
      }
      setJobDependencies({
        children: newChildren,
        parents: newParents,
      });
    }
  }, [jobData, jobs]);

  const normalizedChildren = useMemo(
    () =>
      jobDependencies.children.map((item) => ({
        name: item.id,
        status: item.status,
        statusStyle: statusCodeToStyle(item.status_code),
      })),
    [jobDependencies.children],
  );

  const normalizedParents = useMemo(
    () =>
      jobDependencies.parents.map((item) => ({
        name: item.id,
        status: item.status,
        statusStyle: statusCodeToStyle(item.status_code),
      })),
    [jobDependencies.parents],
  );

  const showQueueTime =
    jobData &&
    jobData.minutes_queue >= 0 &&
    ["SUBMITTED", "QUEUING", "RUNNING", "COMPLETED", "FAILED"].includes(
      jobData.status,
    );

  const showRunTime =
    jobData &&
    jobData.minutes >= 0 &&
    ["RUNNING", "COMPLETED", "FAILED"].includes(jobData.status);

  return (
    <>
      {jobData && (
        <JobDetailCardLayout
          expid={expid}
          jobName={jobData.label}
          startDate={jobData.date}
          endDate={jobData.date_plus}
          section={jobData.section}
          member={jobData.member}
          chunk={jobData.chunk}
          split={jobData.split}
          splits={jobData.splits}
          workflowCommit={jobData.workflow_commit}
          platform={jobData.platform_name}
          qos={jobData.queue}
          remoteId={jobData.rm_id}
          processors={jobData.processors}
          wallclock={jobData.wallclock}
          queueTime={showQueueTime ? jobData.minutes_queue : null}
          queueLabel={jobData.status === "SUBMITTED" ? "Submit" : "Queue"}
          queueBgColor={jobData.status === "SUBMITTED" ? "cyan" : "pink"}
          runTime={showRunTime ? jobData.minutes : null}
          status={jobData.status}
          statusStyle={{
            backgroundColor: jobData.status_color,
            color: jobData.status === "RUNNING" ? "white" : "black",
          }}
          children={normalizedChildren}
          parents={normalizedParents}
          outPath={jobData.out}
          errPath={jobData.err}
          submitTime={jobData.submit}
          startTime={jobData.start}
          finishTime={jobData.finish}
          SYPD={jobData.SYPD}
          ASYPD={jobData.ASYPD}
          wrapper={jobData.wrapper}
        />
      )}
    </>
  );
};

export default JobDetailCard;
