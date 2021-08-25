import React, { Component } from "react";
//import PropTypes from "prop-types";
import { Link } from "react-router-dom";
//import ExperimentContext from "../context/experiment/experimentContext";
import { quickThreshold, completedColor, runningColor, failedColor, queueColor } from "../context/vars";
//import { render } from "react-dom";

export class ExperimentItem extends Component {
//   experiment: { name, description, user, hpc, status, completed, total, version },
// }) => {
  // const experimentContext = useContext(ExperimentContext);
  // const { getExperimentSummary, summaries, loadingSummary } = experimentContext;
  

  // const disabledMore = total >= quickThreshold ? true : false;

  shouldComponentUpdate(nextProps) {
    // console.log(nextProps.experiment.name);    
    // console.log('Next loading has name ' + nextProps.isLoading);
    // console.log(this.props.experiment.name);
    // console.log('Current loading has name ' + this.props.isLoading);
    return (nextProps.experiment !== this.props.experiment
      || nextProps.isLoading !== this.props.isLoading);
  }

  render() {    
    const { experiment, getExperimentSummary, summaries, isLoading } = this.props;

    if (!experiment) {
      return null;
    }

    const { name, description, user, hpc, status, completed, total, version, wrapper, queuing, failed, running } = experiment;
    
    const onGetSummary = (name) => (e) => {
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
              <div className="row-hl d-flex flex-wrap">
                <div className="item-hl">
                {queuing > 0 && <span className="badge" style={queueColor}>{queuing}</span>}
                {running > 0 && <span className="badge" style={runningColor}>{running}</span>}
                {failed > 0 && <span className="badge" style={failedColor}>{failed}</span>}
                {completed > 0 && <span className='badge' style={completedColor}>{completed}</span>}
                </div>
                <div className="item-hl ml-auto">
                {completed} / {total}
                </div>
              </div>
              <div className='progress border'>
                <div
                  className={
                    completed === total
                      ? "progress-bar bg-completed"
                      : status === "RUNNING"
                      ? ((summaries[name] && summaries[name].n_failed > 0) || failed > 0)
                        ? "progress-bar progress-bar-striped progress-bar-animated bg-danger"
                        : running > 0 ? "progress-bar progress-bar-striped progress-bar-animated bg-success" 
                          : queuing > 0 ? "progress-bar progress-bar-striped progress-bar-animated bg-queue" : "progress-bar bg-success"
                      : ((summaries[name] && summaries[name].n_failed > 0) || failed > 0)
                      ? "progress-bar bg-danger"
                      : running > 0 ? "progress-bar bg-success" 
                        : queuing > 0 ? "progress-bar bg-queue" : "progress-bar bg-info"
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
              {/* {queuing > 0 && <span className="rounded bg-queue px-1 py-0 float-right">{queuing}</span>} */}
            </div>
          </div>
        </div>
        <div className='card-body py-1'>
          {/* <h4 className="card-title"></h4> */}
          <div className="d-flex justify-content-between">
            <div>
              <h6 className='card-subtitle text-muted pt-2'>
                <span>Owner:</span> {user}
              </h6>
            </div>
            <div>
              <span className='text-muted'>HPC: {hpc}</span>
            </div>
          </div>          
          <p className='card-text py-1 mb-1'>
            <span>{description}</span>
          </p>
          <div className='row'>
            <div className='col-3 px-1'>
              {!isLoading && (
                // <form onSubmit={onGetSummary} className='form'>
                  <button
                    className={
                      summaries[name]
                        ? "btn btn-info btn-block btn-sm"
                        : "btn btn-primary btn-block btn-sm"
                    }
                    type='button'                    
                    onClick={onGetSummary(name)}
                    aria-controls={name}
                    data-toggle='tooltip' 
                    data-placement='bottom' 
                    title={summaries[name] ? "Updates the summary information." : "Shows a summary of the current progress of the experiment."}
                  >{summaries[name] ? "Refresh" : "Summary"}</button>
             
              )}
              {isLoading && (
                <button
                  className='btn btn-sm btn-secondary btn-block disabled'
                  disabled='True'
                >
                  Loading...
                </button>
              )}
            </div>
            <div className='col-3 px-1'>
              {disabledMore === true && (
                <button className='btn btn-sm btn-block' disabled='True'>
                  Tree &#8594;
                </button>
              )}
              {disabledMore === false && (
                <Link
                  to={`/autosubmitapp/experiment/${name}`}
                  className='btn btn-primary btn-block btn-sm'
                  data-toggle='tooltip' 
                  data-placement='bottom' 
                  title='Opens the experiment page where the Tree View representation is loaded by default.'
                >
                  Tree
                </Link>
              )}
            </div>
            <div className="col-3 px-1">
              {disabledMore === true && (
                <button className="btn btn-sm btn-block" disabled='True'>
                  Graph &#8594;
                </button>
              )}
              {disabledMore === false &&(
                <Link
                  to={`/autosubmitapp/experiment/${name}/graph`}
                  className='btn btn-primary btn-block btn-sm'
                  data-toggle='tooltip'
                  data-placement='bottom'
                  title='Opens the experiment page where the Graph View representation is loaded by default.'
                >
                  Graph
                </Link>
              )}
            </div>
            <div className='col-3 px-1'>
              <Link
                to={`/autosubmitapp/experiment/${name}/light`}
                className='btn btn-primary btn-block btn-sm'
                data-toggle='tooltip' 
                data-placement='bottom' 
                title='Opens the experiment page where a simple list of jobs and their status is presented. Loads quicker than the Tree View.'
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
            <span className='text-muted'>{version}</span>{wrapper && (<span className="px-1 ml-1 bg-secondary text-dark rounded">{wrapper} wrapper</span>)}
          </p>
        </div>
      </div>
    </div>)
  }
}

// ExperimentItem.propTypes = {
//   experiment: PropTypes.object.isRequired,
// };

export default ExperimentItem;
