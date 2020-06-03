import React, { useContext, Fragment } from "react";
import ExperimentContext from "../context/experiment/experimentContext";

const Performance = () => {
  const experimentContext = useContext(ExperimentContext);
  const { performancedata, experiment } = experimentContext;

  if (!experiment || !performancedata) {
    return (
      <div className='row'>
        <div className='col-12'>
          <div className='lead'>Experiment not defined.</div>
        </div>
      </div>
    );
  }
  console.log(performancedata);
  const { ASYPD, SYPD, Parallelization, CHSY, considered } = performancedata;
  return (
    <Fragment>
      <div className='row px-3'>
        <div className='col-6 p-4'>
          <h5>
            Parallelization:{" "}
            <span className='badge badge-secondary'>{Parallelization}</span>
          </h5>
          <h5>
            SYPD: <span className='badge badge-secondary'>{SYPD}</span>
          </h5>
          <h5>
            ASYPD: <span className='badge badge-secondary'>{ASYPD}</span>
          </h5>
          <h5>
            CHSY: <span className='badge badge-secondary'>{CHSY}</span>
          </h5>
          {/* <strong>considered: </strong> {considered} */}
        </div>
        <div className='col-6 p-3 scroll-y-jobs'>
          <p className='lead'>Considered: ({considered.length})</p>
          <ol>
            {considered
              .sort((a, b) => (a.name > b.name ? 1 : -1))
              .map((item) => (
                <li key={item.name}>
                  {" "}
                  {item.name} | QUEUE: <strong>{item.queue}</strong> | RUNNING:{" "}
                  <strong>{item.running}</strong> | CHSY:{" "}
                  <strong>{item.CHSY}</strong>{" "}
                </li>
              ))}
          </ol>
        </div>
      </div>
      <div className='row px-3'>
        <div className='col-12 px-4'>
          <p className='lead'>Metrics description:</p>
          <p>
            <strong>Parallelization</strong>: Total number of cores allocated
            for the run, per SIM.
          </p>
          <p>
            <strong>SYPD</strong>: Simulated years per day for the model in a 24
            h period.
          </p>
          <p>
            <strong>ASYPD</strong>: Actual SYPD: This number should be lower
            than SYPD due to interruptions, queue wait time, data transfer or
            issues with the model workflow. This is collected by measuring the
            time between first submission and the date of arrival of the last
            history file on the storage file system.
          </p>
          <p>
            <strong>CHSY</strong>: Core hours per simulated year. This is
            measured as the product of the model runtime for 1 SY and the number
            of cores allocated. This is an average of the CHSY of all SIM jobs.
          </p>
          <p>
            <strong>Considered</strong>: Scrollable list where each item in the
            list is a job that shows <i>job name</i>, <i>QUEUE time</i> in
            seconds, <i>RUNNING time</i> in seconds, and <i>CHSY</i> for that
            job.
          </p>
          <p>
            Visit{" "}
            <a href='https://earth.bsc.es/gitlab/wuruchi/autosubmitreact/-/wikis/Performance-Metrics'>
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
