import React, { useContext } from "react";
import ExperimentContext from "../context/experiment/experimentContext";
import TreeContext from "../context/tree/treeContext";
import { openIconHistory } from "../context/utils";

const  ExperimentRuns = () => {
  const experimentContext = useContext(ExperimentContext);
  const treeContext = useContext(TreeContext);
  const { experiment, experimentRuns, getExperimentRuns } = experimentContext;
  const { getExperimentRunJobData, fancyTree, startAutoUpdateTreePkl, loadingPreviousRun, currentRunIdOnTree } = treeContext;
  const { db_historic_version, expid } = experiment;

  const onGetExperimentRuns = (e) => {
    e.preventDefault();
    getExperimentRuns(expid);
  };

  const onGetExperimentRunDetail = (run_id, created, finished, completed, total) => (e) => {
    if(!fancyTree) {
      alert("The TreeView must be loaded before attempting to show previous runs.")
      return;
    }
    if(startAutoUpdateTreePkl === true){
      alert("Please stop the Job Monitor on the Tree View before querying for a previous run.");
      return;
    }
    // console.log("Querying " + run_id);
    e.preventDefault();
    const meta = {"created": created, "finished": finished, "completed": completed, "total": total};
    getExperimentRunJobData(expid, run_id, meta);
  }

  const dataTarget = "runs-" + expid;


  if (
    experiment &&
    db_historic_version &&
    db_historic_version >= 12
  ) {
    return (
      <span>
        
        <button
          className='btn btn-sm btn-info my-0 py-0'
          type='button'
          onClick={onGetExperimentRuns}
          data-toggle='modal'          
          data-target={"#" + dataTarget}          
        >
          <span data-toggle='tooltip' data-placement='bottom' title='Shows information from previous runs of the experiment.'>{openIconHistory}</span>
        </button>
        
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
                  Runs of <strong>{expid}</strong> <small className="text-muted">(The first row represents the current run.)</small>
                  {currentRunIdOnTree && !loadingPreviousRun &&                 
                <small>
                  &nbsp;&nbsp; Data from run {currentRunIdOnTree.runId} is displayed in the Tree View.
                </small>
                }
                {loadingPreviousRun && (
                  <small>
                    &nbsp;&nbsp; The data from the previous is being retrieved and processed...
                  </small>
                )}
                </h5>

                
                &nbsp;
                {/* {experimentRuns && experimentRuns.runs && experimentRuns.runs.length > 0 &&                
                <button type="button" className="btn-sm btn-primary" onClick={onExport(selectedJob)}><i className="fas fa-file-export"></i></button>
                }                 */}               
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
                {experimentRuns && experimentRuns.runs && (
                  <small>
                  <table className='table mb-0'>
                    
                    <thead>
                      <tr>
                        <th scope='col'></th>
                        <th scope='col'>RunId</th>
                        <th scope='col'>Created</th>
                        {/* <th scope='col'>Created</th> */}
                        <th scope='col'>Finish</th>
                        <th scope='col'>Submitted</th>
                        <th scope='col'>Queuing</th>
                        <th scope='col'>Running</th>
                        <th scope='col'>Failed</th>
                        <th scope='col'>Suspended</th>
                        <th scope='col'>Completed</th>
                        <th scope='col'>Total</th>
                        <th scope='col'>SYPD</th>
                        <th scope='col'>ASYPD</th>
                        <th scope='col'>ChunkUnit</th>
                        <th scope='col'>ChunkSize</th>
                      </tr>
                    </thead>
                    
                    <tbody>
                      {experimentRuns.runs.map((item) => (
                        <tr key={item.run_id}>
                          <td className="py-1"> 
                          {loadingPreviousRun && <span>...</span>}                         
                          {!loadingPreviousRun && (
                              <button className={currentRunIdOnTree && currentRunIdOnTree.runId === item.run_id ? 'btn btn-sm btn-success' : 'btn btn-sm btn-primary'} type='button' onClick={onGetExperimentRunDetail(item.run_id, item.created, item.finished, item.completed, item.total)}>
                              <i className="fas fa-eye"></i>
                              </button>
                          )}                          
                          </td>
                          <td>{item.run_id}</td>
                          <td>{item.created}</td>
                          <td>{item.finish}</td>
                          <td className='text-right'>{item.submitted}</td>
                          <td className='text-right'>{item.queuing}</td>
                          <td className='text-right'>{item.running}</td>
                          <td className='text-right'>{item.failed}</td>
                          <td className='text-right'>{item.suspended}</td>
                          <td className='text-right'>{item.completed}</td>
                          <td className='text-right'><strong>{item.total}</strong></td>
                          <td className='text-right'>{item.SYPD}</td>
                          <td className='text-right'>{item.ASYPD}</td>
                          <td className='text-right'>{item.chunk_unit}</td>
                          <td className='text-right'>{item.chunk_size}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  </small>
                )}
                {experimentRuns && experimentRuns.runs.length === 0 && (
                  <p>
                    There are not runs recorded for this experiment. Are you running the
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
}

export default ExperimentRuns
