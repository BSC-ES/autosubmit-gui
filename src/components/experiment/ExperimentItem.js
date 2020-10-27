import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import ExperimentContext from "../context/experiment/experimentContext";
import { quickThreshold } from "../context/vars";

const ExperimentItem = ({
  experiment: { name, description, user, hpc, status, completed, total, version },
}) => {
  const experimentContext = useContext(ExperimentContext);
  const { getExperimentSummary, summaries, loadingSummary } = experimentContext;
  const onGetSummary = (e) => {
    e.preventDefault();
    //console.log(name);
    getExperimentSummary(name);
  };

  const disabledMore = total >= quickThreshold ? true : false;

  return (
    <div className='col mb-4'>
      <div className='card'>
        <div className='card-header text-center py-1'>
          <div className='row'>
            <div className='col-md-3 text-left'>
              <h3 className='font-weight-bold'>{name}</h3>
            </div>
            <div className='col-md-6 text-center'>
              {" "}
              {completed} / {total}{" "}
              <div className='progress border'>
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
                    width: total > 0 ? (completed / total) * 100 + "%" : "0%",
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
                <span className='badge badge-success text-right'>ACTIVE</span>
              )}
              {status && status !== "RUNNING" && (
                <span className='badge badge-secondary text-right'>
                  INACTIVE
                </span>
              )}
            </div>
          </div>
        </div>
        <div className='card-body py-1'>
          {/* <h4 className="card-title"></h4> */}
          <div className="d-flex justify-content-between">
            <div>
              <h6 className='card-subtitle text-muted pt-2'>
                <small>Owner:</small> {user}
              </h6>
            </div>
            <div>
              <small className='text-muted'>HPC: {hpc}</small>
            </div>
          </div>          
          <p className='card-text py-1 mb-1'>
            <small>{description}</small>
          </p>
          <div className='row'>
            <div className='col-3 px-1'>
              {!loadingSummary.has(name) && (
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
              )}
              {loadingSummary.has(name) && (
                <button
                  className='btn-sm btn-secondary btn-block disabled'
                  disabled='True'
                >
                  Loading...
                </button>
              )}
            </div>
            <div className='col-6 px-1'>
              {disabledMore === true && (
                <button className='btn-sm btn-block' disabled='True'>
                  More &#8594;
                </button>
              )}
              {disabledMore === false && (
                <Link
                  to={`/autosubmitapp/experiment/${name}`}
                  className='btn btn-outline-primary btn-block btn-sm'
                >
                  More
                </Link>
              )}
            </div>
            <div className='col-3 px-1'>
              <Link
                to={`/autosubmitapp/experiment/${name}/light`}
                className='btn btn-outline-success btn-block btn-sm'
              >
                Quick
              </Link>
            </div>
            {summaries[name] && summaries[name].error === true && (
              <div className='col-12 pt-2' id={name}>
                <div className='card card-body py-0 scroll-x'>
                  <div className='row text-left'>
                    <div className='col-md-12'>
                      <div className='small'>
                        <strong>ERROR: {summaries[name].error_message}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {summaries[name] && summaries[name].error === false && (
              <div className='col-12 pt-2' id={name}>
                <div className='card card-body py-0 scroll-x'>
                  <div className='row text-left'>
                    <div className='col-md-12'>
                      <small>
                        All : avg. queue{" "}
                        <strong>{summaries[name].avg_queue_time}</strong> | run{" "}
                        <strong>{summaries[name].avg_run_time}</strong>
                      </small>
                    </div>
                  </div>
                  {summaries[name].sim_queue_considered > 0 && (
                    <div className='row text-left'>
                      <div className='col-md-12'>
                        <small>
                          SIM {" ("}
                          {summaries[name].n_sim}
                          {") "} : avg. queue{" "}
                          <strong>{summaries[name].avg_sim_queue_time}</strong>{" "}
                          {" ("}
                          {summaries[name].sim_queue_considered}
                          {") "}| run{" "}
                          <strong>{summaries[name].avg_sim_run_time}</strong>
                          {" ("}
                          {summaries[name].sim_run_considered}
                          {")"}
                        </small>
                      </div>
                    </div>
                  )}
                  <div className='row pb-2'>
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
                      <div className='col-md-2 text-center px-2'>
                        <span className='badge badge-danger'>
                          Failed: {summaries[name].n_failed}
                        </span>
                      </div>
                      <div className='col-md-10 text-left'>
                        <div
                          className=''
                          style={{ overflow: "auto", maxHeight: "200px" }}
                        >
                          <small>
                            <ol>
                              {summaries[name].failed_jobs.map((item) => (
                                <li key={item}>{item}</li>
                              ))}
                            </ol>
                          </small>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <p className='card-text text-center'>
            <small className='text-muted'>{version}</small>
          </p>
        </div>
      </div>
    </div>
  );
};

ExperimentItem.propTypes = {
  experiment: PropTypes.object.isRequired,
};

export default ExperimentItem;
