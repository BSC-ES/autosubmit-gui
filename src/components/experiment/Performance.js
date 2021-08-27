import React, { useContext, Fragment } from "react";
import ExperimentContext from "../context/experiment/experimentContext";
import Spinner from "../layout/Spinner";
import { secondsToDelta, arrayAverage, arrayStandardDeviation, arrayMeanAbsoluteDeviationAroundMean } from "../context/utils";

const Performance = () => {
  const experimentContext = useContext(ExperimentContext);
  const { performancedata, experiment, loadingPerformance } = experimentContext;

  if (loadingPerformance === true) {
    return <Spinner />;
  }

  // console.log(performancedata);

  if (!experiment || !performancedata) {
    return (
      <div className='row'>
        <div className='col-12'>
          <div className='lead'>Experiment not defined.</div>
        </div>
      </div>
    );
  }
  // console.log(performancedata);
  const {
    RSYPD,
    ASYPD,
    SYPD,
    JPSY,
    Parallelization,
    CHSY,
    considered,
    arrSYPDdata,
    arrASYPDdata,
    arrCHSY,
    arrJPSYdata
  } = performancedata;

    
  return (
    <Fragment>
      <div className='row px-2 pb-3'>
        <div className='col-md-4 pt-3 scroll-x'>
          <p className="lead">
            <span className="mr-4">Parallelization:{" "}<span className='badge badge-secondary'>{Parallelization}</span></span>            
            <span>RSYPD:{" "}<span className='badge badge-secondary'>{RSYPD}</span></span>
          </p>                  
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Metric</th>
                <th scope="col" className="text-right">Value</th>
                <th scope="col" className="text-right">Min</th>
                <th scope="col" className="text-right">Max</th>
                <th scope="col" className="text-right">Mean</th>
                <th scope="col" className="text-right">S.D.</th>
                <th scope="col" className="text-right">MAD</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">JPSY</th>
                <td className="text-right"><span className='rounded px-1 bg-secondary'>{JPSY}</span></td>
                <td className="text-right">{Math.min(...arrJPSYdata)}</td>
                <td className="text-right">{Math.max(...arrJPSYdata)}</td>
                <td className="text-right"><strong>{arrayAverage(arrJPSYdata)}</strong></td>
                <td className="text-right">{arrayStandardDeviation(arrJPSYdata)}</td>
                <td className="text-right">{arrayMeanAbsoluteDeviationAroundMean(arrJPSYdata)}</td>
              </tr>
              <tr>
                <th scope="row">SYPD</th>
                <td className="text-right"><span className='rounded px-1 bg-secondary'>{Number.parseFloat(SYPD).toFixed(2)}</span></td>
                <td className="text-right">{Math.min(...arrSYPDdata)}</td>
                <td className="text-right">{Math.max(...arrSYPDdata)}</td>
                <td className="text-right"><strong>{arrayAverage(arrSYPDdata)}</strong></td>
                <td className="text-right">{arrayStandardDeviation(arrSYPDdata)}</td>
                <td className="text-right">{arrayMeanAbsoluteDeviationAroundMean(arrSYPDdata)}</td>
              </tr>
              <tr>
                <th scope="row">ASYPD</th>
                <td className="text-right"><strong><span className='rounded px-1 bg-secondary'>{Number.parseFloat(ASYPD).toFixed(2)}</span></strong></td>
                <td className="text-right">{Math.min(...arrASYPDdata)}</td>
                <td className="text-right">{Math.max(...arrASYPDdata)}</td>
                <td className="text-right">{arrayAverage(arrASYPDdata)}</td>
                <td className="text-right">{arrayStandardDeviation(arrASYPDdata)}</td>
                <td className="text-right">{arrayMeanAbsoluteDeviationAroundMean(arrASYPDdata)}</td>
              </tr>
              <tr>
                <th scope="row">CHSY</th>
                <td className="text-right"><span className='rounded px-1 bg-secondary'>{CHSY}</span></td>
                <td className="text-right">{Math.min(...arrCHSY)}</td>
                <td className="text-right">{Math.max(...arrCHSY)}</td>
                <td className="text-right"><strong>{arrayAverage(arrCHSY)}</strong></td>
                <td className="text-right">{arrayStandardDeviation(arrCHSY)}</td>
                <td className="text-right">{arrayMeanAbsoluteDeviationAroundMean(arrCHSY)}</td>
              </tr>
            </tbody>
          </table>
          <span><strong>Value</strong>: Value of the metric calculated at the experiment level.</span><br></br>
          <span><strong>S.D.</strong>: Standard Deviation.</span><br></br>
          <span><strong>MAD</strong>: Mean Absolute Deviation Around the Mean.</span>
        </div>
        <div className='col-md-8 pt-3'>
          <p className='lead'>Considered: ({considered.length})</p>
          <div className="scroll-y-jobs">
          <table className='table'>
            <thead>
              <tr>
                <th scope='col'>#</th>
                <th scope='col'>Job Name</th>
                <th scope='col' className="text-right">Queue</th>
                <th scope='col' className="text-right">Run</th>
                <th scope='col' className="text-right">CHSY</th>
                <th scope='col' className="text-right">SYPD</th>
                <th scope='col' className="text-right">ASYPD</th>
                <th scope='col' className="text-right">JPSY</th>
                <th scope='col' className="text-right">Energy</th>                
              </tr>
            </thead>
            <tbody>
              {considered
                .sort((a, b) => (a.name > b.name ? 1 : -1))
                .map((item, index) => (
                  <tr key={item.name}>
                    <th scope='row'>{index + 1}</th>
                    <td>{item.name}</td>
                    <td className="text-right">
                      <strong> {secondsToDelta(item.queue)}</strong>
                    </td>
                    <td className="text-right">
                      <strong>{secondsToDelta(item.running)}</strong>
                    </td>
                    <td className="text-right">
                      {Number.parseFloat(item.CHSY).toFixed(2)}
                    </td>
                    <td className="text-right">
                      {Number.parseFloat(item.SYPD).toFixed(2)}
                    </td>
                    <td className="text-right">
                      {Number.parseFloat(item.ASYPD).toFixed(2)}
                    </td>
                    <td className="text-right">
                      {item.JPSY}
                    </td>
                    <td className="text-right">
                      {item.energy}
                    </td>                    
                  </tr>
                ))}
            </tbody>
          </table>
          </div>
        </div>
      </div>

      {performancedata &&
        performancedata.warnings_job_data &&
        performancedata.warnings_job_data.length > 0 && (
          <div className='row px-3 pb-1'>
            <div className='col-12 px-4'>
              <p>
                {" "}
                There are some warnings about the calculations of performance
                metrics:{" "}
                <button
                  data-target='#warningsCollapse'
                  type='button'
                  aria-expanded='false'
                  aria-controls='warningsCollapse'
                  className='btn btn-sm btn-warning'
                  data-toggle='collapse'
                >
                  <span
                  data-toggle='tooltip' 
                  data-placement='bottom' 
                  title="Opens a list of warnings, click again to close the list.">
                    Show warnings
                  </span>
                </button>
              </p>
            </div>

            <div className='collapse px-4' id='warningsCollapse'>
              <div className='card card-body p-1'>
                
                  <ol className="py-0 my-0">
                    {performancedata.warnings_job_data.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ol>
                
              </div>
            </div>
          </div>
        )}

      <div className='row px-3'>
        <div className='col-12 px-4'>
          <h3>Metrics description:</h3>
          <p>
            <strong>Parallelization</strong>: Total number of cores allocated
            for the run, per SIM.
          </p>         
          <p>
            <strong>JPSY</strong>: Energy cost of a simulation, measured in
            Joules per simulated year. The JPSY <strong>value</strong> at the experiment level is the mean of the values calculated at the job level. 
            Energy values are only collected for jobs running on <strong>Marenostrum4</strong>.
            In rare occassions the query that retrieves the energy information fails and the value stays at 0.
            Jobs with <strong>0</strong> energy value are not considered for the calculation.  
          </p>
          <p>
            <strong>SYPD</strong>: Simulated Years Per Day for the model in a 24h period. 
            The <strong>value</strong> at the experiment level is the mean of the values calculated at the job level.
          </p>
          <p>
            <strong>ASYPD</strong>: Actual Simulated Years Per Day, this number should be lower than SYPD due to interruptions, queue wait time, <strong>POST</strong> jobs, data transfer, or
            issues with the model workflow.
            The ASYPD <strong>value</strong> calculated at the job level uses a generalization of the formula applied at the experiment level. 
            As a consequence, the ASYPD value at the experiment level can be different that the mean of the values calculated at the job level.
          </p>
          <p>
            <strong>CHSY</strong>: Core Hours Per Simulated Year. 
            This metric is the product of the model runtime for 1 Simulated Year and the number of processors (Parallelization) allocated. 
            The CHSY <strong>value</strong> at the experiment level is the mean of the values calculated at the job level.
          </p>
          <p>
            <strong>RSYPD</strong>: "Real" Simulated Years Per Day. This variation of SYPD has been defined only at the experiment level. It depends on the existences of <strong>TRANSFER</strong> or <strong>CLEAN</strong> jobs. Then, it uses the finish time of the last TRANSFER or CLEAN job and the start time of the first SIM job in the experiment to calculate an approximation of the total duration of the simulation.
          </p>
          <p>
            <strong>Considered</strong>: Scrollable list where each item in the
            list represents job information showing <strong>Job Name</strong>,{" "}
            <strong>QUEUE</strong> and <strong>RUNNING</strong> time in{" "}
            <i>HH:mm:ss</i> format, <strong>CHSY</strong>, <strong>JPSY</strong>
            , and raw <strong>Energy</strong> consumption for that job.{" "}
            <i>
              Note: Energy values are only collected for those jobs running on
              MareNostrum4 and using the latest version of Autosubmit.
              Subsequent development will expand this feature for other
              platforms.
            </i>
          </p>
          
          <p>
            Visit{" "}
            <a
              href='https://earth.bsc.es/gitlab/wuruchi/autosubmitreact/-/wikis/Performance-Metrics'
              target='_blank'
              rel='noopener noreferrer'
            >
              Performance Metrics Documentation
            </a>{" "}
            for more details.
          </p>
        </div>
      </div>
    </Fragment>
  );
};

export default Performance;
