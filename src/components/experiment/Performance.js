import React, { useContext, Fragment } from "react";
import ExperimentContext from "../context/experiment/experimentContext";

const Performance = () => {
  const experimentContext = useContext(ExperimentContext);
  const { performancedata, experiment, secondsToDelta } = experimentContext;

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
    ASYPD,
    SYPD,
    JPSY,
    Parallelization,
    CHSY,
    considered,
  } = performancedata;
  return (
    <Fragment>
      <div className='row px-3'>
        <div className='col-4 p-4'>
          <h5>
            Parallelization:{" "}
            <span className='badge badge-secondary'>{Parallelization}</span>
          </h5>
          <h5>
            JPSY: <span className='badge badge-secondary'>{JPSY}</span>
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
        <div className='col-8 p-3 scroll-y-jobs'>
          <p className='lead'>Considered: ({considered.length})</p>
          <table className='table'>
            <thead>
              <tr>
                <th scope='col'>#</th>
                <th scope='col'>Job Name</th>
                <th scope='col'>Queue</th>
                <th scope='col'>Run</th>
                <th scope='col'>CHSY</th>
                <th scope='col'>JPSY</th>
                <th scope='col'>Energy</th>
              </tr>
            </thead>
            <tbody>
              {considered
                .sort((a, b) => (a.name > b.name ? 1 : -1))
                .map((item, index) => (
                  <tr key={item.name}>
                    <th scope='row'>{index + 1}</th>
                    <td>{item.name}</td>
                    <td>
                      <strong> {secondsToDelta(item.queue)}</strong>
                    </td>
                    <td>
                      <strong>{secondsToDelta(item.running)}</strong>
                    </td>
                    <td>
                      <strong>{item.CHSY}</strong>
                    </td>
                    <td>
                      <strong>{item.JPSY}</strong>
                    </td>
                    <td>
                      <strong>{item.energy}</strong>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
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
            <strong>JPSY</strong>: Energy cost of a simulation, measured in
            Joules per simulated year.
          </p>
          <p>
            <strong>SYPD</strong>: Simulated years per day for the model in a 24
            h period.
          </p>
          <p>
            <strong>ASYPD</strong>: Actual SYPD, this number should be lower
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
