import React, { useContext, useState } from 'react';
import StatsContext from "../context/statistics/statsContext";
import ExperimentContext from "../context/experiment/experimentContext";
import { DEBUG } from "../context/vars";

const StatsControl = () => {
  const statsContext = useContext(StatsContext);
  const experimentContext = useContext(ExperimentContext);

  const {
    getExperimentStats,
    statdata,
    loading,
    clearStats,
  } = statsContext;
  const { experiment } = experimentContext;

  const onSubmitStats = (e) => {
    e.preventDefault();
    DEBUG && console.log(experiment.expid);
    DEBUG && console.log("Hours : " + hour);
    DEBUG && console.log("Type : " + section);
    getExperimentStats(experiment.expid, hour, section);
  };

  const onSubmitClear = (e) => {
    e.preventDefault();
    setHour("");
    setSection("");
    clearStats();
  };

  const [hour, setHour] = useState("");
  const [section, setSection] = useState("");
  const onChangeHour = (e) => setHour(e.target.value);
  const onChangeSection = (e) => setSection(e.target.value);


  return (
    <div className="card-header p-1">
      <div className="d-flex flex-wrap row-hl">
      
      <div className="ml-auto item-hl">
      {!statdata && experiment && experimentContext.loading === false && (
        <form onSubmit={onSubmitStats} className='form'>
          <div className='input-group input-group-sm'>
            <input
              className='form-control'
              type='text'
              name='section'
              placeholder='Section. Ex. SIM'
              onChange={onChangeSection}
            />
            <input
              className='form-control'
              type='number'
              min="1"
              name='hours'              
              placeholder='Hours'
              onChange={onChangeHour}
            />
            <div className='input-group-append'>
              <input
                type='submit'
                value='Get Statistics'
                className='btn btn-primary'
                disabled={loading}
                data-toggle='tooltip' 
                data-placement='bottom' 
                title="Gets the statistics for the Section and Hours values provided."
              />
            </div>
          </div>
        </form>
          )} 
      </div>
                    
      {statdata && (
        <div className="item-hl">
          <form onSubmit={onSubmitClear} className='form'>
            <div className=''>
              <input
                type='submit'
                value='Clear Statistics'
                className='btn btn-dark btn-sm'
              />
            </div>
          </form>
        </div>
      )}                  
      </div>
    </div>
  )
}

export default StatsControl
