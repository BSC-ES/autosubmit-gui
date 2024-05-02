import { useParams } from "react-router-dom"
import useASTitle from "../hooks/useASTitle"
import useBreadcrumb from "../hooks/useBreadcrumb"
import { useGetExperimentPerformanceQuery } from "../services/autosubmitApiV3"
import MetricScatterPlot from "../components/plots/MetricScatterPlot"
import { Fragment, useEffect, useState } from "react"
import {
  secondsToDelta,
  arrayAverage,
  arrayStandardDeviation,
  arrayMeanAbsoluteDeviationAroundMean,
  formatNumberMoney,
} from "../components/context/utils"
import TimeScatterPlot from "../components/plots/TimeScatterPlot"
import { cn, exportToCSV } from "../services/utils"
import Modal from "../common/Modal"
import { Dialog } from "@headlessui/react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../common/Table"


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
    <div className="flex flex-col gap-3 items-center">
      <div className="flex gap-3 flex-wrap justify-around">
        {
          PERFORMANCE_PLOTS.map(item => {
            return (
              <div key={item.key} className='form-check form-check-inline'>
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
      <div className="w-full flex gap-3 flex-wrap justify-around" style={{ minHeight: 480 }}>
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
            return <Fragment key={item.key}>
              {plot}
            </Fragment>;
          })
        }
      </div>
    </div>
  )
}

const PerformanceConsideredJobs = ({ considered }) => {

  return (
    <>
      <Table>
        <TableHead>
          <TableRow className="bg-primary-200 font-bold sticky top-0">
            {[
              "Chunk",
              "Job Name",
              "Queue",
              "Run",
              "CHSY",
              "SYPD",
              "ASYPD",
              "JPSY",
              "Energy",
            ].map((title) => (
              <TableHeader className="py-1" key={title}>
                {title}
              </TableHeader>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {considered &&
            [...considered]
              .sort((a, b) => {
                if (a.chunk === b.chunk) {
                  return a.name > b.name ? 1 : -1;
                } else {
                  return a.chunk > b.chunk ? 1 : -1;
                }
              })
              .map((item) => (
                <TableRow key={item.name}>
                  <TableCell className="py-1">{item.chunk}</TableCell>
                  <TableCell className="py-1">{item.name}</TableCell>
                  <TableCell className="py-1">
                    <strong> {secondsToDelta(item.queue)}</strong>
                  </TableCell>
                  <TableCell className="py-1">
                    <strong>{secondsToDelta(item.running)}</strong>
                  </TableCell>
                  <TableCell className="py-1">
                    {formatNumberMoney(item.CHSY)}
                  </TableCell>
                  <TableCell className="py-1">
                    {formatNumberMoney(item.SYPD)}
                  </TableCell>
                  <TableCell className="py-1">
                    {formatNumberMoney(item.ASYPD)}
                  </TableCell>
                  <TableCell className="py-1">
                    {formatNumberMoney(item.JPSY, true)}
                  </TableCell>
                  <TableCell className="py-1">
                    {formatNumberMoney(item.energy, true)}
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
      
    </>
  );
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
    <>
      <Table>
        <TableHead>
          <TableRow className="bg-primary-200 font-bold">
            {["Metric", "Value", "Min", "Max", "Mean", "SD", "MAD"].map(
              (title) => (
                <TableHeader className="py-1" key={title}>
                  {title}
                </TableHeader>
              )
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {metrics &&
            Object.keys(metrics).map((key) => {
              return (
                <TableRow key={key}>
                  <TableCell className="py-1 font-bold">{key}</TableCell>
                  <TableCell
                    className={cn("py-1", key === "ASYPD" ? " font-bold" : "")}
                  >
                    <span className="rounded px-1 bg-light">
                      {formatNumberMoney(data[key], true)}
                    </span>
                  </TableCell>
                  <TableCell className="py-1">
                    {formatNumberMoney(Math.min(...metrics[key]), true)}
                  </TableCell>
                  <TableCell className="py-1">
                    {formatNumberMoney(Math.max(...metrics[key]), true)}
                  </TableCell>
                  <TableCell
                    className={cn("py-1", key !== "ASYPD" ? " font-bold" : "")}
                  >
                    {formatNumberMoney(arrayAverage(metrics[key]))}
                  </TableCell>
                  <TableCell className="py-1">
                    {formatNumberMoney(arrayStandardDeviation(metrics[key]))}
                  </TableCell>
                  <TableCell className="py-1">
                    {formatNumberMoney(
                      arrayMeanAbsoluteDeviationAroundMean(metrics[key])
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </>
  );
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
  const { data, isFetching, refetch, isError } = useGetExperimentPerformanceQuery(routeParams.expid)

  const toggleShowWarning = () => setShowWarnings(!showWarnings);
  const toggleShowHelp = () => setShowHelp(!showHelp);

  const exportConsideredToCSV = (considered, expid) => {
    const exportableData = [...considered].sort((a, b) => {
      if (a.chunk === b.chunk) {
        return a.name > b.name ? 1 : -1
      } else {
        return a.chunk > b.chunk ? 1 : -1
      }
    }).map(item => {
      return [
        item.chunk,
        item.name,
        secondsToDelta(item.queue),
        secondsToDelta(item.running),
        formatNumberMoney(item.CHSY),
        formatNumberMoney(item.SYPD),
        formatNumberMoney(item.ASYPD),
        formatNumberMoney(item.JPSY, true),
        formatNumberMoney(item.energy, true)
      ]
    })
    exportToCSV(
      ["Chunk", "Job Name", "Queue", "Run", "CHSY", "SYPD", "ASYPD", "JPSY", "Energy"],
      exportableData,
      `${(new Date()).toISOString()}_ConsideredPerformance_${expid}.csv`,
      "\t"
    )
  }

  return (
    <>
      <Modal show={showWarnings} onClose={toggleShowWarning}>

        <Dialog.Title className={"bg-warning text-white py-4 px-4 text-2xl font-semibold rounded-t-lg flex gap-4 justify-between items-center"}>
          <span>
            <i className="fa-solid fa-triangle-exclamation mx-2"></i> Warnings
          </span>
          <div className="cursor-pointer" onClick={toggleShowWarning}>
            <i className="fa-solid fa-xmark"></i>
          </div>
        </Dialog.Title>
        <div className="bg-white text-black py-6 px-6 rounded-b-lg">
          <ol className="list-decimal ms-4">
            {
              data && Array.isArray(data.warnings_job_data) &&
              data.warnings_job_data.map(warning => <li key={warning}>
                {warning}
              </li>)
            }
          </ol>
        </div>
      </Modal>

      <Modal show={showHelp} onClose={toggleShowHelp}>

        <Dialog.Title className={"bg-dark text-white py-4 px-4 text-2xl font-semibold rounded-t-lg flex gap-4 justify-between items-center"}>
          <span>
            <i className="fa-solid fa-circle-light mx-2"></i> Metrics description
          </span>
          <div className="cursor-pointer" onClick={toggleShowHelp}>
            <i className="fa-solid fa-xmark"></i>
          </div>
        </Dialog.Title>
        <div className="bg-white text-black py-6 px-6 rounded-b-lg">
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

        </div>
      </Modal>

      <div className="w-full grow flex flex-col gap-4 min-w-0"  >
        {
          (isError || data?.error) &&
          <span className="alert alert-danger rounded-2xl">
            <i className="fa-solid fa-triangle-exclamation me-2"></i> {data?.error_message || "Unknown error"}
          </span>
        }
        <div className="flex justify-between items-center flex-wrap">
          <h2 className="text-3xl font-semibold">PERFORMANCE METRICS</h2>
          <div className="flex gap-2 flex-wrap">
            {
              data && Array.isArray(data.warnings_job_data) && data.warnings_job_data.length > 0 &&
              <button className="btn btn-warning font-bold text-white px-4"
                onClick={() => { toggleShowWarning() }}>
                WARNINGS ({data.warnings_job_data.length})
              </button>
            }
            <button className="btn btn-success font-bold text-white"
              title="Refresh data"
              onClick={() => { refetch() }}>
              <i className="fa-solid fa-rotate-right"></i>
            </button>
          </div>
        </div>

        {
          isFetching ?
            <div className="w-full h-full flex items-center justify-center">
              <div className="spinner-border" role="status"></div>
            </div>
            :
            <>
              <div className="flex flex-wrap gap-3 w-full">

                <div className="rounded-2xl border grow min-w-0 dark:bg-neutral-50 dark:text-black">
                  <div className="bg-dark rounded-t-xl flex gap-3 justify-between items-center text-white px-6 py-2 mb-2">
                    <label className="font-bold">SUMMARY</label>
                    <div>
                      <button className="btn btn-dark rounded-full"
                        onClick={toggleShowHelp}>
                        <i className="fa-solid fa-circle-question"></i>
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="overflow-auto">
                      <PerformanceSummary data={data} />
                      <div className="flex flex-col mt-4">
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

                <div className="rounded-2xl border grow min-w-0 dark:bg-neutral-50 dark:text-black">
                  <div className="bg-dark rounded-t-xl flex gap-3 justify-between items-center text-white px-6 py-2 mb-2">
                    <label className="font-bold">CONSIDERED JOBS</label>
                    <div>
                      <button className="btn btn-dark rounded-full"
                        onClick={toggleShowHelp}>
                        <i className="fa-solid fa-circle-question"></i>
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="overflow-auto custom-scrollbar" style={{ maxHeight: "50vh" }}>
                      <PerformanceConsideredJobs considered={data.considered} />
                    </div>
                    <div className="text-end mt-2">
                    <button
                      onClick={() => exportConsideredToCSV(data.considered, routeParams.expid)}
                      className="btn btn-light text-sm border"
                    >
                      Export to CSV
                    </button>
                  </div>
                  </div>
                </div>
              </div>


              <div className="rounded-2xl border grow dark:bg-neutral-50 dark:text-black">
                <div className="bg-dark rounded-t-xl flex gap-3 justify-between items-center text-white px-4 py-3 mb-4">
                  <label className="font-bold">COMPARATIVE PLOTS</label>
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