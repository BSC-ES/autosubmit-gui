import React, { useContext } from "react";
import ExperimentContext from "../context/experiment/experimentContext";
import GraphContext from "../context/graph/graphContext";
import TreeContext from "../context/tree/treeContext";
import { exportHistoryToCSV, openIconHistory } from "../context/utils";

const JobHistory = ({ source }) => {
  const experimentContext = useContext(ExperimentContext);
  const graphContext = useContext(GraphContext);
  const treeContext = useContext(TreeContext);
  const { experiment, jobHistory, getJobHistory } = experimentContext;
  const { selection } = graphContext;
  const { selectedTreeNode } = treeContext;
  const { db_historic_version, expid } = experiment;
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
    getJobHistory(expid, selectedJob);
  };

  const onExport = (jobName) => (e) => {
    e.preventDefault();    
    const columnNames = ["Counter","JobId","Submit","Start","Finish","Queue","Run","Status","Energy","Wallclock","NCpus","Nnodes"];    
    exportHistoryToCSV(jobHistory.history,columnNames,jobName+"_history.csv");        
  }

  const dataTarget = "history-" + source;

  if (
    experiment &&
    selectedJob &&
    db_historic_version &&
    db_historic_version >= 12
  ) {
    return (
      <span>
        <span className="p-0 m-0" data-toggle='tooltip' data-placement='bottom' title="Shows information from previous runs of the job." >
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
                &nbsp;
                {jobHistory && jobHistory.history && jobHistory.history.length > 0 &&                
                <button type="button" className="btn btn-sm btn-primary" onClick={onExport(selectedJob)}data-toggle='tooltip' data-placement='right' title='Export data table to CSV format file.'><i className="fas fa-file-export"></i></button>
                }                
                <button
                  className='close'
                  type='button'
                  data-dismiss='modal'
                  aria-label='Close'
                >
                  <span aria-hidden='true'>&times;</span>
                </button>
              </div>
              <div className='modal-body scroll-x-table'>
                {jobHistory && jobHistory.history && (
                  <table className='table'>
                    <thead>
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
                        <th scope='col'>SYPD</th>
                        <th scope='col'>ASYPD</th>
                        <th scope='col'>Wallclock</th>
                        <th scope='col'>NCpus</th>
                        <th scope='col'>NNodes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {jobHistory.history.map((item) => (
                        <tr key={item.counter}>
                          <td>{item.run_id}</td>
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
                          <td>{item.energy}</td>
                          <td>{item.SYPD}</td>
                          <td>{item.ASYPD}</td>
                          <td>{item.wallclock}</td>
                          <td>{item.ncpus}</td>
                          <td>{item.nodes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
                {jobHistory && jobHistory.history.length === 0 && (
                  <p>
                    There is no historic data for this job. Are you running the
                    latest version of Autosubmit that implements the historic
                    database?
                  </p>
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
