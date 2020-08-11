import React, { useContext } from "react";
import ExperimentContext from "../context/experiment/experimentContext";
import TreeContext from "../context/tree/treeContext";
import SelectionControl from "./SelectionControl";

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
      <div className='row justify-content-end'>
        {(loadingTreeRefresh || loadingTreePkl) && (
          <div className='col text-left'>Querying...</div>
        )}
        {experiment && treedata && (
          <div className='col-md-2'>
            <SelectionControl />
          </div>
        )}
        {experiment && !treedata && (
          <div className='col-md-1'>
            <form onSubmit={onSubmitTree} className='form'>
              <input
                type='submit'
                value='Show'
                className='btn btn-info btn-block btn-sm'
                disabled={disabledQuery}
              />
            </form>
          </div>
        )}
        {experiment && treedata && !startAutoUpdateTreePkl && (
          <div className='col-md-1'>
            <form onSubmit={onClearTree} className='form'>
              <input
                type='submit'
                value='Clear Tree'
                className='btn btn-secondary btn-block btn-sm'
                disabled={disabledQuery}
              />
            </form>
          </div>
        )}
        {experiment &&
          treedata &&
          experimentRunning &&
          !startAutoUpdateTreePkl && (
            <div className='col-md-1'>
              <form onSubmit={onRequestUpdate} className='form'>
                <input
                  type='submit'
                  value='Refresh'
                  className='btn btn-success btn-block btn-sm'
                  disabled={disabledQuery}
                />
              </form>
            </div>
          )}
        {experimentRunning && treedata && !startAutoUpdateTreePkl && (
          <div className='col-md-2'>
            <form onSubmit={onJobMonitor} className='form'>
              <input
                type='submit'
                value='Start Job Monitor'
                className='btn btn-success btn-block btn-sm'
                disabled={disabledQuery}
              />
            </form>
          </div>
        )}
        {experimentRunning && treedata && startAutoUpdateTreePkl && (
          <div className='col-md-2'>
            <form onSubmit={onNotJobMonitor} className='form'>
              <input
                type='submit'
                value='Stop Job Monitor'
                className='btn btn-danger btn-block btn-sm'
                disabled={disabledQuery}
              />
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default TreeControl;
