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


const PerformancePlots = () => {
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

  return (
    <div>

    </div>
  )
}

const PerformanceConsideredJobs = ({ considered }) => {

  return (
    <table className='table table-sm table-bordered list-table'>
      <thead className='thead'>
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
      <thead className='thead'>
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
  useASTitle(`Experiment ${routeParams.expid} performance`)
  useBreadcrumb([
    {
      name: `Experiment ${routeParams.expid}`,
      route: `/experiment/${routeParams.expid}`
    },
    {
      name: `Statistics`,
      route: `/experiment/${routeParams.expid}/performance`
    }
  ])

  const { data, isFetching, refetch } = useGetExperimentPerformanceQuery(routeParams.expid)

  useEffect(() => {

  }, [data])

  return (
    <div className="w-100 flex-fill d-flex flex-column gap-3" style={{ minWidth: 0 }}>

      <div className="d-flex justify-content-between align-items-center">
        <h2 className="fw-bold">PERFORMANCE METRICS</h2>
        <div className="d-flex gap-2">
          {/* <button className="btn btn-warning fw-bold text-white px-5" onClick={() => { refetch() }}>WARNING (0)</button> */}
          <button className="btn btn-success fw-bold text-white px-5" onClick={() => { refetch() }}>REFRESH</button>
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

              <div className="rounded-4 border flex-fill" style={{ minWidth: "40rem" }}>
                <div className="bg-dark rounded-top-4 d-flex gap-3 justify-content-between align-items-center text-white px-4 py-3 mb-2">
                  <label className="fw-bold fs-5">SUMMARY</label>
                </div>
                <div className="p-3">
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

              <div className="rounded-4 border flex-fill" style={{ minWidth: "40rem" }}>
                <div className="bg-dark rounded-top-4 d-flex gap-3 justify-content-between align-items-center text-white px-4 py-3 mb-2">
                  <label className="fw-bold fs-5">CONSIDERED JOBS</label>
                </div>
                <div className="p-3">
                  <PerformanceConsideredJobs considered={data.considered} />
                </div>
              </div>
            </div>


            {/* <div className="rounded-4 border flex-fill">
              <div className="bg-dark rounded-top-4 d-flex gap-3 justify-content-between align-items-center text-white px-4 py-3 mb-4">
                <label className="fw-bold fs-5">COMPARATIVE PLOTS</label>
              </div>

              <div className="px-4 py-2 d-flex gap-4 flex-wrap justify-content-around">
                <MetricScatterPlot
                  data={data.considered}
                  attributeX={"CHSY"}
                  attributeY={"SYPD"}
                  mainTitle={"CHSY vs SYPD"}
                  uniqueId={"8"}
                />
              </div>

            </div> */}
          </>
      }

    </div>
  )
}

export default ExperimentPerformance