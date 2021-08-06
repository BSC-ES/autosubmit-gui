import React, { useState, useContext, Fragment } from "react";
import StatsContext from "../context/statistics/statsContext";
import ExperimentContext from "../context/experiment/experimentContext";
import Chart from "react-google-charts";
import Spinner from "../layout/Spinner";
import { DEBUG, queueColor, runningColor, failedColor } from "../context/vars";

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

  // const jsonTicks = JSON.stringify({ticksdata});
  // console.log(jsonTicks['ticksdata'])
  const factorHeight = 28;
  const minRows = 10;
  const minHeight = 400;
  const resultQueuedHeight = statdata && statdata.resultQueued.length > minRows ? String(statdata.resultQueued.length*factorHeight) : minHeight;
  const resultRunHeight = statdata && statdata.resultRun.length > minRows ? String(statdata.resultRun.length*factorHeight) : minHeight;
  const resultNumberFailedJobsHeight = statdata && statdata.resultNumberFailedJobs.length > minRows ? String(statdata.resultNumberFailedJobs.length*factorHeight) : minHeight;
  const resultFailedQueuedHeight = statdata && statdata.resultFailedQueued.length > minRows ? String(statdata.resultFailedQueued.length*factorHeight) : minHeight;
  const resultFailedRunHeight = statdata && statdata.resultFailedRun.length > minRows ? String(statdata.resultFailedRun.length*factorHeight) : minHeight;
  //console.log(resultQueuedHeight);

  const resultQueuedOptions = {
    title: "Queue Time per Job",
    chartArea: { height: "80%", width: "62%"},
    colors: [queueColor.background],            
    vAxis: {
      title: "Jobs",
      textStyle: {
        fontSize: 12,
      },
    },
    hAxis: {
      title: "Hours",

    },        
    width: "100%",
    height: resultQueuedHeight,
  };

  const resultRunOptions = {
    title: "Run Time per Job",
    chartArea: { height: "80%", width: "62%"},
    colors: [runningColor.background],            
    vAxis: {
      title: "Jobs",
      textStyle: {
        fontSize: 12,
      },
    },
    hAxis: {
      title: "Hours",
    },        
    width: "100%",
    height: resultRunHeight,
  };

  const resultNumberFailedJobsOptions = {
    title: "Number of Attempts per Job",
    chartArea: { height: "80%", width: "62%"},
    colors: [failedColor.background],            
    vAxis: {
      title: "Jobs",
      textStyle: {
        fontSize: 12,
      },
    },
    hAxis: {
      title: "Attempts", 
      format: "#", 
    },        
    width: "100%",
    height: resultNumberFailedJobsHeight,
  };

  const resultFailedQueuedOptions = {
    title: "Queue Time for Failed Attempts per Job",
    chartArea: { height: "80%", width: "62%"},
    colors: ["salmon"],            
    vAxis: {
      title: "Jobs",
      textStyle: {
        fontSize: 12,
      },
    },
    hAxis: {
      title: "Hours",      
    },        
    width: "100%",
    height: resultFailedQueuedHeight,
  };

  const resultFailedRunOptions = {
    title: "Run Time for Failed Attempts per Job",
    chartArea: { height: "80%", width: "62%"},   
    vAxis: {
      title: "Jobs",     
      textStyle: {
        fontSize: 12,
      },
    },
    hAxis: {
      title: "Hours",
    },
    width: "100%",
    height: resultFailedRunHeight,
  };

  // console.log(options);

  let summary = null;
  if (totaldata && totaldata.stats && totaldata.stats.totals) {
    summary = totaldata.stats.totals.map((item, index) => (
      <li key={index}>{item}</li>
    ));
    // console.log(totaldata.stats.totals[0]);
    // for(var i = 0; i < totaldata.stats.totals.length; i++){
    //     console.log(totaldata.stats.totals[i]);
    //     summary += <li key={i}>{totaldata.stats.totals[i]}</li>
    // }
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
  const pStyle = {
    listStyleType: "none",
  };

  return (
    <Fragment>
      <div className='row'>
        <div className='col-md-4 offset-md-4 text-center'>
          {!statdata && experiment && experimentContext.loading === false && (
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
          )}
          {statdata && (
            <form onSubmit={onSubmitClear} className='form'>
              <div className=''>
                <input
                  type='submit'
                  value='Clear Statistics'
                  className='btn btn-dark btn-sm'
                />
              </div>
            </form>
          )}
        </div>
        <div className='col-md-12'>
          {!statdata && experiment && (
            <div className='col-md-12 p-3'>
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
          )}
          {loading && <Spinner />}
          {statdata && statdata.resultQueued && statdata.resultQueued.length > 1 && !isError && (
            <Chart
              chartType='BarChart'
              loader={<div>Loading Chart</div>}
              // width={"100%"}   
              // height={"1000"}                       
              data={statdata.resultQueued}
              options={resultQueuedOptions}
            />
          )}
          {statdata && statdata.resultRun && statdata.resultRun.length > 1 && !isError && (
            <Chart
              chartType='BarChart'
              loader={<div>Loading Chart</div>}
              //width={"100%"}
              data={statdata.resultRun}
              options={resultRunOptions}
            />
          )}
          {statdata && statdata.resultNumberFailedJobs && statdata.resultNumberFailedJobs.length > 1 && !isError && (
            <Chart
              chartType='BarChart'
              loader={<div>Loading Chart</div>}
              // width={"100%"}
              data={statdata.resultNumberFailedJobs}
              options={resultNumberFailedJobsOptions}
            />
          )}
          {statdata && statdata.resultFailedQueued && statdata.resultFailedQueued.length > 1 && !isError && (
            <Chart
              chartType='BarChart'
              loader={<div>Loading Chart</div>}
              //width={"100%"}
              data={statdata.resultFailedQueued}
              options={resultFailedQueuedOptions}
            />
          )}
          {statdata && statdata.resultFailedRun && statdata.resultFailedRun > 1 && !isError && (
            <Chart
              chartType='BarChart'
              loader={<div>Loading Chart</div>}
              width={"100%"}
              data={statdata.resultFailedRun}
              options={resultFailedRunOptions}
            />
          )}
          {statdata && isError && (
            <div className='col-md-12 text-center p-3'>{errorMessage}</div>
          )}
          {totaldata && (
            <div className='col-md-8 offset-md-4 mt-2'>
              {totaldata && <ul style={pStyle}>{summary && summary}</ul>}
            </div>
          )}
        </div>
      </div>
      {/* <div className='row' style={experimentBuffer}></div> */}
    </Fragment>
  );
};

// const experimentBuffer = {
//   minHeight: "100%",
// };

export default StatsSearch;
