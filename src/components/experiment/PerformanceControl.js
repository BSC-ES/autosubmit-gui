import React, { useContext } from "react";
import ExperimentContext from "../context/experiment/experimentContext";
import TreeContext from "../context/tree/treeContext";

const PerformanceControl = () => {
  const experimentContext = useContext(ExperimentContext);
  const treeContext = useContext(TreeContext);
  const {
    getExperimentPerformanceMetrics,
    experiment,
    loadingPerformance,
  } = experimentContext;

  const { enabledTreeSearch } = treeContext;

  const onSubmitRequest = (e) => {
    e.preventDefault();
    getExperimentPerformanceMetrics(experiment.expid);
  };

  return (
    <div className='card-header p-1 text-right'>
          {experiment && (
            <form onSubmit={onSubmitRequest} className='form'>
              <input
                type='submit'
                value='Refresh'
                className='btn btn-success btn-sm'
                disabled={!enabledTreeSearch || loadingPerformance}
                data-toggle='tooltip' 
                data-placement='bottom' 
                title="Updates the performance metrics using the latest job data information."
              />
            </form>
          )}
    </div>
  );
};

export default PerformanceControl;
