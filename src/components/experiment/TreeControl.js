import React, { useContext } from "react";
import ExperimentContext from "../context/experiment/experimentContext";

const TreeControl = () => {
  const experimentContext = useContext(ExperimentContext);
  const {
    experiment,
    treedata,
    getExperimentTree,
    cleanTreeData,
    enabledGraphSearch,
    getExperimentTreePkl,
    loadingTreeRefresh,
    experimentRunning,
    setAutoUpdateTreePkl,
    startAutoUpdateTreePkl
  } = experimentContext;

  const onSubmitTree = e => {
    e.preventDefault();
    getExperimentTree(experiment.expid);
  };

  const onClearTree = e => {
    e.preventDefault();
    cleanTreeData();
  };

  const onRequestUpdate = e => {
    e.preventDefault();
    getExperimentTreePkl(experiment.expid, experiment.pkl_timestamp);
  };

  const onJobMonitor = e => {
    e.preventDefault();
    setAutoUpdateTreePkl(true);
  };

  const onNotJobMonitor = e => {
    e.preventDefault();
    setAutoUpdateTreePkl(false);
  };

  return (
    <div className='card-header p-1'>
      <div className='row justify-content-end'>
        {loadingTreeRefresh && (
          <div className='col-md-8 text-left'>Querying...</div>
        )}
        <div className='col-md-2'>
          {experiment && !treedata && (
            <form onSubmit={onSubmitTree} className='form'>
              <input
                type='submit'
                value='Show Tree View'
                className='btn btn-info btn-block btn-sm'
                disabled={!enabledGraphSearch}
              />
            </form>
          )}
          {experiment && treedata && (
            <form onSubmit={onClearTree} className='form'>
              <input
                type='submit'
                value='Clear Tree View'
                className='btn btn-secondary btn-block btn-sm'
                disabled={!enabledGraphSearch}
              />
            </form>
          )}
        </div>
        {experiment && treedata && experimentRunning && (
          <div className='col-md-2'>
            <form onSubmit={onRequestUpdate} className='form'>
              <input
                type='submit'
                value='Refresh'
                className='btn btn-success btn-block btn-sm'
                disabled={!enabledGraphSearch}
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
                disabled={!enabledGraphSearch}
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
                disabled={!enabledGraphSearch}
              />
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default TreeControl;
