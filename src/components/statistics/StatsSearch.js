import React, { useContext, useEffect } from "react";
import StatsContext from "../context/statistics/statsContext";
import Spinner from "../layout/Spinner";
import BarChart from "./BarChart";
import { calculateStatistics } from "../context/utils";

const StatsSearch = () => {
  const statsContext = useContext(StatsContext);

  const {
    statdata,
    loading,
    clearStats,
    isError,
    errorMessage,
    filterAppliedCount,
    filteredStatdata,
    timeframe
  } = statsContext;

  useEffect(() => {    
    return () => {
      clearStats()
    }
    // eslint-disable-next-line
  }, [])

  if (loading) {
    return (
      <div className="container">
        <Spinner />
      </div>
    );
  }

  if (statdata && isError) {
    return (
      <div className="container">
        <div className="row">
          <div className='col-md-12 text-center p-3'>{errorMessage}</div>
        </div>
      </div>
    );
  }
  
  if (!statdata){
    return (
      <div className="container">
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
      </div>
    );   
  }

  const summaryHeader = <span>Statistics from the time frame: <span className="bg-secondary rounded px-1">{timeframe.From !== "None" ? timeframe.From : "Start of experiment"}</span> to <span className="bg-secondary rounded px-1">{timeframe.To}</span></span>;
  
  const {
     jobsSubmittedCount,
     jobsRunCount, 
     jobsCompletedCount, 
     jobsFailedCount,     
     expectedConsumption,  
     realConsumption ,
     failedRealConsumption,  
     expectedCpuConsumption,
     cpuConsumption,  
     failedCpuConsumption,
     totalQueueTime,
     cpuConsumptionPercentage,
  } = calculateStatistics(statdata);

  const filteredStats = calculateStatistics(filteredStatdata);
  
  // console.log(calculateStatistics(filteredStatdata));
  // const consumptionPercentage = 0; // totaldata && totaldata.totals ? totaldata.totals.pConsumption: 0.00;
  // const queueTime = 0; // totaldata && totaldata.totals ? totaldata.totals.tQueue : 0.00;    
  const countsSummaryTable = <table className="table table-sm table-bordered mb-0">
      <caption>Considers number of jobs and retrials.</caption>
      <thead className="thead-dark">        
        <tr>
          <th scope="col" className="pl-2">Description</th>
          <th scope="col" className="text-right pr-2">Count</th>
          {filterAppliedCount > 0 && <th scope="col" className="text-right pr-2">Count <sup>(*)</sup></th>}
        </tr>
      </thead>
      <tbody>        
          <tr>
            <th scope="row" className="pl-2">Jobs Submitted</th>
            <td className="text-right pr-2">{jobsSubmittedCount}</td>
            {filterAppliedCount > 0 && <td className="text-right pr-2">{filteredStats.jobsSubmittedCount}</td>}            
          </tr> 
          <tr>
            <th scope="row" className="pl-2">Jobs Run</th>
            <td className="text-right pr-2">{jobsRunCount}</td>     
            {filterAppliedCount > 0 && <td className="text-right pr-2">{filteredStats.jobsRunCount}</td>}       
          </tr> 
          <tr>
            <th scope="row" className="pl-2">Jobs Completed</th>
            <td className="text-right pr-2">{jobsCompletedCount}</td>
            {filterAppliedCount > 0 && <td className="text-right pr-2">{filteredStats.jobsCompletedCount}</td>}            
          </tr> 
          <tr>
            <th scope="row" className="pl-2">Jobs Failed</th>
            <td className="text-right pr-2">{jobsFailedCount}</td>
            {filterAppliedCount > 0 && <td className="text-right pr-2">{filteredStats.jobsFailedCount}</td>}            
          </tr>        
      </tbody>
    </table>;
  const CPUconsumptionTable = <table className="table table-sm table-bordered mb-0">
      <caption>Considers the number of processors requested by the job (and retrials) multiplied by the corresponding running time.</caption>
      <thead className="thead-dark">
        <tr>
          <th scope="col" className="pl-2">Description</th>
          <th scope="col" className="text-right pr-2">Hours</th>
          {filterAppliedCount > 0 && <th scope="col" className="text-right pr-2">Hours <sup>(*)</sup></th>}
        </tr>
      </thead>
      <tbody>        
          <tr>
            <th scope="row" className="pl-2">Expected CPU Consumption</th>
            <td className="text-right pr-2">{expectedCpuConsumption}</td>
            {filterAppliedCount > 0 && <td className="text-right pr-2">{filteredStats.expectedCpuConsumption}</td>}           
          </tr> 
          <tr>
            <th scope="row" className="pl-2">CPU Consumption</th>
            <td className="text-right pr-2">{cpuConsumption}</td>   
            {filterAppliedCount > 0 && <td className="text-right pr-2">{filteredStats.cpuConsumption}</td>}         
          </tr> 
          <tr>
            <th scope="row" className="pl-2">Failed CPU Consumption</th>
            <td className="text-right pr-2">{failedCpuConsumption}</td>  
            {filterAppliedCount > 0 && <td className="text-right pr-2">{filteredStats.failedCpuConsumption}</td>}          
          </tr>       
      </tbody>
    </table>;
  const consumptionTable = <table className="table table-sm table-bordered mb-0">
      <caption>Considers the running time of the jobs and retrials.</caption>
      <thead className="thead-dark">
        <tr>
          <th scope="col" className="pl-2">Description</th>
          <th scope="col" className="text-right pr-2">Hours</th>
          {filterAppliedCount > 0 && <th scope="col" className="text-right pr-2">Hours <sup>(*)</sup></th>}
        </tr>
      </thead>
      <tbody>        
          <tr>
            <th scope="row" className="pl-2">Expected Consumption</th>
            <td className="text-right pr-2">{expectedConsumption}</td>
            {filterAppliedCount > 0 && <td className="text-right pr-2">{filteredStats.expectedConsumption}</td>}            
          </tr> 
          <tr>
            <th scope="row" className="pl-2">Real Consumption</th>
            <td className="text-right pr-2">{realConsumption}</td>        
            {filterAppliedCount > 0 && <td className="text-right pr-2">{filteredStats.realConsumption}</td>}    
          </tr> 
          <tr>
            <th scope="row" className="pl-2">Failed Real Consumption</th>
            <td className="text-right pr-2">{failedRealConsumption}</td> 
            {filterAppliedCount > 0 && <td className="text-right pr-2">{filteredStats.failedRealConsumption}</td>}           
          </tr>       
      </tbody>
    </table>;
  

  return (
    <div className="container">      
      {statdata && (
        <div className="container border rounded my-1 py-2">
          <div className="row">
            <div className="col text-center">
              <p className="h3">
                {summaryHeader}
              </p>
              <p className="lead">
                <span>
                  CPU Consumption <span className="bg-secondary rounded px-1">{`${cpuConsumptionPercentage} %`}</span> {filterAppliedCount > 0 && <span className="bg-secondary rounded px-1">{`${filteredStats.cpuConsumptionPercentage} %`}<sup>(*)</sup></span>}
                </span>
                <span className="pl-3">
                  Total Queue Time <span className="bg-secondary rounded px-1">{`${totalQueueTime} hours`}</span> {filterAppliedCount > 0 && <span className="bg-secondary rounded px-1">{`${filteredStats.totalQueueTime} hours`}<sup>(*)</sup></span>}
                </span>
              </p>              
            </div>
          </div>
          <div className="row ">
            <div className='col'>
              {countsSummaryTable}
            </div>
            <div className="col">
              {consumptionTable}              
            </div>
            <div className="col">
              {CPUconsumptionTable}
            </div>
          </div> 
        </div>
      )}      
      
      {filteredStatdata && (
        <div className="row py-4">              
          <div className="col-md-6 scroll-x text-right">                
            <BarChart data={filteredStatdata} title="Statistics" metrics={["completedQueueTime", "completedRunTime", "failedQueueTime", "failedRunTime"]} xtitle="Hours" clearStats={clearStats} helperId={"4"} filterCount={filterAppliedCount} />
          </div>
          <div className="col-md-6 scroll-x">
            <BarChart data={filteredStatdata} title="Failed Attempts per Job"  metrics={["failedCount"]} xtitle="Attempts" clearStats={clearStats} helperId={"1"} filterCount={filterAppliedCount} />
          </div>
        </div>            
      )}            
    </div>
  );
};

export default StatsSearch;
