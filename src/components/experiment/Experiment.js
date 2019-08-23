import React, { useEffect, useContext, Fragment } from "react";
import Spinner from "../layout/Spinner";
import { Link } from "react-router-dom";
import ExperimentContext from '../context/experiment/experimentContext';

const Experiment = ({ expidToken }) => {
  const experimentContext = useContext(ExperimentContext); 
  const { getExperiment, 
        getExperimentGraph, 
        setAutoUpdatePkl, 
        loading, 
        experiment, 
        enabledGraphSearch, 
        data, 
        startAutoUpdatePkl,
        setAutoUpdateRun, 
        startAutoUpdateRun } = experimentContext;

  useEffect(() => {
    getExperiment(expidToken);
    // eslint-disable-next-line
  }, []);
  
  const onSubmit = e => {
    e.preventDefault();
    getExperimentGraph(experiment.expid);
  };

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
  };

  const onStopSubmitRun = e => {
    e.preventDefault();
    setAutoUpdateRun(false);
  };

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
    running,
    error,
    error_message,
    pkl_timestamp,
    model, 
    branch, 
    hpc
  } = experiment;

  if (loading)  return <Spinner />;

  return (
    <div>
      <div className="row">
        <div className="col">
          <Link to='/' className='btn btn-light'>
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
                {running && <span className='badge badge-success text-right'>RUNNING</span>}
                {!running && <span className='badge badge-danger text-right'>NOT RUNNING</span>}
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
                <div className='col-4'>
                  <form onSubmit={onSubmit} className='form'>
                    <input
                      type='submit'
                      value='Show Graph'
                      className='btn btn-info btn-block btn-sm'
                      disabled={!enabledGraphSearch}
                    />
                  </form>
                </div>   
                <div className="col-4">
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
                        className='btn btn-danger btn-sm btn-block'
                        // disabled={!enabledGraphSearch}
                        />
                      </form>
                    }
                </div>       
                <div className='col-4'>
                  {running && data && !startAutoUpdatePkl &&
                    <form onSubmit={onJobMonitor} className='form'>
                      <input
                        type='submit'
                        value='Start Job Monitor'
                        className='btn btn-dark btn-block btn-sm'
                        disabled={!enabledGraphSearch}
                      />
                  </form>
                  }
                  {running && data && startAutoUpdatePkl &&
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
     
         
      
    </div>
  );
}


export default Experiment;
