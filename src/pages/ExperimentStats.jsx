import { useParams, useSearchParams } from "react-router-dom"
import useASTitle from "../hooks/useASTitle"
import useBreadcrumb from "../hooks/useBreadcrumb"
import { useEffect, useRef, useState } from "react"
import { useGetExperimentStatsQuery } from "../services/autosubmitApiV3"
import { calculateStatistics } from "../components/context/utils"
import BarChart from "../components/statistics/BarChart"


const StatsMetricsTable = ({ stats, filteredStats, metrics, caption }) => {

  return (
    <table className="table table-sm table-bordered mb-0">
      <caption>{caption}</caption>
      <thead className="table-dark">
        <tr>
          <th>Metric</th>
          <th className="text-end">Value</th>
          {
            Object.keys(filteredStats).length > 0 &&
            <th className="text-end">
              Value <sup>(*)</sup>
            </th>}
        </tr>
      </thead>
      <tbody>
        {
          metrics.map(metric => <tr key={metric.key}>
            <td className="fw-bold">{metric.title}</td>
            <td className="text-end">{stats[metric.key]}</td>
            {
              Object.keys(filteredStats).length > 0 &&
              <td className="text-end">
                {filteredStats[metric.key]}
              </td>
            }
          </tr>)
        }
      </tbody>
    </table>
  )
}

/**
 * 
 * @param {Array} jobStats 
 * @param {string} pattern 
 * @returns {Array}
 */
const filterJobs = (jobStats, pattern) => {
  let isValidRegExp = true;
  try {
    new RegExp(pattern, "i");
  } catch (e) {
    isValidRegExp = false;
  }
  if (
    isValidRegExp === false ||
    String(pattern).trim().length === 0
  ) {
    const totalData = jobStats;
    return totalData
  }
  const re = RegExp(pattern, "i");
  const filteredDataSet = jobStats.filter((job) => {
    return re.test(job.name);
  });
  return filteredDataSet;
}

const StatsReport = ({ data, selectedSection }) => {
  const [pattern, setPattern] = useState("")
  const [stats, setStats] = useState({})
  const [filteredJobs, setFilteredJobs] = useState([])
  const [filteredStats, setFilteredStats] = useState({})

  useEffect(() => {
    if (data && data.Statistics && data.Statistics.JobStatistics) {
      const newStats = calculateStatistics(data.Statistics.JobStatistics)
      setStats(newStats)

      if (pattern) {
        const newFilterJobs = filterJobs(data.Statistics.JobStatistics, pattern)
        const newFilterStats = calculateStatistics(newFilterJobs);
        setFilteredJobs(newFilterJobs)
        setFilteredStats(newFilterStats)
      } else {
        setFilteredJobs(data.Statistics.JobStatistics)
        setFilteredStats({})
      }
    }
  }, [data, pattern])

  const handleFilterChange = (e) => {
    setPattern(e.target.value)
  }

  return (
    <div className="d-flex flex-column flex-fill">

      <div className="rounded-4 border flex-fill">
        <div className="bg-dark rounded-top-4 d-flex gap-3 justify-content-between align-items-center text-white px-4 py-2 mb-4">
          <label className="d-flex gap-2 align-items-center">
            Selected job section: <span className="badge bg-primary text-white">
              {selectedSection}
            </span>
          </label>
          {
            data && data.Statistics && data.Statistics.Period &&
            <label className="d-flex gap-2 align-items-center">
              Time range: <span className="badge bg-primary text-white">{
                data.Statistics.Period.From !== "None" ? data.Statistics.Period.From : "Start of experiment"
              }</span> to <span className="badge bg-primary text-white">{data.Statistics.Period.To}</span>
            </label>
          }

          <div>
            <label className="small me-2">Filter jobs:</label>
            <input className="form-control-sm px-3" placeholder="e.g: _71_SIM"
              onChange={handleFilterChange} />
          </div>
        </div>

        {
          data && data.Statistics && data.Statistics.JobStatistics &&
          <>
            <div className="d-flex px-3 mb-3 gap-4 justify-content-center">
              <span>
                CPU Consumption <span className="bg-light rounded px-1">{`${stats.cpuConsumptionPercentage} %`}</span> {Object.keys(filteredStats).length > 0 && <span className="bg-light rounded px-1">{`${filteredStats.cpuConsumptionPercentage} %`}<sup>(*)</sup></span>}
              </span>
              <span>
                Total Queue Time <span className="bg-light rounded px-1">{`${stats.totalQueueTime} hours`}</span> {Object.keys(filteredStats).length > 0 && <span className="bg-light rounded px-1">{`${filteredStats.totalQueueTime} hours`}<sup>(*)</sup></span>}
              </span>
            </div>


            <div className="d-flex gap-3 px-3">

              <StatsMetricsTable
                stats={stats}
                filteredStats={filteredStats}
                metrics={[
                  {
                    title: "Jobs Submitted",
                    key: "jobsSubmittedCount"
                  },
                  {
                    title: "Jobs Run",
                    key: "jobsRunCount"
                  },
                  {
                    title: "Jobs Completed",
                    key: "jobsCompletedCount"
                  },
                  {
                    title: "Jobs Failed",
                    key: "jobsFailedCount"
                  },
                ]}
                caption="Considers number of jobs and retrials."
              />

              <StatsMetricsTable
                stats={stats}
                filteredStats={filteredStats}
                metrics={[
                  {
                    title: "Expected Consumption (h)",
                    key: "expectedConsumption"
                  },
                  {
                    title: "Real Consumption (h)",
                    key: "realConsumption"
                  },
                  {
                    title: "Failed Real Consumption (h)",
                    key: "failedRealConsumption"
                  },
                ]}
                caption="Considers the running time of the jobs and retrials."
              />

              <StatsMetricsTable
                stats={stats}
                filteredStats={filteredStats}
                metrics={[
                  {
                    title: "Expected CPU Consumption (h)",
                    key: "expectedCpuConsumption"
                  },
                  {
                    title: "CPU Consumption (h)",
                    key: "cpuConsumption"
                  },
                  {
                    title: "Failed CPU Consumption (h)",
                    key: "failedCpuConsumption"
                  },
                ]}
                caption="Considers the number of processors requested by the job (and retrials) multiplied by the corresponding running time."
              />

            </div>

            <div className="d-flex justify-content-center p-4 gap-3 flex-wrap">
              <BarChart
                data={filteredJobs}
                title="Statistics"
                metrics={["completedQueueTime", "completedRunTime", "failedQueueTime", "failedRunTime"]}
                xtitle="Hours"
                helperId={"4"} />
              <BarChart
                data={filteredJobs}
                title="Failed Attempts per Job"
                metrics={["failedCount"]}
                xtitle="Attempts"
                helperId={"1"} />
            </div>
          </>
        }

      </div>
    </div>
  )
}

const ExperimentStats = () => {
  const routeParams = useParams()
  const [searchParams, setSearchParams] = useSearchParams()

  const sectionRef = useRef()
  const hourRef = useRef()
  useASTitle(`Experiment ${routeParams.expid} statistics`)
  useBreadcrumb([
    {
      name: `Experiment ${routeParams.expid}`,
      route: `/experiment/${routeParams.expid}`
    },
    {
      name: `Statistics`,
      route: `/experiment/${routeParams.expid}/stats`
    }
  ])
  const { data, isFetching } = useGetExperimentStatsQuery({
    expid: routeParams.expid,
    section: searchParams.get("section") || "Any",
    hours: searchParams.get("hours") || "0"
  }, {
    skip: (!searchParams.get("section") && !searchParams.get("hours"))
  })

  useEffect(() => {
    sectionRef.current.value = searchParams.get("section")
    hourRef.current.value = searchParams.get("hours")
  }, [searchParams])



  const handleGetStats = (e) => {
    e.preventDefault()
    sectionRef.current.value = sectionRef.current.value || "Any"
    hourRef.current.value = hourRef.current.value || "0"
    setSearchParams({
      section: sectionRef.current.value,
      hours: hourRef.current.value
    })
  }

  return (
    <div className="w-100 d-flex flex-column" style={{ minWidth: 0 }}>
      <form onSubmit={handleGetStats} className="mb-4 d-flex gap-3 align-items-center">
        <label className="text-nowrap">Job section:</label>
        <input className="form-control" ref={sectionRef} placeholder="e.g: SIM (optional)" />
        <label className="text-nowrap">Past hours (from now):</label>
        <input type="number" className="form-control" ref={hourRef} placeholder="e.g: 72 (optional)" />
        <button className="btn btn-dark px-4 fw-bold text-nowrap" onClick={handleGetStats}>Get Statistics</button>
      </form>

      {
        isFetching ?
          <div className="w-100 h-100 d-flex align-items-center justify-content-center">
            <div className="spinner-border" role="status"></div>
          </div>
          :
          (!searchParams.get("section") && !searchParams.get("hours")) ?
            <div className="w-100 h-100 d-flex flex-column gap-3 align-items-center justify-content-center">
              <i className="fa-solid fa-magnifying-glass fs-1"></i>
              <div>Please press the <strong>"Get Statistics"</strong> button to continue</div>
            </div>
            :
            <StatsReport
              data={data}
              selectedSection={searchParams.get("section")}
            />
      }

    </div>
  )
}

export default ExperimentStats