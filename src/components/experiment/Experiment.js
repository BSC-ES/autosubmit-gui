import React, { useEffect, useContext } from "react";
import Spinner from "../layout/Spinner";
// import { Link } from "react-router-dom";
import ExperimentContext from "../context/experiment/experimentContext";

const Experiment = ({ expidToken }) => {
  //console.log(expidToken);
  const experimentContext = useContext(ExperimentContext);
  const {
    // getExperiment,
    getExperimentTree,
    loading,
    loadingState,
    experiment,
    experimentRunning,
    // getRunningState,
  } = experimentContext;
  //var interval;

  useEffect(() => {
    if (expidToken) {
      // getExperiment(expidToken);
      // getRunningState(expidToken);
      getExperimentTree(expidToken);
      // const interval = setInterval(() => getRunningState(expidToken), 300000);
      // return () => clearInterval(interval);
    }

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
    //description,
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

  if (loading) return <span>Loading...</span>;
  if (!expidToken) return <span></span>;
  return (
    <span className='navbar-brand ml-4'>
      <strong>{expid}</strong> {/* {description}{" "} */}
      {error && <pre className='text-danger'>{error_message}</pre>}{" "}
      {loadingState && (
        <span className='badge badge-dark text-right'>LOADING...</span>
      )}
      {experimentRunning && !loadingState && (
        <span className='badge badge-success text-right'>RUNNING</span>
      )}
      {!experimentRunning && !loadingState && (
        <span className='badge badge-secondary text-right'>NOT RUNNING</span>
      )}
    </span>
    // <div>
    //   <div className='row'>
    //     <div className='col-md-12'>
    //       <div className='card'>
    //         <div className='card-header pt-1 pb-0'>
    //           <div className='row'>
    //             <div className='col-10 text-left'>

    //             </div>
    //             <div className='col-2 text-right'>

    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
};

export default Experiment;
