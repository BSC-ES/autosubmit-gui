import React, { useContext } from "react";
import ExperimentContext from "../context/experiment/experimentContext";
import TreeContext from "../context/tree/treeContext";
import { openIconHistory, creationDateToId } from "../context/utils";

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
                  &nbsp;&nbsp; Data from run {creationDateToId(String(currentRunIdOnTree.created), currentRunIdOnTree.runId)} is displayed in the Tree View.
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
              <div className='modal-body scroll-x'>
                {experimentRuns && experimentRuns.runs && (
                  <small>
                  <table className='table table-sm table-bordered'>
                    <thead className="thead-dark">
                      <tr>
                        <th scope='col' className=""></th>
                        <th scope='col' className="pl-2">RunId</th>
                        <th scope='col' className="pl-2">Created</th>
                        {/* <th scope='col'>Created</th> */}
                        <th scope='col' className="pl-2">Finish</th>
                        <th scope='col' className='text-right pr-2'>Submitted</th>
                        <th scope='col' className='text-right pr-2'>Queuing</th>
                        <th scope='col' className='text-right pr-2'>Running</th>
                        <th scope='col' className='text-right pr-2'>Failed</th>
                        <th scope='col' className='text-right pr-2'>Suspended</th>
                        <th scope='col' className='text-right pr-2'>Completed</th>
                        <th scope='col' className='text-right pr-2'>Total</th>
                        <th scope='col' className='text-right pr-2'>SYPD</th>
                        <th scope='col' className='text-right pr-2'>ASYPD</th>
                        <th scope='col' className='text-right pr-2'>ChunkUnit</th>
                        <th scope='col' className='text-right pr-2'>ChunkSize</th>
                      </tr>
                    </thead>
                    
                    <tbody>
                      {experimentRuns.runs.map((item) => (
                        <tr key={item.run_id}>
                          <td className="text-center"> 
                          {loadingPreviousRun && <span>...</span>}                         
                          {!loadingPreviousRun && (
                              <button className={currentRunIdOnTree && currentRunIdOnTree.runId === item.run_id ? 'btn btn-sm btn-success' : 'btn btn-sm btn-primary'} type='button' onClick={onGetExperimentRunDetail(item.run_id, item.created, item.finished, item.completed, item.total)}>
                              <i className="fas fa-eye"></i>
                              </button>
                          )}                          
                          </td>
                          <td className="pl-1 runIdtd">{creationDateToId(String(item.created), item.run_id)} <span className="bg-primary text-white rounded px-1">{item.run_id}</span></td>
                          <td className="pl-1">{item.created}</td>
                          <td className="pl-1">{item.finish}</td>
                          <td className='text-right pr-1'>{item.submitted}</td>
                          <td className='text-right pr-1'>{item.queuing}</td>
                          <td className='text-right pr-1'>{item.running}</td>
                          <td className='text-right pr-1'>{item.failed}</td>
                          <td className='text-right pr-1'>{item.suspended}</td>
                          <td className='text-right pr-1'>{item.completed}</td>
                          <td className='text-right pr-1'><strong>{item.total}</strong></td>
                          <td className='text-right pr-1'>{item.SYPD}</td>
                          <td className='text-right pr-1'>{item.ASYPD}</td>
                          <td className='text-right pr-1'>{item.chunk_unit}</td>
                          <td className='text-right pr-1'>{item.chunk_size}</td>
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
