import { Modal } from "react-bootstrap"
import { secondsToDelta } from "../components/context/utils"
import { useEffect, useState } from "react"
import { statusCodeToStyle } from "../components/context/vars"
import LogModal from "./LogModal"
import { useCopyToClipboard } from "@uidotdev/usehooks"


const parseLogPath = (logfile) => {
  const logPathSplit = logfile && logfile.length > 0 ? logfile.split("/") : [""];
  const logFileName = logPathSplit.pop();
  return logFileName
}


const JobDetailCard = ({ jobData, jobs, onClose }) => {
  const copyToClipboard = useCopyToClipboard()[1];

  const [showModal, setShowModal] = useState({
    children: false,
    parents: false,
    outlog: false,
    errlog: false,
  })
  const toggleModal = (modal) => {
    setShowModal({
      ...showModal,
      [modal]: !showModal[modal]
    })
  }

  const [jobDependencies, setJobDependencies] = useState({
    children: [],
    parents: []
  })

  useEffect(() => {
    if (Array.isArray(jobs) && jobData) {
      let newChildren = []
      let newParents = []
      if (Array.isArray(jobData.children_list)) {
        newChildren = jobs.filter(job => jobData.children_list.includes(job.id))
      }
      if (Array.isArray(jobData.parent_list)) {
        newParents = jobs.filter(job => jobData.parent_list.includes(job.id))
      }
      setJobDependencies({
        children: newChildren,
        parents: newParents
      })
    }
  }, [jobData, jobs])

  return (
    <>
      {
        jobData &&
        <>
          <div className="rounded-4 border d-flex flex-column" style={{ width: "min(28rem, 90vw)" }}>

            <div className="bg-dark text-white rounded-top-4 px-4 py-2 d-flex justify-content-between align-items-center">
              <div className="fw-bold">{jobData.label}</div>
              {
                onClose &&
                <div style={{ cursor: "pointer" }} onClick={onClose}>
                  <i className="fa-solid fa-xmark"></i>
                </div>
              }
            </div>

            <div className="d-flex flex-column px-4 py-3 gap-1">
              <div className="d-flex gap-3 justify-content-evenly">
                <span className="flex-fill">
                  <strong>Start:</strong> {jobData.date || "-"}
                </span>
                <span className="flex-fill">
                  <strong>End:</strong> {jobData.date_plus || "-"}
                </span>
              </div>
              <div className="d-flex gap-3">
                <span>
                  <strong>Section:</strong> {jobData.section || "-"}
                </span>
              </div>
              <div className="d-flex gap-3 justify-content-evenly">
                <span className="flex-fill">
                  <strong>Member:</strong> {jobData.member || "-"}
                </span>
                <span className="flex-fill">
                  <strong>Chunk:</strong> {jobData.chunk || "-"}
                </span>
              </div>
              <div className="d-flex gap-3 justify-content-evenly">
                <span className="flex-fill">
                  <strong>Platform:</strong> {jobData.platform_name || "-"}
                </span>
                {
                  jobData.queue &&
                  <span className="flex-fill">
                    <strong>QoS:</strong> {jobData.queue || "-"}
                  </span>
                }
                {
                  jobData.queue &&
                  <span className="flex-fill">
                    <strong>Remote ID:</strong> {jobData.rm_id || "-"}
                  </span>
                }
              </div>
              <div className="d-flex gap-3 justify-content-evenly">
                <span className="flex-fill">
                  <strong>Processors:</strong> {jobData.processors || "-"}
                </span>
                <span className="flex-fill">
                  <strong>Wallclock:</strong> {jobData.wallclock || "-"}
                </span>
              </div>
              <div className="d-flex column-gap-3 row-gap-1 flex-wrap">
                {
                  jobData.minutes_queue >= 0 &&
                  [
                    "SUBMITTED",
                    "QUEUING",
                    "RUNNING",
                    "COMPLETED",
                    "FAILED",
                  ].includes(jobData.status) &&
                  <div>
                    <span
                      className='rounded-pill text-center px-3'
                      style={{
                        width: "100%",
                        backgroundColor:
                          jobData.status === "SUBMITTED"
                            ? "cyan"
                            : "pink",
                        color: "black",
                      }}
                    >
                      <strong>
                        {jobData.status === "SUBMITTED"
                          ? "Submit"
                          : "Queue"}
                        : {secondsToDelta(jobData.minutes_queue)}
                      </strong>
                    </span>
                  </div>
                }
                {jobData.minutes >= 0 &&
                  ["RUNNING", "COMPLETED", "FAILED"].includes(
                    jobData.status
                  ) &&
                  <div>
                    <span
                      className='px-3 bg-success rounded-pill text-center text-white'
                      style={{ width: "100%" }}
                    >
                      <strong>
                        Run: {secondsToDelta(jobData.minutes)}
                      </strong>
                    </span>
                  </div>
                }
                <div>
                  <span
                    className='px-3 rounded-pill text-center'
                    style={{
                      width: "100%",
                      backgroundColor: jobData.status_color,
                      color:
                        jobData.status === "RUNNING"
                          ? "white"
                          : "black",
                    }}
                  >
                    <strong>Status: {jobData.status}</strong>
                  </span>
                </div>
              </div>
              <div className="d-flex gap-2 align-items-center">
                <strong>Dependencies: </strong>
                <button className="btn btn-dark btn-sm px-3 rounded-3"
                  onClick={() => toggleModal("children")}
                  disabled={jobDependencies.children.length <= 0}>
                  <strong>CHILDREN:</strong> {
                    (jobDependencies.children.length) || "0"
                  }
                </button>
                <button className="btn btn-dark btn-sm px-3 rounded-3"
                  onClick={() => toggleModal("parents")}
                  disabled={jobDependencies.parents.length <= 0}>
                  <strong>PARENTS:</strong> {
                    (jobDependencies.parents.length) || "0"
                  }
                </button>
              </div>

              <div className="d-flex flex-column gap-1 my-1">
                <div className='input-group input-group-sm'>
                  <span className="input-group-text font-monospace">OUT</span>
                  <input
                    className='form-control py-0'
                    type='text'
                    value={
                      jobData.out
                        ? jobData.out
                        : "Not Available"
                    }
                    id='g_out_t'
                    readOnly disabled
                  />
                  <button className="btn btn-light border"
                    disabled={!jobData.out}
                    onClick={() => copyToClipboard(jobData.out || "")}>
                    COPY
                  </button>
                  <button className="btn btn-dark"
                    disabled={!jobData.out}
                    onClick={() => toggleModal("outlog")}>
                    <i className="fa-solid fa-terminal mx-1 small"></i>
                  </button>
                </div>

                <div className='input-group input-group-sm'>
                  <span className="input-group-text font-monospace">ERR</span>
                  <input
                    className='form-control py-0'
                    type='text'
                    value={
                      jobData.err
                        ? jobData.err
                        : "Not Available"
                    }
                    id='g_err_t'
                    readOnly disabled
                  />
                  <button className="btn btn-light border"
                    disabled={!jobData.err}
                    onClick={() => copyToClipboard(jobData.err || "")}>
                    COPY
                  </button>
                  <button className="btn btn-dark"
                    disabled={!jobData.err}
                    onClick={() => toggleModal("errlog")}>
                    <i className="fa-solid fa-terminal mx-1 small"></i>
                  </button>
                </div>
              </div>


              <div className="d-flex flex-column gap-1">
                {
                  jobData.submit &&
                  <div className="d-flex align-items-center">
                    <strong className="me-2">Submit: </strong>
                    <span className="badge bg-light">{jobData.submit}</span>
                  </div>
                }
                {
                  jobData.start &&
                  <div className="d-flex align-items-center">
                    <strong className="me-2">Start: </strong>
                    <span className="badge bg-light">{jobData.start}</span>
                  </div>
                }
                {
                  jobData.finish &&
                  <div className="d-flex align-items-center">
                    <strong className="me-2">Finish: </strong>
                    <span className="badge bg-light">{jobData.finish}</span>
                  </div>
                }
              </div>

              <div className="d-flex column-gap-3 row-gap-1 flex-wrap">
                {
                  jobData.SYPD &&
                  <div>
                    <span
                      className='bg-primary text-white rounded-pill px-3'
                      title='Generalization of Simulated Years per Day.'
                    >
                      <strong>SYPD: </strong>{jobData.SYPD}
                    </span>
                  </div>
                }
                {
                  jobData.ASYPD &&
                  <div>
                    <span
                      className='bg-primary text-white rounded-pill px-3'
                      title='Generalization of Actual SYPD.'
                    >
                      <strong>ASYPD: </strong>{jobData.ASYPD}
                    </span>
                  </div>
                }
              </div>

              {
                jobData.wrapper &&
                <div className="d-flex gap-3">
                  <span>
                    <strong>Wrapper:</strong> <span className="badge bg-light">{jobData.wrapper}</span>
                  </span>
                </div>
              }
            </div>
          </div>

          <Modal centered show={showModal.children} onHide={() => toggleModal("children")}>
            <Modal.Header closeButton
              bsPrefix="modal-header bg-dark text-white">
              <Modal.Title>
                <i className="fa-solid fa-circle-light mx-2"></i> Children List
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <ul>
                {jobDependencies.children.map((item, index) => (
                  <li key={index}>
                    {item.id}{" "}
                    <span
                      className='badge'
                      style={statusCodeToStyle(item.status_code)}
                    >
                      {item.status}
                    </span>
                  </li>
                ))}
              </ul>
            </Modal.Body>
          </Modal>

          <Modal centered show={showModal.parents} onHide={() => toggleModal("parents")}>
            <Modal.Header closeButton
              bsPrefix="modal-header bg-dark text-white">
              <Modal.Title>
                <i className="fa-solid fa-circle-light mx-2"></i> Parents List
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <ul>
                {jobDependencies.parents.map((item, index) => (
                  <li key={index}>
                    {item.id}{" "}
                    <span
                      className='badge'
                      style={statusCodeToStyle(item.status_code)}
                    >
                      {item.status}
                    </span>
                  </li>
                ))}
              </ul>
            </Modal.Body>
          </Modal>

          <LogModal logFile={parseLogPath(jobData.out)} show={showModal.outlog}
            onHide={() => toggleModal("outlog")} />

          <LogModal logFile={parseLogPath(jobData.err)} show={showModal.errlog}
            onHide={() => toggleModal("errlog")} />

        </>
      }
    </>
  )
}

export default JobDetailCard