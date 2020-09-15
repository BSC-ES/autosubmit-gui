import React, { useContext } from "react";
import TreeContext from "../context/tree/treeContext";
import GraphContext from "../context/graph/graphContext";
import LighterContext from "../context/lighter/lighterContext";
import ExperimentContext from "../context/experiment/experimentContext";

const AlertTotal = ({ source }) => {
  const experimentContext = useContext(ExperimentContext);
  const graphContext = useContext(GraphContext);
  const treeContext = useContext(TreeContext);
  const lighterContext = useContext(LighterContext);
  const { totalJobs } = experimentContext;
  let alertMessage = null;

  switch (source) {
    case "tree":
      const { treedata } = treeContext;
      const { total } = treedata;
      if (totalJobs !== total) {
        alertMessage =
          "The number of jobs in the experiment tree is different than the number of jobs in your current run. This might be due to a change in the config files of your experiment while Autosubmit was already running.";
        // console.log(totalJobs);
        // console.log(total);
      }
      break;
    case "graph":
      const { data } = graphContext;
      const { total_jobs } = data;
      if (totalJobs !== total_jobs) {
        alertMessage =
          "The number of jobs in the experiment graph is different than the number of jobs in your current run. This might be due to a change in the config files of your experiment while Autosubmit was already running.";
      }
      break;
    case "lighter": {
      const { lightData } = lighterContext;
      const { total } = lightData;
      if (totalJobs !== total) {
        alertMessage =
          "The number of jobs in the experiment quick representation is different than the number of jobs in your current run. This might be due to a change in the config files of your experiment while Autosubmit was already running.";
      }
      break;
    }
    default:
      alertMessage = null;
  }

  if (alertMessage && alertMessage !== null) {
    return (
      <span
        className='badge badge-danger'
        data-toggle='tooltip'
        data-placement='bottom'
        title={alertMessage}
      >
        <b>ALERT</b>
      </span>
    );
  } else {
    return null;
  }
};

export default AlertTotal;
