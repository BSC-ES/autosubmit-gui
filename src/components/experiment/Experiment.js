import React, { useEffect, useContext } from "react";
import Spinner from "../layout/Spinner";
import { Link } from "react-router-dom";
import ExperimentContext from "../context/experiment/experimentContext";

const Experiment = ({ expidToken, refTree }) => {
  //console.log(expidToken);
  const experimentContext = useContext(ExperimentContext);
  const {
    getExperiment,
    getExperimentTree,
    loading,
    loadingState,
    experiment,
    experimentRunning,
    getRunningState
  } = experimentContext;
  //var interval;

  useEffect(() => {
    getExperiment(expidToken);
    getRunningState(expidToken);
    getExperimentTree(expidToken);
    setInterval(() => getRunningState(expidToken), 300000);
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
    error_message
    // pkl_timestamp,
    // model,
    // branch,
    // hpc,
    //isGrouped,
  } = experiment;

  if (loading) return <Spinner />;

  return (
    <div>
      <div className='row'>
        <div className='col-md-1 pr-0'>
          <Link to='/autosubmitapp/' className='btn btn-light'>
            <small>Back To Search</small>
          </Link>
        </div>
        <div className='col-md-11'>
          <div className='card'>
            <div className='card-header pt-1 pb-0'>
              <div className='row'>
                <div className='col-10 text-left'>
                  <strong className='h3 font-weight-bold'>{expid}</strong>{" "}
                  {description}{" "}
                  {error && <pre className='text-danger'>{error_message}</pre>}
                </div>
                <div className='col-2 text-right'>
                  {loadingState && (
                    <span className='badge badge-dark text-right'>
                      LOADING...
                    </span>
                  )}
                  {experimentRunning && !loadingState && (
                    <span className='badge badge-success text-right'>
                      RUNNING
                    </span>
                  )}
                  {!experimentRunning && !loadingState && (
                    <span className='badge badge-secondary text-right'>
                      NOT RUNNING
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Experiment;
