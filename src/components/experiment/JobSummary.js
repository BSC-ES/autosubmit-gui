import React, { useContext } from 'react';
import ExperimentContext from '../context/experiment/experimentContext';
import TreeContext from '../context/tree/treeContext';
import GraphContext from '../context/graph/graphContext';
import { exportSummaryToCSV } from '../context/utils';

const JobSummary = ({ source }) => {
  const experimentContext  = useContext(ExperimentContext);
  const treeContext = useContext(TreeContext);
  const graphContext = useContext(GraphContext);
  let sourceNodes = null;
  let sourceData = [];
  const dataTarget = source+"summarymodal";
  if (source === "graph") {
    const { data } = graphContext;
    if (data) {
      sourceNodes = data.nodes;
      if (sourceNodes) {
        sourceNodes.map((item) => (item.status === "COMPLETED" || item.status === "RUNNING") && sourceData.push({"Name": item.id, "Queue": item.minutes_queue, "Run": item.minutes, "Status": item.status}));
      }      
    }    
  } else if (source === "tree") {
    const { treedata } = treeContext;
    if (treedata) {
      sourceNodes = treedata.jobs;
      if (sourceNodes) {
        sourceNodes.map((item) => (item.status === "COMPLETED" || item.status === "RUNNING") && sourceData.push({"Name": item.id, "Queue": item.minutes_queue, "Run": item.minutes, "Status": item.status}));
      }      
    }
  }

  const Export = (data, columns, title) => (e) => {
    e.preventDefault();
    exportSummaryToCSV(data, columns, title);
  }

  const { experiment } = experimentContext;
  // const { expid } = experiment;

  if (experiment && sourceNodes && sourceNodes.length > 0){
    const { expid } = experiment;
    // Build data
    // let sourceData = [];
    return (
    <small>
      <button
          className='btn-sm btn-info'
          type='button'
          data-toggle='modal'                    
          data-target={"#" + dataTarget}
        >
          Summary
        {/* <i className='fas fa-history' data-toggle='tooltip' data-placement='bottom' title="Shows information from previous runs of the job." ></i> */}
      </button>
      <div
          className='modal fade text-dark'
          id={dataTarget}
          tabIndex='-1'
          role='dialog'
          aria-labelledby={dataTarget + "Title"}
          aria-hidden='true'
        >
      <div className='modal-dialog modal-dialog-summary' role='document'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h5 className='modal-title' id={dataTarget + "Title"}>
                Summary data for <strong>{expid}</strong><p><small><span className='text-muted'>Queue and Run are in seconds. Only COMPLETED or RUNNING jobs are listed.</span></small></p>
              </h5>
              &nbsp;
              {sourceData && sourceData.length > 0 &&                
              <button type="button" className="btn-sm btn-primary" onClick={Export(sourceData, ["JobName","Queue", "Run", "Status"], "summary_"+expid)} data-toggle='tooltip' data-placement='left' title='Export data table to CSV format file.'><i className="fas fa-file-export"></i></button>
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
            <div className='modal-body'>
              {sourceData && (
                <table className='table'>
                  <thead>
                    <tr>
                      <th scope='col'>JobName</th>
                      <th scope='col'>Queue (s.)</th>
                      <th scope='col'>Run (s.)</th>
                      <th scope='col'>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sourceData.map((item) => (
                      <tr key={item.Name}>
                        <td>{item.Name}</td>
                        <td>{item.Queue}</td>
                        <td>{item.Run}</td>
                        <td>{item.Status}</td>                        
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {sourceData && sourceData.length === 0 && (
                <p>
                  There are no RUNNING or COMPLETED jobs in this instance of the experiment.
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
    </small>
    );
  } 
  else{
    return null;
  }
  
}

export default JobSummary
