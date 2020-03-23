import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import ExperimentContext from "../context/experiment/experimentContext";

const ExperimentItem = ({
  experiment: { name, description, user, hpc, status, completed, total }
}) => {
  const experimentContext = useContext(ExperimentContext);
  const { getExperimentSummary, summaries } = experimentContext;
  const onGetSummary = e => {
    e.preventDefault();
    console.log(name);
    getExperimentSummary(name);
  };
  return (
    <div className='col mb-4'>
      <div className='card'>
        <div className='card-header text-center py-1'>
          <div className='row'>
            <div className='col-md-3 text-left'>
              <h3 className='font-weight-bold'>{name}</h3>
            </div>
            <div className='col-md-6 text-right'>
              {" "}
              {completed} / {total}{" "}
              <div className='progress'>
                <div
                  className={
                    completed === total
                      ? "progress-bar bg-warning"
                      : status === "RUNNING"
                      ? summaries[name] && summaries[name].n_failed > 0
                        ? "progress-bar progress-bar-striped progress-bar-animated bg-danger"
                        : "progress-bar progress-bar-striped progress-bar-animated bg-success"
                      : summaries[name] && summaries[name].n_failed > 0
                      ? "progress-bar bg-danger"
                      : "progress-bar bg-info"
                  }
                  role='progressbar'
                  style={{
                    width: total > 0 ? (completed / total) * 100 + "%" : "0%"
                  }}
                  aria-valuenow={completed}
                  aria-valuemin='0'
                  aria-valuemax={total}
                ></div>
              </div>
              {/* <span className='badge badge-default'>
              {" "}
              
            </span> */}
            </div>
            <div className='col-md-3 text-right'>
              {status && status === "RUNNING" && (
                <span className='badge badge-success text-right'>{status}</span>
              )}
              {status && status !== "RUNNING" && (
                <span className='badge badge-secondary text-right'>
                  {status}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className='card-body py-1'>
          {/* <h4 className="card-title"></h4> */}
          <h6 className='card-subtitle text-muted pt-2'>
            <small>Owner:</small> {user}
          </h6>
          <p className='card-text py-1 mb-1'>
            <small>{description}</small>
          </p>
          <div className='row'>
            <div className='col-3 px-1'>
              <form onSubmit={onGetSummary} className='form'>
                <input
                  className={
                    summaries[name]
                      ? "btn btn-info btn-block btn-sm"
                      : "btn btn-outline-info btn-block btn-sm"
                  }
                  type='submit'
                  value={summaries[name] ? "Refresh" : "Summary"}
                  aria-controls={name}
                />
              </form>
            </div>
            <div className='col-9 px-1'>
              <Link
                to={`/autosubmitapp/experiment/${name}`}
                className='btn btn-outline-primary btn-block btn-sm'
              >
                More
              </Link>
            </div>
            {summaries[name] && summaries[name].error === false && (
              <div className='col-12 pt-2' id={name}>
                <div className='card card-body p-0'>
                  <div className='row text-center'>
                    <div className='col-md-6'>
                      <small>
                        Avg. Queue {summaries[name].avg_queue_time} min.
                      </small>
                    </div>
                    <div className='col-md-6'>
                      <small>
                        Avg. Run {summaries[name].avg_run_time} min.
                      </small>
                    </div>
                  </div>
                  <div className='row px-2 pb-2'>
                    <div className='col-12'>
                      {summaries[name].n_running > 0 && (
                        <span className='badge badge-success'>
                          Running: {summaries[name].n_running}
                        </span>
                      )}{" "}
                      {summaries[name].n_queuing > 0 && (
                        <span
                          className='badge'
                          style={{ backgroundColor: "pink" }}
                        >
                          Queuing: {summaries[name].n_queuing}
                        </span>
                      )}{" "}
                      {summaries[name].n_submitted > 0 && (
                        <span
                          className='badge'
                          style={{ backgroundColor: "cyan" }}
                        >
                          Submitted: {summaries[name].n_submitted}
                        </span>
                      )}{" "}
                      {summaries[name].n_suspended > 0 && (
                        <span
                          className='badge'
                          style={{ backgroundColor: "orange" }}
                        >
                          Suspended: {summaries[name].n_suspended}
                        </span>
                      )}
                    </div>
                  </div>

                  {summaries[name].n_failed > 0 && (
                    <div className='row px-1'>
                      <div className='col-md-3 text-center px-2'>
                        <span className='badge badge-danger'>
                          Failed: {summaries[name].n_failed}
                        </span>
                      </div>
                      <div className='col-md-9 text-left'>
                        <div
                          className=''
                          style={{ overflow: "auto", maxHeight: "200px" }}
                        >
                          {summaries[name].failed_jobs.map(item => (
                            <li key={item}>
                              <small>{item}</small>
                            </li>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <p className='card-text text-center'>
            <small className='text-muted'>HPC: {hpc}</small>
          </p>
        </div>
      </div>
    </div>
  );
};

ExperimentItem.propTypes = {
  experiment: PropTypes.object.isRequired
};

export default ExperimentItem;
