import React, { useContext } from "react";
import ExperimentContext from "../context/experiment/experimentContext";
import TreeContext from "../context/tree/treeContext";
import SelectionControl from "./SelectionControl";
import JobSummary from "./JobSummary";
import { buildWarningInactiveMessageTree } from "../context/utils";

const TreeControl = () => {
  const experimentContext = useContext(ExperimentContext);
  const treeContext = useContext(TreeContext);
  const { experiment, experimentRunning, getLogStatus, logTimeDiff, currentLog } = experimentContext;

  const {
    treedata,
    getExperimentTree,
    cleanTreeData,
    enabledTreeSearch,
    getExperimentTreePkl,
    loadingTreeRefresh,
    setAutoUpdateTreePkl,
    startAutoUpdateTreePkl,
    loadingTreePkl,
    currentRunIdOnTree,
    warningActive,    
  } = treeContext;
  
  // useEffect(() => {
  //   if (treedata){      
  //     setWarningActive();
  //   }
  //   //}
    
  //   // return () => {
  //   //   cleanup
  //   // }
  //   // eslint-disable-next-line
  // }, [experimentRunning, treedata])

  const onSubmitTree = (e) => {
    e.preventDefault();
    getLogStatus(experiment.expid);
    getExperimentTree(experiment.expid, buildWarningInactiveMessageTree(experimentRunning, logTimeDiff, currentLog, treedata ? treedata.jobs : null));    
  };

  const onClearTree = (e) => {
    e.preventDefault();
    cleanTreeData();
  };

  const onRequestUpdate = (e) => {
    e.preventDefault();
    getLogStatus(experiment.expid);
    getExperimentTreePkl(experiment.expid, experiment.pkl_timestamp);
  };

  const onJobMonitor = (e) => {
    e.preventDefault();
    setAutoUpdateTreePkl(true);
  };

  const onNotJobMonitor = (e) => {
    e.preventDefault();
    setAutoUpdateTreePkl(false);
  };

  const disabledQuery = !enabledTreeSearch || loadingTreePkl;
  

  return (
    <div className='card-header p-1'>
      <div className='d-flex flex-wrap row-hl'>
        {currentRunIdOnTree && (
          <div className="mr-auto item-hl" >{currentRunIdOnTree.message}</div>
        )}        
        {(loadingTreeRefresh || loadingTreePkl) && (
          <div className='mr-auto item-hl'>Querying...</div>
        )}
        {warningActive && (
          <div className="mr-auto item-hl">
            <span
              className='px-2 bg-warning text-white rounded text-center ml-1'
              style={{ width: "100%" }}
              title={warningActive}
            >
              <strong>ACTIVE WARNING</strong>
            </span>
          </div>
        )}

        {experiment && !treedata && (
          <div className='item-hl ml-auto'>
            <form onSubmit={onSubmitTree} className='form'>
              <input
                type='submit'
                value='Show'
                className='btn btn-primary btn-block btn-sm'
                disabled={disabledQuery}
                data-toggle='tooltip' 
                data-placement='bottom' 
                title="Shows the Tree View representation of the experiment."
              />
            </form>
          </div>
        )}
        {experiment && treedata && (
          <div className='item-hl ml-auto'>
            <form onSubmit={onClearTree} className='form'>
              <input
                type='submit'
                value='Clear Tree'
                id='bs-tooltip'
                className='btn btn-dark btn-block btn-sm bs-tooltip'
                disabled={disabledQuery || startAutoUpdateTreePkl}
                data-toggle='tooltip' 
                data-placement='bottom' 
                title="Clears all the data from the Tree View."
              />
            </form>
          </div>
        )}

        {experiment && treedata && (
          <div className="item-hl pl-1">
            <JobSummary source="tree"/>
          </div>
        )}  

        {experiment && treedata && !currentRunIdOnTree && (
          <div className='item-hl px-1'>
            <SelectionControl />
          </div>
        )}
        <div className="item-hl">
          <div className="btn-group" role="group" aria-label="workflow-tree">
            {experiment &&
              treedata &&
              experimentRunning &&
              !startAutoUpdateTreePkl && !currentRunIdOnTree && (
                <button
                  type='button'
                  className='btn btn-success btn-sm'
                  disabled={disabledQuery}
                  onClick={onRequestUpdate}
                  data-toggle='tooltip' 
                  data-placement='bottom' 
                  title="Updates the Tree View job data (including status) with the most recent information."
                >
                  Refresh
                </button>
              )}
            {experimentRunning && treedata && !startAutoUpdateTreePkl && !currentRunIdOnTree && (
                <button
                  type='button'
                  className='btn btn-success btn-sm'
                  disabled={disabledQuery}
                  onClick={onJobMonitor}
                  data-toggle='tooltip' 
                  data-placement='bottom' 
                  title="Starts a worker that periodically updates the Tree View job data."
                >
                  Start Job Monitor
                </button>
            )}
            {experimentRunning && treedata && startAutoUpdateTreePkl && !currentRunIdOnTree && (
                  <button
                    type='button'
                    className='btn btn-danger btn-sm'
                    disabled={disabledQuery}
                    onClick={onNotJobMonitor}
                  >Stop Job Monitor</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreeControl;
