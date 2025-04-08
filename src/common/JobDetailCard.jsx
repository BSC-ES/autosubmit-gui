import { secondsToDelta } from "../components/context/utils";
import { useEffect, useState } from "react";
import { statusCodeToStyle } from "../components/context/vars";
import LogModal from "./LogModal";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { Dialog } from "@headlessui/react";
import Modal from "./Modal";
import JobHistoryModal from "./JobHistoryModal";
import { parseLogPath } from "../services/utils";

const JobDetailCard = ({ expid, jobData, jobs }) => {
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
          jobData.children_list.includes(job.id)
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

  return (
    <>
      {jobData && (
        <>
          <div className="flex flex-col gap-1">
            <div className="flex gap-3 justify-evenly">
              <span className="grow">
                <strong>Start:</strong> {jobData.date || "-"}
              </span>
              <span className="grow">
                <strong>End:</strong> {jobData.date_plus || "-"}
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
                  <strong>Workflow Commit:</strong>{" "}
                  {jobData.workflow_commit || "-"}
                </span>
              </div>
            )}
            <div className="flex gap-4 justify-evenly">
              <span className="grow">
                <strong>Platform:</strong> {jobData.platform_name || "-"}
              </span>
              {jobData.queue && (
                <span className="grow">
                  <strong>QoS:</strong> {jobData.queue || "-"}
                </span>
              )}
              {jobData.queue && (
                <span className="grow">
                  <strong>Remote ID:</strong> {jobData.rm_id || "-"}
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
              {jobData.minutes_queue >= 0 &&
                [
                  "SUBMITTED",
                  "QUEUING",
                  "RUNNING",
                  "COMPLETED",
                  "FAILED",
                ].includes(jobData.status) && (
                  <div>
                    <span
                      className="rounded-full text-center px-4 w-full"
                      style={{
                        backgroundColor:
                          jobData.status === "SUBMITTED" ? "cyan" : "pink",
                        color: "black",
                      }}
                    >
                      <strong>
                        {jobData.status === "SUBMITTED" ? "Submit" : "Queue"}:{" "}
                        {secondsToDelta(jobData.minutes_queue)}
                      </strong>
                    </span>
                  </div>
                )}
              {jobData.minutes >= 0 &&
                ["RUNNING", "COMPLETED", "FAILED"].includes(jobData.status) && (
                  <div>
                    <span
                      className="rounded-full text-center px-4 w-full bg-success text-white"
                      style={{ width: "100%" }}
                    >
                      <strong>Run: {secondsToDelta(jobData.minutes)}</strong>
                    </span>
                  </div>
                )}
              <div>
                <span
                  className="rounded-full text-center px-4 w-full"
                  style={{
                    width: "100%",
                    backgroundColor: jobData.status_color,
                    color: jobData.status === "RUNNING" ? "white" : "black",
                  }}
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
                disabled={jobDependencies.children.length <= 0}
              >
                <strong>CHILDREN:</strong>{" "}
                {jobDependencies.children.length || "0"}
              </button>
              <button
                className="btn btn-dark text-sm px-4 rounded-lg"
                onClick={() => toggleModal("parents")}
                disabled={jobDependencies.parents.length <= 0}
              >
                <strong>PARENTS:</strong>{" "}
                {jobDependencies.parents.length || "0"}
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
                  value={jobData.out ? jobData.out : "Not Available"}
                  id="g_out_t"
                  readOnly
                  disabled
                />
                <button
                  className="btn btn-light text-sm h-full rounded-none border"
                  disabled={!jobData.out}
                  onClick={() => copyToClipboard(jobData.out || "")}
                >
                  COPY
                </button>
                <button
                  className="btn btn-dark text-sm h-full rounded-s-none border"
                  disabled={!jobData.out}
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
                  value={jobData.err ? jobData.err : "Not Available"}
                  id="g_err_t"
                  readOnly
                  disabled
                />
                <button
                  className="btn btn-light text-sm h-full rounded-none border"
                  disabled={!jobData.err}
                  onClick={() => copyToClipboard(jobData.err || "")}
                >
                  COPY
                </button>
                <button
                  className="btn btn-dark text-sm h-full rounded-s-none border"
                  disabled={!jobData.err}
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
              {jobData.SYPD && (
                <div>
                  <span
                    className="bg-primary text-white rounded-full px-4"
                    title="Generalization of Simulated Years per Day."
                  >
                    <strong>SYPD: </strong>
                    {jobData.SYPD}
                  </span>
                </div>
              )}
              {jobData.ASYPD && (
                <div>
                  <span
                    className="bg-primary text-white rounded-full px-4"
                    title="Generalization of Actual SYPD."
                  >
                    <strong>ASYPD: </strong>
                    {jobData.ASYPD}
                  </span>
                </div>
              )}
            </div>

            {jobData.wrapper && (
              <div className="flex gap-4">
                <span>
                  <strong>Wrapper:</strong>{" "}
                  <span className="badge bg-light">{jobData.wrapper}</span>
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

          <Modal
            show={showModal.children}
            onClose={() => toggleModal("children")}
          >
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
                {jobDependencies.children.map((item, index) => (
                  <li key={index}>
                    {item.id}{" "}
                    <span
                      className="badge"
                      style={statusCodeToStyle(item.status_code)}
                    >
                      {item.status}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Modal>

          <Modal
            show={showModal.parents}
            onClose={() => toggleModal("parents")}
          >
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
                {jobDependencies.parents.map((item, index) => (
                  <li key={index}>
                    {item.id}{" "}
                    <span
                      className="badge"
                      style={statusCodeToStyle(item.status_code)}
                    >
                      {item.status}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Modal>

          <LogModal
            logFile={parseLogPath(jobData.out)}
            show={showModal.outlog}
            onHide={() => toggleModal("outlog")}
          />

          <LogModal
            logFile={parseLogPath(jobData.err)}
            show={showModal.errlog}
            onHide={() => toggleModal("errlog")}
          />

          <JobHistoryModal
            expid={expid}
            jobName={jobData.label}
            show={showModal.history}
            onHide={() => toggleModal("history")}
          />
        </>
      )}
    </>
  );
};

export default JobDetailCard;
