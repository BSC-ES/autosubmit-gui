import React, { useContext } from "react";
import Spinner from "../layout/Spinner";
import ExperimentContext from '../context/experiment/experimentContext';

const ExperimentColumn = ({ expidToken, refTree }) => {
  //console.log(expidToken);
  const experimentContext = useContext(ExperimentContext); 
  const {loading, 
        experiment} = experimentContext;

  if (experiment === null) return <Spinner />;

  const {
    // expid,
    owner,
    owner_id,
    path,
    time_last_access,
    time_last_mod,
    // description,
    version,
    updateTime,
    // error,
    // error_message,
    // pkl_timestamp,
    // model, 
    branch, 
    hpc,
    //isGrouped,
  } = experiment;

  if (loading)  return <Spinner />;

  return (
    <div>
      <div className="row">
        <div className="col-12 pr-0">
        <div className="card">
          <div className='card-text m-2'>
            <div className="row">
                <div className="col-md-12">
                    <div><small className="font-weight-bold">Version:</small></div>
                    <div>{version}</div>
                    <div><small className='font-weight-bold'>Owner:</small></div>
                    <div>{owner_id} {owner}</div>
                    <div><small className='font-weight-bold'>Path:</small></div>
                    <div><small>{path}</small></div>
                    <div><small>SleepTime: {updateTime}</small></div>  
                    <div><small className='font-weight-bold'>Last Modified:</small></div>
                    <div>{time_last_mod}</div>
                    <div><small className='font-weight-bold'>Last Access:</small></div>
                    <div>{time_last_access}</div>
                </div>
                {/* <div><small>{description}</small></div> */}
                
                
                  {/* {pkl_timestamp && <Fragment>
                    <div><small className='font-weight-bold'>Pkl:</small> {pkl_timestamp}</div>
                  </Fragment>
                    
                  }  */}
                
              </div>
            </div>
          </div> 
          <div className="card-footer p-1 text-center">
            <div className="row">
                <div className="col-md-12">
                    {/* <small><strong>Model:</strong> {model}</small>                 */}
                    <div>
                        <small>Branch:</small>                                 
                    </div>
                    <div className="h4">
                        {branch}
                    </div>
                    <div>
                        <small>Hpc:</small> 
                    </div>
                    <div className="h4">
                        {hpc}
                    </div>
                </div>                
            </div>    
          </div>
          
        </div>
        </div>
      </div>   

    
  );
}


export default ExperimentColumn;
