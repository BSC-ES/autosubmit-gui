import React, { useState, useContext } from "react";
import StatsContext from "../context/statistics/statsContext";
import ExperimentContext from "../context/experiment/experimentContext";
// import Chart from "react-google-charts";
import Spinner from "../layout/Spinner";
import { DEBUG } from "../context/vars";
import BarChart from "./BarChart";

const StatsSearch = () => {
  const statsContext = useContext(StatsContext);
  const experimentContext = useContext(ExperimentContext);

  const {
    getExperimentStats,
    statdata,
    loading,
    clearStats,
    isError,
    errorMessage,
    totaldata,
  } = statsContext;
  const { experiment } = experimentContext;


  let summaryTable = null;
  let summaryHeader = null;
  if (totaldata && totaldata.stats && totaldata.stats.totals && totaldata.stats.totals.length > 0) {
    let summary = [];
    totaldata.stats.totals.forEach((item, index) => {
      if (index === 0){
        summaryHeader = <p className="lead"><strong>{item}</strong></p>;
      } else {
        if (item.indexOf(":") >= 0){
          summary.push({
            field: item.split(":")[0], 
            value: item.split(":")[1]
          });
        } else {
          summary.push({
            field: "",
            value: item
          });
        }        
      }      
    });
    summaryTable = <table className="table table-sm">
      <thead className="thead-dark">
        <tr>
          <th scope="col">Field</th>
          <th scope="col">Value</th>
        </tr>
      </thead>
      <tbody>
        {summary.map((w, index) => (
          <tr key={index}>
            <td>{w.field}</td>
            <td>{w.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  }

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
  // const pStyle = {
  //   listStyleType: "none",
  // };

  return (
    <div className="container">
      {!statdata && experiment && experimentContext.loading === false && (
        <div className="row">
          <div className="col-md-4 offset-md-4">
            <form onSubmit={onSubmitStats} className='form'>
              <div className='input-group input-group-sm'>
                <input
                  className='form-control'
                  type='text'
                  name='section'
                  placeholder='Section'
                  onChange={onChangeSection}
                />
                <input
                  className='form-control'
                  type='text'
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
          </div>
        </div>
        
      )}
      {statdata && (
        <div className="row-hl d-flex flex-wrap pb-1">
          <div className="item-hl">
            {summaryHeader && summaryHeader}
          </div>
          <div className="item-hl ml-auto">
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
        </div>            
      )}
      {!statdata && experiment && (
        <div className='row'>
          <div className="col">
            <p className='lead'>
              Supply a Section (Type) in the appropriate textbox to filter the
              jobs that will be included in the query. Also, you can also
              supply the Hours value that determines how many hours before the
              current time you want to query. Leave both empty and a query for
              Any Section since the date of creation of the experiment will be
              executed.
            </p>
            <p className='lead'>
              Press <span className='badge badge-primary'>Get Statistics</span>{" "}
              to generate the statistics, this will generate a Bar Chart and
              some extra statistics below. Drag the mouse inside the chart to
              zoom in; however, zoom in capabilities are not unlimited, so try
              to narrow your query.
            </p>
          </div>          
        </div>
      )}
      {loading && <Spinner />}
      {statdata && statdata.length > 0 && (
        <div className="row">              
          <div className="col-md-6 scroll-x text-right">                
            <BarChart data={statdata} title="Statistics" metrics={["queue", "run", "failedQueue", "failedRun"]} xtitle="Hours" clearStats={clearStats} helperId={"4"} />
          </div>
          <div className="col-md-6 scroll-x">
            <BarChart data={statdata} title="Failed Attempts per Job"  metrics={["failedAttempts"]} xtitle="Attempts" clearStats={clearStats} helperId={"1"} />
          </div>
        </div>            
      )}          
      {statdata && isError && (
        <div className="row">
          <div className='col-md-12 text-center p-3'>{errorMessage}</div>
        </div>            
      )}
      {totaldata && (
        <div className="row justify-content-center">
          <div className='col-md-4'>
            {totaldata && summaryTable && summaryTable}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsSearch;
