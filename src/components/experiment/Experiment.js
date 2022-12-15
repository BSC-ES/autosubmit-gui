import React, { useContext } from "react";
import Spinner from "../layout/Spinner";
// import { Link } from "react-router-dom";
import ExperimentContext from "../context/experiment/experimentContext";
import ExperimentRuns from "./ExperimentRuns";
import DescriptionModal from "./DescriptionModal";

const Experiment = ({ expidToken }) => {
  //console.log(expidToken);
  const experimentContext = useContext(ExperimentContext);
  const {
    loading,
    loadingState,
    experiment,
    experimentRunning,
    // getRunningState,
  } = experimentContext;
  //var interval;

  // useEffect(() => {
  //   if (expidToken) {
  //     // getExperiment(expidToken);
  //     // getRunningState(expidToken);
  //     // getExperimentTree(expidToken);
  //     // getExperimentPerformanceMetrics(expidToken);
  //     // const interval = setInterval(() => getRunningState(expidToken), 300000);
  //     // return () => clearInterval(interval);
  //   }

  //   // eslint-disable-next-line
  // }, []);

  if (experiment === null) return <Spinner />;

  const { expid, error, error_message } = experiment;

  if (loading) return <span>Loading...</span>;
  if (!experiment) return null;
  return (
    <span className='navbar-brand ml-4'>
      <strong>{expid}</strong> {/* {description}{" "} */}
      {/* {error && <span className='text-right text-danger'>{error_message}</span>}{" "} */}
      {loadingState && (
        <span className='badge badge-dark text-right'>LOADING...</span>
      )}
      {experimentRunning && !loadingState && (
        <span className='badge badge-success text-right'>ACTIVE</span>
      )}
      {!experimentRunning && !loadingState && (
        <span className='badge badge-secondary text-right'>INACTIVE</span>
      )}
      &nbsp;
        <ExperimentRuns />
      &nbsp;
        <DescriptionModal />
    </span>
  );
};

export default Experiment;
