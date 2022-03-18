import React, { useContext, useRef } from "react";
import ExperimentContext from "../context/experiment/experimentContext";
import GraphContext from "../context/graph/graphContext";
import TreeContext from "../context/tree/treeContext";
import {
  exportHistoryToCSV,
  openIconHistory,
  creationDateToId,
  logIconLeft,
  logIconRight,
  formatNumberMoney,
} from "../context/utils";
import { SHOW_PERFORMANCE_TAB } from "../context/vars";

const JobHistory = ({ source }) => {
  const experimentContext = useContext(ExperimentContext);
  const graphContext = useContext(GraphContext);
  const treeContext = useContext(TreeContext);
  const { experiment, jobHistory, getJobHistory } = experimentContext;
  const { selection } = graphContext;
  const { selectedTreeNode } = treeContext;

  const currentPath = useRef("");

  const setCurrentPath = (path) => {
    if (currentPath.current) currentPath.current.innerHTML = path;
  };

  if (experiment) {
    var { db_historic_version, expid } = experiment;
  }

  const selectedJob =
    source === "tree"
      ? selectedTreeNode
        ? selectedTreeNode.node.refKey
        : null
      : source === "graph"
      ? selection && selection.length > 0
        ? selection[0]
        : null
      : null;

  const onGetJobHistory = (e) => {
    e.preventDefault();
    if (expid) {
      getJobHistory(expid, selectedJob);
    }
  };

  const onExport = (jobName) => (e) => {
    e.preventDefault();

    const columnNames = [
      "Counter",
      "JobId",
      "Submit",
      "Start",
      "Finish",
      "Queue",
      "Run",
      "Status",
      "Energy",
      "Wallclock",
      "NCpus",
      "Nnodes",
    ];
    exportHistoryToCSV(
      jobHistory.history,
      columnNames,
      jobName + "_history.csv"
    );
  };

  const dataTarget = "history-" + source;

  if (
    experiment &&
    selectedJob &&
    db_historic_version &&
    db_historic_version >= 12
  ) {
    setCurrentPath("");
    return (
      <span>
        <span
          className='p-0 m-0'
          data-toggle='tooltip'
          data-placement='bottom'
          title='Shows information from previous runs of the job.'
        >
          <button
            className='btn btn-sm btn-info my-0 py-0'
            type='button'
            onClick={onGetJobHistory}
            data-toggle='modal'
            data-target={"#" + dataTarget}
          >
            {openIconHistory}
          </button>
        </span>
        <div
          className='modal fade text-dark'
          id={dataTarget}
          tabIndex='-1'
          role='dialog'
          aria-labelledby={dataTarget + "Title"}
          aria-hidden='true'
        >
          <div className='modal-dialog modal-dialog-historic' role='document'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h5 className='modal-title' id={dataTarget + "Title"}>
                  Historical data for <strong>{selectedJob}</strong>
                </h5>

                {jobHistory &&
                  jobHistory.history &&
                  jobHistory.history.length > 0 && (
                    <button
                      type='button'
                      className='btn btn-sm btn-primary ml-2'
                      onClick={onExport(selectedJob)}
                      data-toggle='tooltip'
                      data-placement='right'
                      title='Export data table to CSV format file.'
                    >
                      <i className='fas fa-file-export'></i>
                    </button>
                  )}
                <button
                  className='close'
                  type='button'
                  data-dismiss='modal'
                  aria-label='Close'
                >
                  <span aria-hidden='true'>&times;</span>
                </button>
              </div>
              &nbsp;
              <div ref={currentPath}></div>
              <div className='modal-body scroll-x'>
                {jobHistory && jobHistory.history && (
                  <table className='table table-sm table-bordered list-table'>
                    <thead className='thead-dark'>
                      <tr>
                        <th scope='col'>RunId</th>
                        <th scope='col'>Counter</th>
                        <th scope='col'>JobId</th>
                        {/* <th scope='col'>Created</th> */}
                        <th scope='col'>Submit</th>
                        <th scope='col'>Start</th>
                        <th scope='col'>Finish</th>
                        <th scope='col'>Queue</th>
                        <th scope='col'>Run</th>
                        <th scope='col'>Status</th>
                        <th scope='col'>Energy</th>
                        {SHOW_PERFORMANCE_TAB && <th scope='col'>SYPD</th>}
                        {SHOW_PERFORMANCE_TAB && <th scope='col'>ASYPD</th>}
                        <th scope='col'>Wallclock</th>
                        <th scope='col'>NCpus</th>
                        <th scope='col'>NNodes</th>
                        <th scope='col'>out</th>
                        <th scope='col'>err</th>
                      </tr>
                    </thead>
                    <tbody>
                      {jobHistory.history.map((item) => (
                        <tr key={item.counter}>
                          <td className='runIdtd'>
                            {creationDateToId(
                              String(item.run_created),
                              item.run_id
                            )}{" "}
                            <span className='bg-primary text-white rounded px-1'>
                              {item.run_id}
                            </span>
                          </td>
                          <td>{item.counter}</td>
                          <td>{item.job_id}</td>
                          {/* <td>{item.created}</td> */}
                          <td>{item.submit}</td>
                          <td>{item.start}</td>
                          <td>{item.finish}</td>
                          <td>{item.queue_time}</td>
                          <td>
                            {item.run_time}{" "}
                            {item.run_time === "0:00:00" && (
                              <span
                                className='badge badge-warning'
                                data-toggle='tooltip'
                                data-placement='bottom'
                                title='This running time value usually means that there has been some error either on the completion of the job or in the historical database storage process.'
                              >
                                !
                              </span>
                            )}
                          </td>
                          <td>{item.status}</td>
                          <td>{formatNumberMoney(item.energy, true)}</td>
                          {SHOW_PERFORMANCE_TAB && (
                            <td>
                              {item.run_id ? (
                                item.SYPD
                              ) : (
                                <span
                                  className='badge badge-warning'
                                  data-toggle='tooltip'
                                  data-placement='bottom'
                                  title='This register is not associated to a run Id because it ran with an old version of the database, SYPD cannot be calculated.'
                                >
                                  !
                                </span>
                              )}
                            </td>
                          )}
                          {SHOW_PERFORMANCE_TAB && (
                            <td>
                              {item.run_id ? (
                                item.ASYPD
                              ) : (
                                <span
                                  className='badge badge-warning'
                                  data-toggle='tooltip'
                                  data-placement='bottom'
                                  title='This register is not associated to a run Id because it ran with an old version of the database, ASYPD cannot be calculated.'
                                >
                                  !
                                </span>
                              )}
                            </td>
                          )}
                          <td>{item.wallclock}</td>
                          <td>{formatNumberMoney(item.ncpus, true)}</td>
                          <td>{formatNumberMoney(item.nodes, true)}</td>
                          <td>
                            {item.out && item.out.length > 0 && (
                              <button
                                className='btn btn-sm btn-info'
                                onClick={() => {
                                  setCurrentPath(
                                    jobHistory.path_to_logs + "/" + item.out
                                  );
                                }}
                              >
                                {logIconLeft}
                              </button>
                            )}
                          </td>
                          <td>
                            {item.err && item.err.length > 0 && (
                              <button
                                className='btn btn-sm btn-warning'
                                onClick={() => {
                                  setCurrentPath(
                                    jobHistory.path_to_logs + "/" + item.err
                                  );
                                }}
                              >
                                {logIconRight}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
                {jobHistory &&
                  ((jobHistory.history && jobHistory.history.length === 0) ||
                    !jobHistory.history) && (
                    <p>
                      There is no historic data for this job. Are you running
                      the latest version of Autosubmit that implements the
                      historic database?
                    </p>
                  )}
                {jobHistory && jobHistory.error === true && (
                  <span className='error-message text-danger'>
                    {jobHistory.error_message}
                  </span>
                )}
              </div>
              <div className='modal-footer'>
                <button
                  type='button'
                  className='btn btn-secondary'
                  data-dismiss='modal'
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </span>
    );
  } else {
    return null;
  }
};

export default JobHistory;
