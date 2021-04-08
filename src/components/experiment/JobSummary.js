import React, { useContext } from 'react';
import ExperimentContext from '../context/experiment/experimentContext';
import TreeContext from '../context/tree/treeContext';
import GraphContext from '../context/graph/graphContext';
import { exportSummaryToCSV, groupByAndAggregate, secondsToDelta } from '../context/utils';

const JobSummary = ({ source }) => {
  const experimentContext  = useContext(ExperimentContext);
  const treeContext = useContext(TreeContext);
  const graphContext = useContext(GraphContext);
  let sourceNodes = null;
  let groupedNodes = [];
  let sourceData = [];
  const dataTarget = source+"summarymodal";
  if (source === "graph") {
    const { data } = graphContext;
    if (data) {
      sourceNodes = data.nodes;
      if (sourceNodes) {
        sourceNodes.map((item) => (item.status === "COMPLETED" || item.status === "RUNNING") && sourceData.push({"Name": item.id, "Queue": item.minutes_queue, "Run": item.minutes, "Status": item.status, "Section": item.section}));
        groupedNodes = groupByAndAggregate(sourceData, "Section");
        
      }      
    }    
  } else if (source === "tree") {
    const { treedata } = treeContext;
    if (treedata) {
      sourceNodes = treedata.jobs;
      if (sourceNodes) {
        sourceNodes.map((item) => (item.status === "COMPLETED" || item.status === "RUNNING") && sourceData.push({"Name": item.id, "Queue": item.minutes_queue, "Run": item.minutes, "Status": item.status, "Section": item.section}));
        groupedNodes = groupByAndAggregate(sourceData, "Section");
      }      
    }
  }

  const ExportDetail = (data, columns, title) => (e) => {
    e.preventDefault();
    exportSummaryToCSV(data, columns, title);
  }

  const ExportAggregated = (data, columns, title) => (e) => {
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
                Summary data for <strong>{expid}</strong><p><small><span className='text-muted'>Queue and Run in <strong>seconds</strong> when <strong>exported</strong>, <span className="badge badge-primary">blue</span> button. Only COMPLETED or RUNNING jobs are listed.</span></small></p>
              </h5>
                            
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
              {groupedNodes && (
                <div>
                  Aggregated by Job <strong>Section</strong>.
                  &nbsp;
                  {groupedNodes && groupedNodes.length > 0 && 
                    <button type="button" className="btn btn-sm btn-primary" onClick={ExportAggregated(groupedNodes, ["Section","Count", "SumQueue", "AverageQueue", "SumRun", "AverageRun"], "summaryaggregated_"+expid)} data-toggle='tooltip' data-placement='left' title='Export data table to CSV format file.'><i className="fas fa-file-export"></i></button>
                  }
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope='col'>Section</th>
                        <th scope='col' className="text-right">Count</th>
                        <th scope='col' className="text-right">Queue Sum</th>
                        <th scope='col' className="text-right">Average Queue</th>
                        <th scope='col' className="text-right">Run Sum</th>                        
                        <th scope='col' className="text-right">Average Run</th>                        
                      </tr>
                    </thead>
                    <tbody>
                      {groupedNodes.map((item) => (
                        <tr key={item.Section}>
                          <td><strong>{item.Section}</strong></td>
                          <td className="text-right">{item.Count}</td> 
                          <td className="text-right">{secondsToDelta(item.SumQueue)}</td>
                          <td className="text-right">{secondsToDelta(item.AverageQueue)}</td>
                          <td className="text-right">{secondsToDelta(item.SumRun)}</td>
                          <td className="text-right">{secondsToDelta(item.AverageRun)}</td>                                          
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}                      
              {sourceData && (
                <div>
                  List of jobs.
                  &nbsp;
                  {sourceData && sourceData.length > 0 &&                
                  <button type="button" className="btn btn-sm btn-primary" onClick={ExportDetail(sourceData, ["Name","Queue", "Run", "Status"], "summary_"+expid)} data-toggle='tooltip' data-placement='left' title='Export data table to CSV format file.'><i className="fas fa-file-export"></i></button>
                  }  
                  <table className='table'>
                    <thead>
                      <tr>
                        <th scope='col'>JobName</th>
                        <th scope='col' className="text-right">Queue</th>
                        <th scope='col' className="text-right">Run</th>
                        <th scope='col'>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sourceData.map((item) => (
                        <tr key={item.Name}>
                          <td>{item.Name}</td>
                          <td className="text-right">{secondsToDelta(item.Queue)}</td>
                          <td className="text-right">{secondsToDelta(item.Run)}</td>
                          <td>{item.Status}</td>                        
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
