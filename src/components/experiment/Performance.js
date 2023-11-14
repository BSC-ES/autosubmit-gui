import React, { useContext } from "react";
import ExperimentContext from "../context/experiment/experimentContext";
import TimeScatterPlot from "../plots/TimeScatterPlot";
import Spinner from "../layout/Spinner";
import {
  secondsToDelta,
  arrayAverage,
  arrayStandardDeviation,
  arrayMeanAbsoluteDeviationAroundMean,
  formatNumberMoney,
} from "../context/utils";
import MetricScatterPlot from "../plots/MetricScatterPlot";

const Performance = () => {
  const experimentContext = useContext(ExperimentContext);
  const {
    performancedata,
    experiment,
    loadingPerformance,
    performanceDisplayPlots,
    setPerformanceDisplay,
  } = experimentContext;

  if (loadingPerformance === true) {
    return <Spinner />;
  }

  // console.log(performancedata);

  if (!experiment) {
    return (
      <div className='row'>
        <div className='col-12'>
          <div className='lead'>Experiment not defined.</div>
        </div>
      </div>
    );
  }

  if (!performancedata) {
    return (
      <div className='row'>
        <div className='col-12'>
          <p>
            Press{" "}
            <span className='bg-primary text-white px-1 rounded'>Show</span>.
          </p>
        </div>
      </div>
    );
  }

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
    arrJPSYdata,
  } = performancedata;

  const consideredJPSY = [];
  const maxJPSY = considered
    ? Math.max(
        ...Array.from(
          considered.map((d) => {
            return Number.parseInt(d.JPSY);
          })
        )
      )
    : 0;
  const maxASYPD = considered
    ? Math.max(
        ...Array.from(
          considered.map((d) => {
            return Number.parseFloat(d.ASYPD);
          })
        )
      )
    : 0;
  const JPSYdivisor = maxJPSY > 999999999 ? 1000000 : 1000;
  const JPSYtitleX =
    maxJPSY > 999999999 ? "JPSY (millions)" : "JPSY (thousands)";
  if (considered) {
    considered.forEach((d) => {
      consideredJPSY.push({
        JPSY: d.JPSY / JPSYdivisor,
        SYPD: d.SYPD,
        ASYPD: d.ASYPD,
        CHSY: d.CHSY,
        running: d.running,
        queue: d.queue,
        name: d.name,
      });
    });
  }

  const onChangePlotDisplay = (e) => {
    const displayKey = e.target.id;
    const keyChecked = e.target.checked;
    setPerformanceDisplay(displayKey, keyChecked);
  };

  const checkJPSYvsCHSY = (
    <div className='form-check form-check-inline'>
      <input
        type='checkbox'
        name='JPSYvsCHSY'
        id='JPSYvsCHSY'
        className='form-check-input'
        checked={performanceDisplayPlots.JPSYvsCHSY}
        onChange={onChangePlotDisplay}
        disabled={maxJPSY <= 0}
      />
      <label
        htmlFor='JPSYvsCHSY'
        className='px-1 mx-1 rounded form-check-label'
      >
        JPSY vs CHSY
      </label>
    </div>
  );

  const checkJPSYvsSYPD = (
    <div className='form-check form-check-inline'>
      <input
        type='checkbox'
        name='JPSYvsSYPD'
        id='JPSYvsSYPD'
        className='form-check-input'
        checked={performanceDisplayPlots.JPSYvsSYPD}
        onChange={onChangePlotDisplay}
        disabled={maxJPSY <= 0}
      />
      <label
        htmlFor='JPSYvsSYPD'
        className='px-1 mx-1 rounded form-check-label'
      >
        JPSY vs SYPD
      </label>
    </div>
  );

  const checkJPSYvsASYPD = (
    <div className='form-check form-check-inline'>
      <input
        type='checkbox'
        name='JPSYvsASYPD'
        id='JPSYvsASYPD'
        className='form-check-input'
        checked={performanceDisplayPlots.JPSYvsASYPD}
        onChange={onChangePlotDisplay}
        disabled={maxJPSY <= 0}
      />
      <label
        htmlFor='JPSYvsASYPD'
        className='px-1 mx-1 rounded form-check-label'
      >
        JPSY vs ASYPD
      </label>
    </div>
  );

  const checkSYPDvsASYPD = (
    <div className='form-check form-check-inline'>
      <input
        type='checkbox'
        name='SYPDvsASYPD'
        id='SYPDvsASYPD'
        className='form-check-input'
        checked={performanceDisplayPlots.SYPDvsASYPD}
        onChange={onChangePlotDisplay}
        disabled={considered.length <= 0 || maxASYPD <= 0}
      />
      <label
        htmlFor='SYPDvsASYPD'
        className='px-1 mx-1 rounded form-check-label'
      >
        SYPD vs ASYPD
      </label>
    </div>
  );

  const checkCHSYvsSYPD = (
    <div className='form-check form-check-inline'>
      <input
        type='checkbox'
        name='CHSYvsSYPD'
        id='CHSYvsSYPD'
        className='form-check-input'
        checked={performanceDisplayPlots.CHSYvsSYPD}
        onChange={onChangePlotDisplay}
        disabled={considered.length <= 0}
      />
      <label
        htmlFor='CHSYvsSYPD'
        className='px-1 mx-1 rounded form-check-label'
      >
        CHSY vs SYPD
      </label>
    </div>
  );

  const checkCHSYvsASYPD = (
    <div className='form-check form-check-inline'>
      <input
        type='checkbox'
        name='CHSYvsASYPD'
        id='CHSYvsASYPD'
        className='form-check-input'
        checked={performanceDisplayPlots.CHSYvsASYPD}
        onChange={onChangePlotDisplay}
        disabled={considered.length <= 0 || maxASYPD <= 0}
      />
      <label
        htmlFor='CHSYvsASYPD'
        className='px-1 mx-1 rounded form-check-label'
      >
        CHSY vs ASYPD
      </label>
    </div>
  );

  const checkRunVsSYPD = (
    <div className='form-check form-check-inline'>
      <input
        type='checkbox'
        name='RunVsSYPD'
        id='RunVsSYPD'
        className='form-check-input'
        checked={performanceDisplayPlots.RunVsSYPD}
        onChange={onChangePlotDisplay}
        disabled={considered.length <= 0}
      />
      <label htmlFor='RunVsSYPD' className='px-1 mx-1 rounded form-check-label'>
        Run t. vs SYPD
      </label>
    </div>
  );

  const checkRunVsCHSY = (
    <div className='form-check form-check-inline'>
      <input
        type='checkbox'
        name='RunVsCHSY'
        id='RunVsCHSY'
        className='form-check-input'
        checked={performanceDisplayPlots.RunVsCHSY}
        onChange={onChangePlotDisplay}
        disabled={considered.length <= 0}
      />
      <label htmlFor='RunVsCHSY' className='px-1 mx-1 rounded form-check-label'>
        Run t. vs ASYPD
      </label>
    </div>
  );

  const checkQueueRunVsASYPD = (
    <div className='form-check form-check-inline'>
      <input
        type='checkbox'
        name='QueueRunVsASYPD'
        id='QueueRunVsASYPD'
        className='form-check-input'
        checked={performanceDisplayPlots.QueueRunVsASYPD}
        onChange={onChangePlotDisplay}
        disabled={maxJPSY <= 0 || maxASYPD <= 0}
      />
      <label
        htmlFor='QueueRunVsASYPD'
        className='px-1 mx-1 rounded form-check-label'
      >
        Queue+Run t. vs ASYPD
      </label>
    </div>
  );

  return (
    <div className='container'>
      <div className='row'>
        <div className='col'>
          <p className='lead'>
            <span className='performance-main-info'>
              Parallelization:{" "}
              <span className='rounded px-1 bg-secondary'>
                {Parallelization}
              </span>
            </span>
            <span className='ml-4 performance-main-info'>
              RSYPD: <span className='rounded px-1 bg-secondary'>{RSYPD}</span>
            </span>
            {
              performancedata.PE &&
              <span className='ml-4 performance-main-info'>
                PE: <span className='rounded px-1 bg-secondary'>{performancedata.PE}</span>
              </span>
            }
          </p>
          <div className='scroll-x'>
            <table className='table table-sm table-bordered list-table'>
              <thead className='thead'>
                <tr className='table-primary performance-table-header'>
                  <th scope='col'>Metric</th>
                  <th scope='col' className='text-right pr-2'>
                    Value
                  </th>
                  <th scope='col' className='text-right pr-2'>
                    Min
                  </th>
                  <th scope='col' className='text-right pr-2'>
                    Max
                  </th>
                  <th scope='col' className='text-right pr-2'>
                    Mean
                  </th>
                  <th scope='col' className='text-right pr-2'>
                    SD
                  </th>
                  <th scope='col' className='text-right pr-2'>
                    MAD
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope='row'>JPSY</th>
                  <td className='text-right pr-1'>
                    <span className='rounded px-1 bg-secondary'>
                      {formatNumberMoney(JPSY, true)}
                    </span>
                  </td>
                  <td className='text-right pr-1'>
                    {formatNumberMoney(Math.min(...arrJPSYdata), true)}
                  </td>
                  <td className='text-right pr-1'>
                    {formatNumberMoney(Math.max(...arrJPSYdata), true)}
                  </td>
                  <td className='text-right pr-1'>
                    <strong>
                      {formatNumberMoney(arrayAverage(arrJPSYdata))}
                    </strong>
                  </td>
                  <td className='text-right pr-1'>
                    {formatNumberMoney(arrayStandardDeviation(arrJPSYdata))}
                  </td>
                  <td className='text-right pr-1'>
                    {formatNumberMoney(
                      arrayMeanAbsoluteDeviationAroundMean(arrJPSYdata)
                    )}
                  </td>
                </tr>
                <tr>
                  <th scope='row'>SYPD</th>
                  <td className='text-right pr-1'>
                    <span className='rounded px-1 bg-secondary'>
                      {formatNumberMoney(SYPD)}
                    </span>
                  </td>
                  <td className='text-right pr-1'>
                    {formatNumberMoney(Math.min(...arrSYPDdata))}
                  </td>
                  <td className='text-right pr-1'>
                    {formatNumberMoney(Math.max(...arrSYPDdata))}
                  </td>
                  <td className='text-right pr-1'>
                    <strong>
                      {formatNumberMoney(arrayAverage(arrSYPDdata))}
                    </strong>
                  </td>
                  <td className='text-right pr-1'>
                    {formatNumberMoney(arrayStandardDeviation(arrSYPDdata))}
                  </td>
                  <td className='text-right pr-1'>
                    {formatNumberMoney(
                      arrayMeanAbsoluteDeviationAroundMean(arrSYPDdata)
                    )}
                  </td>
                </tr>
                <tr>
                  <th scope='row'>ASYPD</th>
                  <td className='text-right pr-1'>
                    <strong>
                      <span className='rounded px-1 bg-secondary'>
                        {formatNumberMoney(ASYPD)}
                      </span>
                    </strong>
                  </td>
                  <td className='text-right pr-1'>
                    {formatNumberMoney(Math.min(...arrASYPDdata))}
                  </td>
                  <td className='text-right pr-1'>
                    {formatNumberMoney(Math.max(...arrASYPDdata))}
                  </td>
                  <td className='text-right pr-1'>
                    {formatNumberMoney(arrayAverage(arrASYPDdata))}
                  </td>
                  <td className='text-right pr-1'>
                    {formatNumberMoney(arrayStandardDeviation(arrASYPDdata))}
                  </td>
                  <td className='text-right pr-1'>
                    {formatNumberMoney(
                      arrayMeanAbsoluteDeviationAroundMean(arrASYPDdata)
                    )}
                  </td>
                </tr>
                <tr>
                  <th scope='row'>CHSY</th>
                  <td className='text-right pr-1'>
                    <span className='rounded px-1 bg-secondary'>
                      {formatNumberMoney(CHSY)}
                    </span>
                  </td>
                  <td className='text-right pr-1'>
                    {formatNumberMoney(Math.min(...arrCHSY))}
                  </td>
                  <td className='text-right pr-1'>
                    {formatNumberMoney(Math.max(...arrCHSY))}
                  </td>
                  <td className='text-right pr-1'>
                    <strong>{formatNumberMoney(arrayAverage(arrCHSY))}</strong>
                  </td>
                  <td className='text-right pr-1'>
                    {formatNumberMoney(arrayStandardDeviation(arrCHSY))}
                  </td>
                  <td className='text-right pr-1'>
                    {formatNumberMoney(
                      arrayMeanAbsoluteDeviationAroundMean(arrCHSY)
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <span>
            <strong>Value</strong>: Value of the metric calculated at the
            experiment level.
          </span>
          <br></br>
          <span>
            <strong>SD</strong>: Standard Deviation.
          </span>
          <br></br>
          <span>
            <strong>MAD</strong>: Mean Absolute Deviation Around the Mean.
          </span>
        </div>
        <div className='col'>
          <p className='lead'>
            <span className='performance-main-info'>
              Number of Jobs Considered:{" "}
              <span className='rounded px-1 bg-secondary'>
                {considered.length}
              </span>
            </span>
          </p>
          <div className='scroll-y-jobs sticky-wrapper'>
            <table className='table table-sm table-bordered list-table'>
              <thead className='thead'>
                <tr className='table-primary performance-table-header sticky-header'>
                  <th className='' scope='col'>
                    #
                  </th>
                  <th scope='col' className='pl-2'>
                    Job Name
                  </th>
                  <th scope='col' className='text-right pr-2'>
                    Queue
                  </th>
                  <th scope='col' className='text-right pr-2'>
                    Run
                  </th>
                  <th scope='col' className='text-right pr-2'>
                    CHSY
                  </th>
                  <th scope='col' className='text-right pr-2'>
                    SYPD
                  </th>
                  <th scope='col' className='text-right pr-2'>
                    ASYPD
                  </th>
                  <th scope='col' className='text-right pr-2'>
                    JPSY
                  </th>
                  <th scope='col' className='text-right pr-2'>
                    Energy
                  </th>
                </tr>
              </thead>
              <tbody>
                {considered
                  .sort((a, b) => (a.name > b.name ? 1 : -1))
                  .map((item, index) => (
                    <tr key={item.name}>
                      <th scope='row'>{index + 1}</th>
                      <td className='pl-1'>{item.name}</td>
                      <td className='text-right pr-1'>
                        <strong> {secondsToDelta(item.queue)}</strong>
                      </td>
                      <td className='text-right pr-1'>
                        <strong>{secondsToDelta(item.running)}</strong>
                      </td>
                      <td className='text-right pr-1'>
                        {formatNumberMoney(item.CHSY)}
                      </td>
                      <td className='text-right pr-1'>
                        {formatNumberMoney(item.SYPD)}
                      </td>
                      <td className='text-right pr-1'>
                        {formatNumberMoney(item.ASYPD)}
                      </td>
                      <td className='text-right pr-1'>
                        {formatNumberMoney(item.JPSY, true)}
                      </td>
                      <td className='text-right pr-1'>
                        {formatNumberMoney(item.energy, true)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className='row py-2'>Available plots:</div>
      <div className='row'>
        <div className='col border rounded text-center p-2'>
          {checkJPSYvsCHSY}
          {checkJPSYvsSYPD}
          {checkJPSYvsASYPD}
          {checkSYPDvsASYPD}
          {checkCHSYvsSYPD}
          {checkCHSYvsASYPD}
          {checkRunVsSYPD}
          {checkRunVsCHSY}
          {checkQueueRunVsASYPD}
        </div>
      </div>
      {considered && considered.length > 0 && (
        <div className='row'>
          {performanceDisplayPlots.JPSYvsCHSY && maxJPSY > 0 && (
            <div className='col-lg-6 col-xl-4'>
              <MetricScatterPlot
                data={consideredJPSY}
                attributeX={"JPSY"}
                attributeY={"CHSY"}
                titleX={JPSYtitleX}
                mainTitle={"JPSY vs CHSY"}
                uniqueId={"4"}
              />
            </div>
          )}
          {performanceDisplayPlots.JPSYvsSYPD && maxJPSY > 0 && (
            <div className='col-lg-6 col-xl-4'>
              <MetricScatterPlot
                data={consideredJPSY}
                attributeX={"JPSY"}
                attributeY={"SYPD"}
                titleX={JPSYtitleX}
                mainTitle={"JPSY vs SYPD"}
                uniqueId={"5"}
              />
            </div>
          )}
          {performanceDisplayPlots.JPSYvsASYPD && maxJPSY > 0 && (
            <div className='col-lg-6 col-xl-4'>
              <MetricScatterPlot
                data={consideredJPSY}
                attributeX={"JPSY"}
                attributeY={"ASYPD"}
                titleX={JPSYtitleX}
                mainTitle={"JPSY vs ASYPD"}
                uniqueId={"6"}
              />
            </div>
          )}
          {performanceDisplayPlots.SYPDvsASYPD && maxASYPD > 0 && (
            <div className='col-lg-6 col-xl-4'>
              <MetricScatterPlot
                data={considered}
                attributeX={"SYPD"}
                attributeY={"ASYPD"}
                mainTitle={"SYPD vs ASYPD"}
                uniqueId={"7"}
              />
            </div>
          )}
          {performanceDisplayPlots.CHSYvsSYPD && (
            <div className='col-lg-6 col-xl-4'>
              <MetricScatterPlot
                data={considered}
                attributeX={"CHSY"}
                attributeY={"SYPD"}
                mainTitle={"CHSY vs SYPD"}
                uniqueId={"8"}
              />
            </div>
          )}
          {performanceDisplayPlots.CHSYvsASYPD && maxASYPD > 0 && (
            <div className='col-lg-6 col-xl-4'>
              <MetricScatterPlot
                data={considered}
                attributeX={"CHSY"}
                attributeY={"ASYPD"}
                mainTitle={"CHSY vs ASYPD"}
                uniqueId={"9"}
              />
            </div>
          )}
          {performanceDisplayPlots.RunVsSYPD && (
            <div className='col-lg-6 col-xl-4'>
              <TimeScatterPlot
                data={considered}
                attribute={"SYPD"}
                mainTitle={"Run time vs SYPD"}
                uniqueId={"1"}
              />
            </div>
          )}
          {performanceDisplayPlots.RunVsCHSY && (
            <div className='col-lg-6 col-xl-4'>
              <TimeScatterPlot
                data={considered}
                attribute={"CHSY"}
                mainTitle={"Run time vs CHSY"}
                uniqueId={"2"}
              />
            </div>
          )}
          {performanceDisplayPlots.QueueRunVsASYPD && maxASYPD > 0 && (
            <div className='col-lg-6 col-xl-4'>
              <TimeScatterPlot
                data={considered}
                attribute={"ASYPD"}
                mainTitle={"Queue + Run time vs to ASYPD"}
                uniqueId={"3"}
              />
            </div>
          )}
        </div>
      )}
      {performancedata &&
        performancedata.warnings_job_data &&
        performancedata.warnings_job_data.length > 0 && (
          <div className='row py-2'>
            <div className='col-md-12'>
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
                    title='Opens a list of warnings, click again to close the list.'
                  >
                    Show warnings
                  </span>
                </button>
              </p>
            </div>
            <div className='collapse px-4' id='warningsCollapse'>
              <div className='card card-body p-1'>
                <ol className='py-0 my-0'>
                  {performancedata.warnings_job_data.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        )}

      <div className='row'>
        <div className='col'>
          <h3>Metrics description:</h3>
          <p>
            <strong>Parallelization</strong>: Total number of cores allocated
            for the run, per SIM.
          </p>
          <p>
            <strong>PE</strong>: Estimated requested Processing Elements. Usually 
            equals to Parallelization. This value considers the <strong>PROCESSORS_PER_NODE
              </strong> and <strong>NODES</strong>. If needed, it estimates 
              the <strong>NODES</strong> based on the number of <strong>TASKS</strong>.
          </p>
          <p>
            <strong>JPSY</strong>: Energy cost of a simulation, measured in
            Joules per simulated year. The JPSY <strong>value</strong> at the
            experiment level is the mean of the values calculated at the job
            level. Energy values are only collected for jobs running on{" "}
            <strong>Marenostrum4</strong>. In rare occassions the query that
            retrieves the energy information fails and the value stays at 0.
            Jobs with <strong>0</strong> energy value are not considered for the
            calculation.
          </p>
          <p>
            <strong>SYPD</strong>: Simulated Years Per Day for the model in a
            24h period. The <strong>value</strong> at the experiment level is
            the mean of the values calculated at the job level.
          </p>
          <p>
            <strong>ASYPD</strong>: Actual Simulated Years Per Day, this number
            should be lower than SYPD due to interruptions, queue wait time,{" "}
            <strong>POST</strong> jobs, data transfer, or issues with the model
            workflow. The ASYPD <strong>value</strong> calculated at the job
            level uses a generalization of the formula applied at the experiment
            level. As a consequence, the ASYPD value at the experiment level can
            be different that the mean of the values calculated at the job
            level.
          </p>
          <p>
            <strong>CHSY</strong>: Core Hours Per Simulated Year. This metric is
            the product of the model runtime for 1 Simulated Year and the number
            of processors (Parallelization) allocated. The CHSY{" "}
            <strong>value</strong> at the experiment level is the mean of the
            values calculated at the job level.
          </p>
          <p>
            <strong>RSYPD</strong>: "Real" Simulated Years Per Day. This
            variation of SYPD has been defined only at the experiment level. It
            depends on the existences of <strong>TRANSFER</strong> or{" "}
            <strong>CLEAN</strong> jobs. Then, it uses the finish time of the
            last TRANSFER or CLEAN job and the start time of the first SIM job
            in the experiment to calculate an approximation of the total
            duration of the simulation.
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
              href='https://earth.bsc.es/gitlab/es/autosubmit_api/-/wikis/Performance-Metrics'
              target='_blank'
              rel='noopener noreferrer'
            >
              Performance Metrics Documentation
            </a>{" "}
            for more details.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Performance;
