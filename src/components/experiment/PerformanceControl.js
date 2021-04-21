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
    <div className='card-header p-1'>
      <div className='row justify-content-end'>
        <div className='col-md-2'>
          {experiment && (
            <form onSubmit={onSubmitRequest} className='form'>
              <input
                type='submit'
                value='Refresh'
                className='btn btn-success btn-block btn-sm'
                disabled={!enabledTreeSearch || loadingPerformance}
                data-toggle='tooltip' 
                data-placement='bottom' 
                title="Updates the performance metrics using the latest job data information."
              />
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default PerformanceControl;
