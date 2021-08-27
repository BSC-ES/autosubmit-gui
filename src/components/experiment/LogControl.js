import React, { useContext } from "react";
import ExperimentContext from "../context/experiment/experimentContext";

const LogControl = () => {
  const experimentContext = useContext(ExperimentContext);
  const {
    experiment,
    startAutoUpdateRun,
    setAutoUpdateRun,
  } = experimentContext;

  const onSubmitRun = (e) => {
    e.preventDefault();
    setAutoUpdateRun(true);
  };

  const onStopSubmitRun = (e) => {
    e.preventDefault();
    setAutoUpdateRun(false);
  };

  return (
    <div className='card-header p-1'>
      <div className='text-right'>
          {experiment && !startAutoUpdateRun && (
            <form onSubmit={onSubmitRun} className='form'>
              <input
                type='submit'
                value='Show Log'
                className='btn btn-dark btn-sm'
                data-toggle='tooltip' 
                data-placement='bottom' 
                title="Show the last 150 lines of the current run log of your experiment."
              />
            </form>
          )}
          {experiment && startAutoUpdateRun && (
            <form onSubmit={onStopSubmitRun} className='form'>
              <input
                type='submit'
                value='Hide Log'
                className='btn btn-secondary btn-sm'
                // disabled={!enabledGraphSearch}
              />
            </form>
          )}
      </div>
    </div>
  );
};

export default LogControl;
