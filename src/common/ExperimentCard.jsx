import { forwardRef, useImperativeHandle, useState } from "react"
import { ProgressBar } from "react-bootstrap"
import { Link } from "react-router-dom"


const ExperimentCard = forwardRef(({ experiment }, ref) => {
  const [show, setShow] = useState(true)

  const expand = () => { setShow(true) }
  const collapse = () => { setShow(false) }
  const toggle = () => { setShow(!show) }

  useImperativeHandle(ref, () => {
    return {
      expand,
      collapse
    }
  })

  return (
    <div className="d-flex flex-column w-100 h-100">
      <div className={"d-flex flex-column px-4 py-2 bg-light border " + (show ? "rounded-top-4" : "rounded-4")}>
        <div className="w-100 d-flex gap-3 align-items-center  " >
          <div style={{ width: "1.5rem", height: "1.5rem", minWidth: "1.5rem" }}
            className={"rounded-circle border " + (experiment?.status === "RUNNING" ? "bg-success" : "bg-white")}
            title={(experiment?.status === "RUNNING" ? "ACTIVE" : "INACTIVE")}
          />
          <Link to={`/experiment/${experiment.name}/quick`}
            className="text-dark fs-4 fw-bold"
            style={{ cursor: "pointer" }}
          >
            {experiment.name}
          </Link>
          <span className="small text-dark" title={experiment.description}
            style={{ textOverflow: "ellipsis", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
            {experiment.description}
          </span>
          {/* <div onClick={toggle} className="ms-auto"
            style={{ cursor: "pointer" }}>
            <i className={"text-white fs-2 fa-solid " + (show ? "fa-angle-up" : "fa-angle-down")}></i>
          </div> */}
        </div>

      </div>
      {
        show &&
        <div className="flex-fill border border-top-0 rounded-bottom-4 py-3 px-4 w-100 d-flex flex-column gap-3">
          <div className="d-flex gap-3 align-items-center w-100">
            <div className="d-flex flex-column gap-1 flex-fill">
              <ProgressBar className="bg-light border rounded-pill p-0" style={{ minWidth: "10rem", width: "100%" }}>
                <ProgressBar max={experiment?.total} now={experiment?.completed}
                  animated={experiment?.status === "RUNNING"}
                  className={
                    (experiment?.failed > 0) ? "bg-danger" : (
                      (experiment?.queuing > 0 && !(experiment?.running > 0)) ? "bg-queue" : "bg-success"
                    )} />
              </ProgressBar>
              <div className="d-flex gap-1 align-items-center justify-content-between">
                <div className="d-flex gap-1">
                  {
                    experiment?.queuing > 0 &&
                    <span className='badge bg-queue text-black'>
                      {experiment.queuing}
                    </span>
                  }
                  {
                    experiment?.running > 0 &&
                    <span className='badge bg-success text-white'>
                      {experiment.running}
                    </span>
                  }
                  {
                    experiment?.failed > 0 &&
                    <span className='badge bg-danger text-white'>
                      {experiment.failed}
                    </span>
                  }
                  {
                    experiment?.completed > 0 &&
                    <span className='badge bg-completed text-black'>
                      {experiment.completed}
                    </span>
                  }
                </div>
                <span className='fw-bold'>
                  /{experiment.total}
                </span>
              </div>
            </div>


          </div>
          <div className="grid">
            <Link to={`/experiment/${experiment.name}/quick`}
              className="g-col-4">
              <button type="button"
                className="w-100 btn btn-sm btn-outline-primary fw-bold text-nowrap">
                QUICK
              </button>
            </Link>
            <Link to={`/experiment/${experiment.name}/tree`}
              className="g-col-4">
              <button type="button"
                className="w-100 btn btn-sm btn-outline-primary fw-bold text-nowrap">
                TREE
              </button>
            </Link>
            <Link to={`/experiment/${experiment.name}/graph`}
              className="g-col-4">
              <button type="button"
                className="w-100 btn btn-sm btn-outline-primary fw-bold text-nowrap">
                GRAPH
              </button>
            </Link>
          </div>
          <div className="grid">
            <div className="g-col-3 small" title="User">
              <i className="fa-solid fa-user me-3" /> {experiment.user || "-"}
            </div>
            <div className="g-col-3 small" title="HPC">
              <i className="fa-solid fa-computer me-3" /> {experiment.hpc || "-"}
            </div>
            <div className="g-col-3 small" title="Autosubmit version">
              <i className="fa-solid fa-code-branch me-3" /> {experiment.version || "-"}
            </div>
            <div className="g-col-3 small" title="Last modified date">
              <i className="fa-solid fa-calendar me-3" /> {experiment.modified || "-"}
            </div>
          </div>


          {/* <button type="button"
              className="btn btn-primary fw-bold px-4 text-white text-nowrap">
              SUMMARY
            </button> */}
        </div>
      }

    </div>

  )
})

export default ExperimentCard