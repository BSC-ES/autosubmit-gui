import React, { useContext, useState } from "react";
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
    applyRegExToJobDataSet,
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

  const onSubmitFilter = (e) => {
    e.preventDefault();
    applyRegExToJobDataSet(regularExpression);
  };

  const [regularExpression, setRegExp] = useState("");
  const [hour, setHour] = useState("");
  const [section, setSection] = useState("");
  const onChangeHour = (e) => setHour(e.target.value);
  const onChangeSection = (e) => setSection(e.target.value);
  const onChangeRegExp = (e) => setRegExp(e.target.value);

  return (
    <div className='card-header p-1'>
      <div className='d-flex flex-wrap row-hl'>
        <div className='ml-auto item-hl'>
          {!statdata && experiment && experimentContext.loading === false && (
            <form onSubmit={onSubmitStats} className='form'>
              <div className='input-group input-group-sm'>
                <input
                  className='form-control menu-input-append'
                  type='text'
                  name='section'
                  placeholder='Section. Ex. SIM'
                  onChange={onChangeSection}
                />
                <input
                  className='form-control menu-input-append'
                  type='number'
                  min='0'
                  name='hours'
                  placeholder='Hours'
                  onChange={onChangeHour}
                />
                <div className='input-group-append'>
                  <input
                    type='submit'
                    value='Get Statistics'
                    className='btn btn-primary menu-btn'
                    disabled={loading}
                    data-toggle='tooltip'
                    data-placement='bottom'
                    title='Gets the statistics for the Section and Hours values provided.'
                  />
                </div>
              </div>
            </form>
          )}
        </div>

        {statdata && (
          <div className='item-hl mr-1 minimum-w-filter'>
            <form onSubmit={onSubmitFilter} className='form'>
              <div className='input-group input-group-sm'>
                <input
                  type='text'
                  name='regExp'
                  placeholder='Filter using a regular expression'
                  onChange={onChangeRegExp}
                  className='form-control menu-input-append'
                  text=''
                />
                <div className='input-group-append'>
                  <input
                    type='submit'
                    className='btn btn-dark menu-btn'
                    value='Filter'
                    data-toggle='tooltip'
                    data-placement='bottom'
                    title='Filters the list of jobs according to the regular expression.'
                  />
                </div>
              </div>
            </form>
          </div>
        )}
        {statdata && (
          <div className='item-hl'>
            <form onSubmit={onSubmitClear} className='form'>
              <div className=''>
                <input
                  type='submit'
                  value='Clear Statistics'
                  className='btn btn-dark btn-sm menu-btn'
                />
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsControl;
