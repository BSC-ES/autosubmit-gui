import React, { useContext } from "react";
import ExperimentContext from "../context/experiment/experimentContext";
import TreeContext from "../context/tree/treeContext";
import SelectionControl from "./SelectionControl";
import JobSummary from "./JobSummary";

const TreeControl = () => {
  const experimentContext = useContext(ExperimentContext);
  const treeContext = useContext(TreeContext);
  const { experiment, experimentRunning } = experimentContext;

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
  } = treeContext;

  const onSubmitTree = (e) => {
    e.preventDefault();
    getExperimentTree(experiment.expid);
  };

  const onClearTree = (e) => {
    e.preventDefault();
    cleanTreeData();
  };

  const onRequestUpdate = (e) => {
    e.preventDefault();
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

        {experiment && !treedata && (
          <div className='item-hl ml-auto'>
            <form onSubmit={onSubmitTree} className='form'>
              <input
                type='submit'
                value='Show'
                className='btn btn-primary btn-block btn-sm'
                disabled={disabledQuery}
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
                className='btn btn-dark btn-block btn-sm'
                disabled={disabledQuery || startAutoUpdateTreePkl}
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
                    >Refresh</button>
              )}
            {experimentRunning && treedata && !startAutoUpdateTreePkl && !currentRunIdOnTree && (
                  <button
                    type='button'
                    className='btn btn-success btn-sm'
                    disabled={disabledQuery}
                    onClick={onJobMonitor}
                  >Start Job Monitor</button>
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
