import React, { useContext, Fragment } from "react";
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
                      ? "progress-bar progress-bar-striped progress-bar-animated bg-success"
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
          <h6 className='card-subtitle text-muted pt-2'>Owner: {user}</h6>
          <p className='card-text'>{description}</p>
          <div className='row'>
            <div className='col-3'>
              <form onSubmit={onGetSummary} className='form'>
                <input
                  className='btn btn-outline-info'
                  type='submit'
                  value='Summary'
                  aria-controls={name}
                />
              </form>
            </div>
            <div className='col-9'>
              <Link
                to={`/autosubmitapp/experiment/${name}`}
                className='btn btn-outline-primary btn-block'
              >
                More
              </Link>
            </div>
            {summaries[name] && summaries[name].error === false && (
              <div className='col-12 pt-2' id={name}>
                <div className='card card-body'>
                  <Fragment>
                    <div className='row'>
                      <div className='col-md-6'>
                        Avg. Queue {summaries[name].avg_queue_time} min.
                      </div>
                      <div className='col-md-6'>
                        Avg. Run {summaries[name].avg_run_time} min.
                      </div>
                    </div>
                    <div className='row '>
                      {summaries[name].n_running > 0 && (
                        <div className='col-md-3 text-left pl-1'>
                          <span className='badge badge-success'>
                            Running: {summaries[name].n_running}
                          </span>
                        </div>
                      )}
                      {summaries[name].n_queuing > 0 && (
                        <div className='col-md-3 text-left pl-1'>
                          <span
                            className='badge'
                            style={{ backgroundColor: "pink" }}
                          >
                            Queuing: {summaries[name].n_queuing}
                          </span>
                        </div>
                      )}
                      {summaries[name].n_submitted > 0 && (
                        <div className='col-md-3 text-left pl-1'>
                          <span
                            className='badge'
                            style={{ backgroundColor: "cyan" }}
                          >
                            Submitted: {summaries[name].n_submitted}
                          </span>
                        </div>
                      )}
                      {summaries[name].n_suspended > 0 && (
                        <div className='col-md-3 text-left pl-1'>
                          <span
                            className='badge'
                            style={{ backgroundColor: "orange" }}
                          >
                            Suspended: {summaries[name].n_suspended}
                          </span>
                        </div>
                      )}
                    </div>

                    {summaries[name].n_failed > 0 && (
                      <div className='row'>
                        <div className='col-md-3 text-left pl-1'>
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
                              <li key={item}>{item}</li>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </Fragment>
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
