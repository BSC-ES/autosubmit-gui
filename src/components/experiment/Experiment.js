import React, { useEffect, useContext } from "react";
import Spinner from "../layout/Spinner";
import { Link } from "react-router-dom";
import ExperimentContext from '../context/experiment/experimentContext';

const Experiment = ({ expidToken, refTree }) => {
  //console.log(expidToken);
  const experimentContext = useContext(ExperimentContext); 
  const { getExperiment, 
        // getExperimentGraph, 
        getExperimentTree,
        //setAutoUpdatePkl, 
        //cleanTreeData,
        loading, 
        loadingState,
        experiment, 
        experimentRunning,
        //enabledGraphSearch, 
        //data, 
        //treedata,
        //startAutoUpdatePkl,
        // setAutoUpdateRun, 
        // startAutoUpdateRun,
        getRunningState} = experimentContext;

  useEffect(() => {
    getExperiment(expidToken);
    getRunningState(expidToken);
    getExperimentTree(expidToken);
    // eslint-disable-next-line
  }, []);
  
  if (experiment === null) return <Spinner />;

  const {
    expid,
    // owner,
    // owner_id,
    // path,
    // time_last_access,
    // time_last_mod,
    description,
    // version,
    // updateTime,
    error,
    error_message,
    // pkl_timestamp,
    // model, 
    // branch, 
    // hpc,
    //isGrouped,
  } = experiment;

  if (loading)  return <Spinner />;

  return (
    <div>
      <div className="row">
        <div className="col-md-1">
          <Link to='/autosubmitapp/' className='btn btn-light'>
            <small>Back To Search</small>
          </Link>    
        </div>                
        <div className="col-md-11">
          <div className="card">
            <div className="card-header pt-1 pb-0">
              <div className="row">
                <div className="col-10 text-left">
                  <strong className="h3 font-weight-bold">{expid}</strong> {description} {error && <pre className="text-danger">{error_message}</pre>}
                </div>
                <div className='col-2 text-right'>
                  {loadingState && <span className='badge badge-dark text-right'>LOADING...</span>}
                  {experimentRunning && !loadingState && <span className='badge badge-success text-right'>RUNNING</span>}
                  {!experimentRunning && !loadingState && <span className='badge badge-secondary text-right'>NOT RUNNING</span>}
                </div>
              </div>
            </div>
          </div>
          
        </div>       
      </div>
      {/* <br></br> */}
      {/* <div className="row">
        <div className="col-12">
        <div className="card">
          <div className='card-header pt-1 pb-0'>
            <div className='row'>
              <div className='col-8 text-left'>
                <h3 className="font-weight-bold">{expid}</h3>
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
        </div>
        </div>
      </div> */}
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
