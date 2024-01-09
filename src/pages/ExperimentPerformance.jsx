import { useParams } from "react-router-dom"
import useASTitle from "../hooks/useASTitle"
import useBreadcrumb from "../hooks/useBreadcrumb"
import { useGetExperimentPerformanceQuery } from "../services/autosubmitApiV3"
import MetricScatterPlot from "../components/plots/MetricScatterPlot"
import { useEffect, useState } from "react"
import {
  secondsToDelta,
  arrayAverage,
  arrayStandardDeviation,
  arrayMeanAbsoluteDeviationAroundMean,
  formatNumberMoney,
} from "../components/context/utils"
import { Modal } from "react-bootstrap"
import TimeScatterPlot from "../components/plots/TimeScatterPlot"


const PERFORMANCE_PLOTS = [
  {
    key: "JPSYvsCHSY",
    title: "JPSY vs CHSY",
    disabled: (d) => (d.maxJPSY <= 0),
    type: "Scatter2D",
    attributeX: "JPSY",
    attributeY: "CHSY",
  },
  {
    key: "JPSYvsSYPD",
    title: "JPSY vs SYPD",
    disabled: (d) => (d.maxJPSY <= 0),
    type: "Scatter2D",
    attributeX: "JPSY",
    attributeY: "SYPD",
  },
  {
    key: "JPSYvsASYPD",
    title: "JPSY vs ASYPD",
    disabled: (d) => (d.maxJPSY <= 0),
    type: "Scatter2D",
    attributeX: "JPSY",
    attributeY: "ASYPD",
  },
  {
    key: "SYPDvsASYPD",
    title: "SYPD vs ASYPD",
    disabled: (d) => (d.maxASYPD <= 0),
    type: "Scatter2D",
    attributeX: "SYPD",
    attributeY: "ASYPD",
  },
  {
    key: "CHSYvsSYPD",
    title: "CHSY vs SYPD",
    disabled: (d) => (false),
    type: "Scatter2D",
    attributeX: "CHSY",
    attributeY: "SYPD",
  },
  {
    key: "CHSYvsASYPD",
    title: "CHSY vs ASYPD",
    disabled: (d) => (d.maxASYPD <= 0),
    type: "Scatter2D",
    attributeX: "CHSY",
    attributeY: "ASYPD",
  },
  {
    key: "RunVsSYPD",
    title: "Runtime vs SYPD",
    disabled: (d) => (false),
    type: "TimeScatter",
    attribute: "SYPD"
  },
  {
    key: "RunVsCHSY",
    title: "Runtime vs CHSY",
    disabled: (d) => (false),
    type: "TimeScatter",
    attribute: "CHSY"
  },
  {
    key: "QueueRunVsASYPD",
    title: "Queue+Runtime vs ASYPD",
    disabled: (d) => (d.maxASYPD <= 0),
    type: "TimeScatter",
    attribute: "ASYPD"
  },
]

const PerformancePlots = ({ considered }) => {
  const [displayPlots, setDisplayPlots] = useState({
    JPSYvsCHSY: false,
    JPSYvsSYPD: false,
    JPSYvsASYPD: false,
    SYPDvsASYPD: false,
    CHSYvsSYPD: false,
    CHSYvsASYPD: false,
    RunVsSYPD: false,
    RunVsCHSY: false,
    QueueRunVsASYPD: false,
  })

  const [auxStats, setAuxStats] = useState({
    consideredJPSY: [],
    maxJPSY: 0,
    maxASYPD: 0,
    JPSYdivisor: 1000,
    JPSYtitleX: "JPSY (thousands)"
  })

  useEffect(() => {
    if (Array.isArray(considered)) {
      const maxJPSY = Math.max(...Array.from(
        considered.map(item => { return parseInt(item.JPSY) })
      ))
      const maxASYPD = Math.max(...Array.from(
        considered.map(item => Number.parseFloat(item.ASYPD))
      ))
      const JPSYdivisor = maxJPSY > 999999999 ? 1000000 : 1000
      const JPSYtitleX =
        maxJPSY > 999999999 ? "JPSY (millions)" : "JPSY (thousands)";
      const consideredJPSY = considered.map(item => {
        return {
          ...item,
          JPSY: item.JPSY / JPSYdivisor
        }
      })

      const newAux = {
        consideredJPSY: consideredJPSY,
        maxJPSY: maxJPSY,
        maxASYPD: maxASYPD,
        JPSYdivisor: JPSYdivisor,
        JPSYtitleX: JPSYtitleX
      }
      setAuxStats(newAux)

      const newDisplay = {}
      PERFORMANCE_PLOTS.forEach(item => {
        newDisplay[item.key] = !item.disabled(newAux)
      })
      setDisplayPlots(newDisplay)
    }
  }, [considered])

  const handleCheckbox = (selector) => {
    setDisplayPlots({
      ...displayPlots,
      [selector]: !displayPlots[selector]
    })
  }

  return (
    <div className="d-flex flex-column gap-3 align-items-center">
      <div className="d-flex gap-3 flex-wrap justify-content-around">
        {
          PERFORMANCE_PLOTS.map(item => {
            return (
              <div className='form-check form-check-inline'>
                <input
                  type='checkbox'
                  className='form-check-input'
                  checked={displayPlots[item.key]}
                  onChange={() => handleCheckbox(item.key)}
                  disabled={item.disabled(auxStats)}
                />
                <label className='px-1 mx-1 form-check-label'>
                  {item.title}
                </label>
              </div>
            )
          })
        }
      </div>
      <div className="d-flex gap-3 flex-wrap justify-content-around" style={{ minHeight: 480 }}>
        {
          PERFORMANCE_PLOTS.map(item => {
            let plot = <></>
            if (displayPlots[item.key]) {
              if (item.type === "Scatter2D") {
                if (["JPSYvsCHSY", "JPSYvsSYPD", "JPSYvsASYPD"].includes(item.key)) {
                  plot = <MetricScatterPlot
                    data={auxStats.consideredJPSY}
                    attributeX={item.attributeX}
                    attributeY={item.attributeY}
                    titleX={auxStats.JPSYtitleX}
                    mainTitle={item.title}
                    uniqueId={item.title}
                  />
                } else {
                  plot = <MetricScatterPlot
                    data={considered}
                    attributeX={item.attributeX}
                    attributeY={item.attributeY}
                    mainTitle={item.title}
                    uniqueId={item.title}
                  />
                }
              } else if (item.type === "TimeScatter") {
                plot = <TimeScatterPlot
                  data={considered}
                  attribute={item.attribute}
                  mainTitle={item.title}
                  uniqueId={item.title}
                />
              }
            }
            return plot;
          })
        }
      </div>
    </div>
  )
}

const PerformanceConsideredJobs = ({ considered }) => {

  return (
    <table className='table table-sm table-bordered list-table'>
      <thead>
        <tr className='table-primary performance-table-header sticky-header'>
          <th scope='col'>
            #
          </th>
          <th scope='col' className='ps-2'>
            Job Name
          </th>
          {
            ["Queue", "Run", "CHSY", "SYPD", "ASYPD", "JPSY", "Energy"].map(title =>
              <th scope='col' className='text-end pe-2' key={title}>
                {title}
              </th>)
          }
        </tr>
      </thead>
      <tbody>
        {
          considered &&
          [...considered].sort((a, b) => (a.name > b.name ? 1 : -1))
            .map((item, index) => (
              <tr key={item.name}>
                <th scope='row'>{index + 1}</th>
                <td className='pl-1'>{item.name}</td>
                <td className='text-end pe-1'>
                  <strong> {secondsToDelta(item.queue)}</strong>
                </td>
                <td className='text-end pe-1'>
                  <strong>{secondsToDelta(item.running)}</strong>
                </td>
                <td className='text-end pe-1'>
                  {formatNumberMoney(item.CHSY)}
                </td>
                <td className='text-end pe-1'>
                  {formatNumberMoney(item.SYPD)}
                </td>
                <td className='text-end pe-1'>
                  {formatNumberMoney(item.ASYPD)}
                </td>
                <td className='text-end pe-1'>
                  {formatNumberMoney(item.JPSY, true)}
                </td>
                <td className='text-end pe-1'>
                  {formatNumberMoney(item.energy, true)}
                </td>
              </tr>
            ))}
      </tbody>
    </table>
  )
}




const PerformanceSummary = ({ data }) => {
  const [metrics, setMetrics] = useState(null)

  useEffect(() => {
    if (data && Array.isArray(data.considered)) {
      let newMetrics = {
        JPSY: data.considered.filter((x) => x.JPSY > 0).map(item => item.JPSY),
        SYPD: data.considered.map(item => item.SYPD),
        ASYPD: data.considered.map(item => item.ASYPD),
        CHSY: data.considered.map(item => item.CHSY),
      }
      setMetrics(newMetrics)
    }
  }, [data])

  return (
    <table className='table table-sm table-bordered list-table'>
      <thead>
        <tr className='table-primary performance-table-header'>
          <th scope='col'>Metric</th>
          {
            ["Value", "Min", "Max", "Mean", "SD", "MAD"].map(title =>
              <th scope='col' className='text-end pe-2' key={title}>
                {title}
              </th>)
          }
        </tr>
      </thead>
      <tbody>
        {
          metrics && ["JPSY", "SYPD", "ASYPD", "CHSY"].map(key => {
            return (
              <tr key={key}>
                <th scope='row'>{key}</th>
                <td className={'text-end pe-1' + (key === "ASYPD" ? " fw-bold" : "")}>
                  <span className='rounded px-1 bg-info'>
                    {formatNumberMoney(data[key], true)}
                  </span>
                </td>
                <td className='text-end pe-1'>
                  {formatNumberMoney(Math.min(...metrics[key]), true)}
                </td>
                <td className='text-end pe-1'>
                  {formatNumberMoney(Math.max(...metrics[key]), true)}
                </td>
                <td className={'text-end pe-1' + (key !== "ASYPD" ? " fw-bold" : "")}>
                  {formatNumberMoney(arrayAverage(metrics[key]))}
                </td>
                <td className='text-end pe-1'>
                  {formatNumberMoney(arrayStandardDeviation(metrics[key]))}
                </td>
                <td className='text-end pe-1'>
                  {formatNumberMoney(
                    arrayMeanAbsoluteDeviationAroundMean(metrics[key])
                  )}
                </td>
              </tr>
            )
          })
        }
      </tbody>
    </table>
  )
}

const ExperimentPerformance = () => {
  const routeParams = useParams()
  const [showWarnings, setShowWarnings] = useState(false)
  const [showHelp, setShowHelp] = useState(false)

  useASTitle(`Experiment ${routeParams.expid} performance`)
  useBreadcrumb([
    {
      name: `Experiment ${routeParams.expid}`,
      route: `/experiment/${routeParams.expid}`
    },
    {
      name: `Performance`,
      route: `/experiment/${routeParams.expid}/performance`
    }
  ])
  const { data, isFetching, refetch } = useGetExperimentPerformanceQuery(routeParams.expid)

  const toggleShowWarning = () => setShowWarnings(!showWarnings);
  const toggleShowHelp = () => setShowHelp(!showHelp);

  return (
    <>
      <Modal show={showWarnings} onHide={toggleShowWarning} centered>
        <Modal.Header closeButton
          bsPrefix="modal-header bg-warning text-white">
          <Modal.Title>
            <i className="fa-solid fa-triangle-exclamation mx-2"></i> Warnings
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ol>
            {
              data && Array.isArray(data.warnings_job_data) &&
              data.warnings_job_data.map(warning => <li key={warning}>
                {warning}
              </li>)
            }
          </ol>
        </Modal.Body>
      </Modal>

      <Modal show={showHelp} onHide={toggleShowHelp} centered size="xl">
        <Modal.Header closeButton
          bsPrefix="modal-header bg-dark text-white">
          <Modal.Title>
            <i className="fa-solid fa-circle-info mx-2"></i> Metrics description
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <strong>Parallelization</strong>: Total number of cores allocated
            for the run, per SIM.
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
        </Modal.Body>
      </Modal>

      <div className="w-100 flex-fill d-flex flex-column gap-3" style={{ minWidth: 0 }}>

        <div className="d-flex justify-content-between align-items-center flex-wrap">
          <h2 className="fw-semibold">PERFORMANCE METRICS</h2>
          <div className="d-flex gap-2 flex-wrap">
            {
              data && Array.isArray(data.warnings_job_data) && data.warnings_job_data.length > 0 &&
              <button className="btn btn-warning fw-bold text-white px-4"
                onClick={() => { toggleShowWarning() }}>
                WARNINGS ({data.warnings_job_data.length})
              </button>
            }
            <button className="btn btn-success fw-bold text-white"
              title="Refresh data"
              onClick={() => { refetch() }}>
              <i className="fa-solid fa-rotate-right"></i>
            </button>
          </div>
        </div>

        {
          isFetching ?
            <div className="w-100 h-100 d-flex align-items-center justify-content-center">
              <div className="spinner-border" role="status"></div>
            </div>
            :
            <>
              <div className="d-flex flex-wrap gap-3">

                <div className="rounded-4 border flex-fill mw-100">
                  <div className="bg-dark rounded-top-4 d-flex gap-3 justify-content-between align-items-center text-white px-4 py-2 mb-2">
                    <label className="fw-bold fs-6">SUMMARY</label>
                    <div>
                      <button className="btn btn-dark rounded-circle"
                        onClick={toggleShowHelp}>
                        <i className="fa-solid fa-circle-question"></i>
                      </button>
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="overflow-auto">
                      <PerformanceSummary data={data} />
                      <div className="d-flex flex-column">
                        <span>
                          <strong>Value</strong>: Value of the metric calculated at the experiment level.
                        </span>
                        <span>
                          <strong>SD</strong>: Standard Deviation.
                        </span>
                        <span>
                          <strong>MAD</strong>: Mean Absolute Deviation Around the Mean.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-4 border flex-fill mw-100">
                  <div className="bg-dark rounded-top-4 d-flex gap-3 justify-content-between align-items-center text-white px-4 py-2 mb-2">
                    <label className="fw-bold fs-6">CONSIDERED JOBS</label>
                    <div>
                      <button className="btn btn-dark rounded-circle"
                        onClick={toggleShowHelp}>
                        <i className="fa-solid fa-circle-question"></i>
                      </button>
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="overflow-auto" style={{ maxHeight: "50vh" }}>
                      <PerformanceConsideredJobs considered={data.considered} />
                    </div>
                  </div>
                </div>
              </div>


              <div className="rounded-4 border flex-fill">
                <div className="bg-dark rounded-top-4 d-flex gap-3 justify-content-between align-items-center text-white px-4 py-3 mb-4">
                  <label className="fw-bold fs-6">COMPARATIVE PLOTS</label>
                </div>

                <div className="p-3">
                  <PerformancePlots considered={data.considered} />
                </div>
              </div>
            </>
        }

      </div>
    </>

  )
}

export default ExperimentPerformance