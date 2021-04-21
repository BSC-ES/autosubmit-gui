import React, { useState, useContext, Fragment } from "react";
import StatsContext from "../context/statistics/statsContext";
import ExperimentContext from "../context/experiment/experimentContext";
import Chart from "react-google-charts";
import Spinner from "../layout/Spinner";
import { DEBUG } from "../context/vars";

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
    ticksdata,
  } = statsContext;
  const { experiment } = experimentContext;

  // const data = [
  //     ["Year", "Visitations", "Crashes", { role: "style" }],
  //     ["2010", 10, 30, "color: gray"],
  //     ["2020", 14, 25, "color: #76A7FA"],
  //     ["2030", 16, 24, "color: blue"],
  //     ["2040", 22, 32, "stroke-color: #703593; stroke-width: 4; fill-color: #C5A5CF"],
  //     [
  //       "2050",
  //       28,
  //       23,
  //       "stroke-color: #871B47; stroke-opacity: 0.6; stroke-width: 8; fill-color: #BC5679; fill-opacity: 0.2"
  //     ]
  // ];

  // const jsonTicks = JSON.stringify({ticksdata});
  // console.log(jsonTicks['ticksdata'])
  const options = {
    chartArea: { width: "90%", height: "700px" },
    hAxis: {
      title: "Jobs",
      ticks: ticksdata, //ticks: [{v:1, f:'job_1-2323'}, {v:2, f:'job_other'}],
    },
    vAxis: {
      title: "Hours",
    },
    legend: {
      position: "top",
    },
    explorer: {
      actions: ["dragToZoom", "rightClickToReset"],
      axis: "horizontal",
      // maxZoomIn: 4.0,
    },
  };

  // console.log(options);

  var summary = null;
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
          {statdata && !isError && (
            <Chart
              chartType='ColumnChart'
              loader={<div>Loading Chart</div>}
              width={"100%"}
              height={"700px"}
              data={statdata}
              options={options}
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
