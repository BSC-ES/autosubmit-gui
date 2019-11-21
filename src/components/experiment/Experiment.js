import React, { useEffect, useContext, Fragment } from "react";
import Spinner from "../layout/Spinner";
import { Link } from "react-router-dom";
import ExperimentContext from '../context/experiment/experimentContext';

const Experiment = ({ expidToken, refTree }) => {
  const experimentContext = useContext(ExperimentContext); 
  const { getExperiment, 
        getExperimentGraph, 
        getExperimentTree,
        setAutoUpdatePkl, 
        cleanTreeData,
        loading, 
        loadingState,
        experiment, 
        experimentRunning,
        enabledGraphSearch, 
        data, 
        treedata,
        startAutoUpdatePkl,
        setAutoUpdateRun, 
        startAutoUpdateRun,
        getRunningState} = experimentContext;

  useEffect(() => {
    getExperiment(expidToken);
    getRunningState(expidToken);
    // eslint-disable-next-line
  }, []);
  
  const onSubmitGraph = e => {
    e.preventDefault();
    getExperimentGraph(experiment.expid);
    window.showGraphTab();
  };

  const onSubmitTree = e => {
    e.preventDefault();
    getExperimentTree(experiment.expid);
    // refTree.current.tab('show');
    // var object = this.refs.treeview;
    // object.tab('show');
    window.showTreeTab();
  };

  // const onClearGraph = e => {
  //   e.preventDefault();
  //   cleanGraphData();
  // }

  const onClearTree = e => {
    e.preventDefault();
    cleanTreeData();
  }

  const onJobMonitor = e => {
    e.preventDefault();
    setAutoUpdatePkl(true);
  }

  const onNotJobMonitor = e => {
    e.preventDefault();
    setAutoUpdatePkl(false);

  }

  const onSubmitRun = e => {
    e.preventDefault();
    setAutoUpdateRun(true);
    window.showLogTab();
  };

  const onStopSubmitRun = e => {
    e.preventDefault();
    setAutoUpdateRun(false);
  };

  // const onSubmitGroup = mode => e => {
  //   e.preventDefault();
  //   getExperimentGraphGrouped(experiment.expid, mode);
  // };
  


  // const cleanParentLocal = () => {
  //   console.log('Exp clean ')
  //   cleanParent();
  // };

  const {
    expid,
    owner,
    owner_id,
    path,
    time_last_access,
    time_last_mod,
    description,
    version,
    updateTime,
    error,
    error_message,
    pkl_timestamp,
    model, 
    branch, 
    hpc,
    isGrouped,
  } = experiment;

  if (loading)  return <Spinner />;

  return (
    <div>
      <div className="row">
        <div className="col">
          <Link to='/autosubmitapp/' className='btn btn-light'>
            Back To Search
          </Link>    
        </div>        
      </div>
      <br></br>
      <div className="row">
        <div className="col-12">
        <div className="card">
          <div className='card-header pt-1 pb-0'>
            <div className='row'>
              <div className='col-8 text-left'>
                <h3 className="font-weight-bold">{expid}</h3>
              </div>
              <div className='col-4 text-right'>
                {loadingState && <span className='badge badge-dark text-right'>LOADING...</span>}
                {experimentRunning && !loadingState && <span className='badge badge-success text-right'>RUNNING</span>}
                {!experimentRunning && !loadingState && <span className='badge badge-secondary text-right'>NOT RUNNING</span>}
              </div>
            </div>
          </div>
          <div className='card-text'>
            <div className="row px-3 py-0">
              <div className='col-4'>
                <div><small>{description}</small></div>
                {error && <pre className="text-danger">{error_message}</pre>}
                <div><span>Version: {version}</span></div>
                <div></div>
              </div>

              <div className='col-4'>
                <div><small className='font-weight-bold'>Owner:</small> {owner_id} {owner}</div>
                <div><small className='font-weight-bold'>Path:</small> {path}</div>
                <div><small>SleepTime: {updateTime}</small></div>  
              </div>   
              <div className='col-4'>
                  <div><small className='font-weight-bold'>Last Modified:</small> {time_last_mod}</div>
                  <div><small className='font-weight-bold'>Last Access:</small> {time_last_access}</div>
                  {pkl_timestamp && <Fragment>
                    <div><small className='font-weight-bold'>Pkl:</small> {pkl_timestamp}</div>
                  </Fragment>
                    
                  } 
                
              </div>
            </div>
          </div> 
          <div className="card-footer p-1 text-muted text-center">
            <div className="row">
                <div className="col-md-4">
                    <small><strong>Model:</strong> {model}</small>
                </div>
                <div className="col-md-4">
                    <small><strong>Branch:</strong> {branch}</small>
                </div>
                <div className="col-md-4">
                    <small><strong>Hpc:</strong> {hpc}</small>
                </div>                
            </div>    
          </div>
          <div className='card-footer p-1'>
            <div className='row'>
                <div className='col-md-2'>
                    <form onSubmit={onSubmitGraph} className='form'>
                      <input
                        type='submit'
                        value='Show Graph'
                        className='btn btn-info btn-block btn-sm'
                        disabled={!enabledGraphSearch}
                      />
                    </form>
                </div>
                <div className='col-md-2'>
                  {experiment && !treedata &&
                    <form onSubmit={onSubmitTree} className='form'>
                      <input
                        type='submit'
                        value='Show Tree View'
                        className='btn btn-info btn-block btn-sm'
                        disabled={!enabledGraphSearch}
                      />
                    </form>
                  }
                  {experiment && treedata && 
                    <form onSubmit={onClearTree} className='form'>
                      <input
                        type='submit'
                        value='Clear Tree View'
                        className='btn btn-secondary btn-block btn-sm'
                        disabled={!enabledGraphSearch}
                      />
                    </form>
                  }
                  
                </div>
               
                {/* <div className='col-md-2'>
                  <button className="btn btn-info btn-block btn-sm" data-toggle="modal" data-target="#grouptype" disabled={!enabledGraphSearch}>
                      Group By
                  </button>
                </div>    */}
                <div className="col-md-2">
                    {experiment && !startAutoUpdateRun &&
                      <form onSubmit={onSubmitRun} className='form'>
                        <input
                        type='submit'
                        value='Show Log'
                        className='btn btn-dark btn-sm btn-block'
                        // disabled={!enabledGraphSearch}
                        />
                      </form>
                    }
                    {experiment && startAutoUpdateRun &&
                      <form onSubmit={onStopSubmitRun} className='form'>
                        <input
                        type='submit'
                        value='Hide Log'
                        className='btn btn-secondary btn-sm btn-block'
                        // disabled={!enabledGraphSearch}
                        />
                      </form>
                    }
                </div>       
                <div className='col-md-4'>
                  {experimentRunning && data && !startAutoUpdatePkl && !isGrouped &&
                    <form onSubmit={onJobMonitor} className='form'>
                      <input
                        type='submit'
                        value='Start Job Monitor'
                        className='btn btn-dark btn-block btn-sm'
                        disabled={!enabledGraphSearch}
                      />
                  </form>
                  }
                  {experimentRunning && data && startAutoUpdatePkl &&
                    <form onSubmit={onNotJobMonitor} className='form'>
                      <input
                        type='submit'
                        value='Stop Job Monitor'
                        className='btn btn-danger btn-block btn-sm'
                        disabled={!enabledGraphSearch}
                      />
                  </form>
                  }
                </div>
                
              </div>
          </div>  
          
        </div>
        </div>
      </div>
      {/* <div className="modal fade" id="grouptype" tabIndex="-1" role='dialog' aria-labelledby='grouptypeTitle' aria-hidden='true'>
          <div className="modal-dialog" role="document">
              <div className="modal-content">
                  <div className="modal-header">
                      <h5 className="modal-title" id="grouptypeTitle">
                          Select your grouping option
                      </h5>
                      <button className="close" type="button" data-dismiss='modal' aria-label='Close'>
                          <span aria-hidden='true'>&times;</span>
                      </button>
                  </div>
                  <div className="modal-body">
                    <div className="row">
                      <div className="col-md-3">
                      <form onSubmit={onSubmitGroup('automatic')} className='form'>
                          <input
                            type='submit'
                            value='Automatic'
                            className='btn btn-info btn-block btn-sm'
                            disabled={!enabledGraphSearch}
                          />
                      </form>
                      </div>
                      <div className="col-md-3">
                      <form onSubmit={onSubmitGroup('date')} className='form'>
                          <input
                            type='submit'
                            value='Date'
                            className='btn btn-info btn-block btn-sm'
                            disabled={!enabledGraphSearch}
                          />
                      </form>
                      </div>
                      <div className="col-md-3">
                      <form onSubmit={onSubmitGroup('member')} className='form'>
                          <input
                            type='submit'
                            value='Member'
                            className='btn btn-info btn-block btn-sm'
                            disabled={!enabledGraphSearch}
                          />
                      </form>
                      </div> 
                      <div className="col-md-3">
                      <form onSubmit={onSubmitGroup('chunk')} className='form'>
                          <input
                            type='submit'
                            value='Chunk'
                            className='btn btn-info btn-block btn-sm'
                            disabled={!enabledGraphSearch}
                          />
                      </form>
                      </div>                        
                    </div>
                      
                  </div>
                  <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                  </div>
              </div>
          </div>
      </div> */}
    </div>
    
  );
}


export default Experiment;
