import React, { useContext } from "react";
import StatsContext from "../context/statistics/statsContext";
import ExperimentContext from "../context/experiment/experimentContext";
// import Chart from "react-google-charts";
import Spinner from "../layout/Spinner";
import BarChart from "./BarChart";

const StatsSearch = () => {
  const statsContext = useContext(StatsContext);
  const experimentContext = useContext(ExperimentContext);

  const {
    statdata,
    loading,
    clearStats,
    isError,
    errorMessage,
    totaldata,
  } = statsContext;
  const { experiment } = experimentContext;


  let countsSummaryTable = null;
  let CPUconsumptionTable = null;
  let consumptionTable = null;
  const summaryHeader = totaldata && totaldata.totals && totaldata.totals.Period ? <span>Statistics from the time frame: <span className="bg-secondary rounded px-1">{totaldata.totals.Period.From && totaldata.totals.Period.From !== "None" ? totaldata.totals.Period.From : "Start of experiment"}</span> to <span className="bg-secondary rounded px-1">{totaldata.totals.Period.To}</span></span> : <span>No results</span>;
  const consumptionPercentage = totaldata && totaldata.totals ? totaldata.totals.pConsumption: 0.00;
  const queueTime = totaldata && totaldata.totals ? totaldata.totals.tQueue : 0.00;
  // if (totaldata && totaldata.stats && totaldata.stats.totals && totaldata.stats.totals.length > 0) {
    // let summary = [];
    // totaldata.stats.totals.forEach((item, index) => {
    //   if (index === 0){
    //     summaryHeader = <p className="lead"><strong>{item}</strong></p>;
    //   } else {
    //     if (item.indexOf(":") >= 0){
    //       summary.push({
    //         field: item.split(":")[0], 
    //         value: item.split(":")[1]
    //       });
    //     } else {
    //       summary.push({
    //         field: "",
    //         value: item
    //       });
    //     }        
    //   }      
    // });
  if (totaldata && totaldata.totals) {
    countsSummaryTable = <table className="table table-sm table-bordered">
      <caption>Considers number of jobs and retrials.</caption>
      <thead className="thead-dark">        
        <tr>
          <th scope="col" className="pl-2">Description</th>
          <th scope="col" className="text-right pr-2">Count</th>
        </tr>
      </thead>
      <tbody>        
          <tr>
            <th scope="row" className="pl-2">Jobs Submitted</th>
            <td className="text-right pr-2">{totaldata.totals.nSubmitted}</td>            
          </tr> 
          <tr>
            <th scope="row" className="pl-2">Jobs Run</th>
            <td className="text-right pr-2">{totaldata.totals.nRun}</td>            
          </tr> 
          <tr>
            <th scope="row" className="pl-2">Jobs Completed</th>
            <td className="text-right pr-2">{totaldata.totals.nCompleted}</td>            
          </tr> 
          <tr>
            <th scope="row" className="pl-2">Jobs Failed</th>
            <td className="text-right pr-2">{totaldata.totals.nFailed}</td>            
          </tr>        
      </tbody>
    </table>;
    CPUconsumptionTable = <table className="table table-sm table-bordered">
      <caption>Considers the number of processors requested by the job (and retrials) multiplied by the corresponding running time.</caption>
      <thead className="thead-dark">
        <tr>
          <th scope="col" className="pl-2">Description</th>
          <th scope="col" className="text-right pr-2">Hours</th>
        </tr>
      </thead>
      <tbody>        
          <tr>
            <th scope="row" className="pl-2">Expected CPU Consumption</th>
            <td className="text-right pr-2">{Number.parseFloat(totaldata.totals.tExpectedConsumptionCpuTime).toFixed(2)}</td>            
          </tr> 
          <tr>
            <th scope="row" className="pl-2">CPU Consumption</th>
            <td className="text-right pr-2">{Number.parseFloat(totaldata.totals.tCpuConsumption).toFixed(2)}</td>            
          </tr> 
          <tr>
            <th scope="row" className="pl-2">Failed CPU Consumption</th>
            <td className="text-right pr-2">{Number.parseFloat(totaldata.totals.tFailedCpuConsumption).toFixed(2)}</td>            
          </tr>       
      </tbody>
    </table>;
    consumptionTable = <table className="table table-sm table-bordered">
      <caption>Considers the running time of the jobs and retrials.</caption>
      <thead className="thead-dark">
        <tr>
          <th scope="col" className="pl-2">Description</th>
          <th scope="col" className="text-right pr-2">Hours</th>
        </tr>
      </thead>
      <tbody>        
          <tr>
            <th scope="row" className="pl-2">Expected Consumption</th>
            <td className="text-right pr-2">{Number.parseFloat(totaldata.totals.tExpectedConsumptionReal).toFixed(2)}</td>            
          </tr> 
          <tr>
            <th scope="row" className="pl-2">Real Consumption</th>
            <td className="text-right pr-2">{Number.parseFloat(totaldata.totals.tRealConsumption).toFixed(2)}</td>            
          </tr> 
          <tr>
            <th scope="row" className="pl-2">Failed Real Consumption</th>
            <td className="text-right pr-2">{Number.parseFloat(totaldata.totals.tFailedRealConsumption).toFixed(2)}</td>            
          </tr>       
      </tbody>
    </table>;
  }
    
  // }

  return (
    <div className="container">
      {/* {statdata && (
        <p>{summaryHeader && summaryHeader}</p>
      )} */}
      {!statdata && experiment && (
        <div className='row'>
          <div className="col">
            <p className='lead'>
              Supply a Section (Type) in the appropriate textbox to filter the
              jobs that will be included in the query. Also, you can
              supply the <strong>Hours</strong> value that determines how many hours before the current time you want to query.               
            </p>
            <p className='lead'>
              Press <span className='badge badge-primary'>Get Statistics</span>{" "}
              to generate the result. The main BarChart can be filtered using the supplied checkboxes.
            </p>
          </div>          
        </div>
      )}
      {loading && <Spinner />}
      {totaldata && (
        <div className="container border rounded my-1 py-2">
          <div className="row">
            <div className="col text-center">
              <p className="h3">
                {summaryHeader}
              </p>
              <p className="lead">
                <span>
                  Consumption <span className="bg-secondary rounded px-1">{`${Number.parseFloat(consumptionPercentage).toFixed(2)} %`}</span>
                </span>
                <span className="pl-3">
                  Total Queue Time <span className="bg-secondary rounded px-1">{`${Number.parseFloat(queueTime).toFixed(2)} hours`}</span>
                </span>
              </p>              
            </div>
          </div>
          <div className="row ">
            <div className='col'>
              {totaldata && countsSummaryTable && countsSummaryTable}
            </div>
            <div className="col">
              {totaldata && consumptionTable && consumptionTable}              
            </div>
            <div className="col">
              {totaldata && CPUconsumptionTable && CPUconsumptionTable}
            </div>
          </div> 
          {/* <div className="row">
            <div className="col">
              More information about these metrics: <a href="https://autosubmit.readthedocs.io/en/v3.13.0/usage/stats/stats.html#console-output-description" target="_blank" rel="noreferrer">Autosubmit Documentaion</a>.
            </div>
          </div>          */}
        </div>
      )}
      
      {statdata && statdata.length > 0 && (
        <div className="row py-4">              
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
    </div>
  );
};

export default StatsSearch;
