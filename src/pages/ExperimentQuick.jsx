import { useParams } from "react-router-dom"
import { useGetExperimentQuickViewQuery } from "../services/autosubmitApiV3"
import { useEffect, useState } from "react"
import { MAX_ITEMS_QUICK_VIEW } from '../consts'
import useASTitle from "../hooks/useASTitle"
import useBreadcrumb from "../hooks/useBreadcrumb"

const QuickJobList = ({ jobs }) => {
  return (
    <ul
      className="text-sm flex flex-col gap-[0.35rem] py-1 font-thin"
      style={{
        fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
        color: "#333",
      }}
    >
      {jobs.map((job) => {
        return (
          <li key={job.refKey} className="flex gap-3 px-6">
            <span>
              <i className="fa-regular fa-circle text-primary" />
            </span>
            <span dangerouslySetInnerHTML={{ __html: job.title }}></span>
          </li>
        );
      })}
    </ul>
  );
};

/**
 * Filter the jobs received in the Quick View
 * @param {Array} baseData - Base Data
 * @param {string} filterText - Filter text. It can include ! at the begining for negation and * as a wildcard
 * @param {string} filterStatus - Posible values: ANY|COMPLETED|FAILED|RUNNING|QUEUING
 * @returns {Array}
 */
const filterQuickView = (baseData, filterText, filterStatus) => {

  let filterNorm = String(filterText).toUpperCase()

  const isNegation = filterNorm.indexOf('!') === 0;
  if (isNegation) {
    filterNorm = filterNorm.substring(1)
  }

  const fields = filterNorm.split("*")

  const newJobs = baseData.filter(item => {
    // Filter by status
    let flagStatus = true
    if (filterStatus !== "ANY") {
      flagStatus = (item.status === filterStatus)
    }

    // Filter by text
    let flagText = true
    let stringTest = String(item.refKey).toUpperCase();
    for (let i = 0; i < fields.length; i++) {
      if (fields[i].length > 0) {
        if (stringTest.indexOf(fields[i]) > -1) {
          let foundIndex = stringTest.indexOf(fields[i]) + fields[i].length;
          stringTest = stringTest.substring(foundIndex);
        } else {
          flagText = false
          break
        }
      }
    }

    // Use negation
    if (isNegation) {
      return !flagText && flagStatus
    } else {
      return flagText && flagStatus
    }
  })

  return newJobs;
}


const ExperimentQuick = () => {
  const routeParams = useParams()
  useASTitle(`Experiment ${routeParams.expid} quick view`)
  useBreadcrumb([
    {
      name: `Experiment ${routeParams.expid}`,
      route: `/experiment/${routeParams.expid}`
    },
    {
      name: `Quick View`,
      route: `/experiment/${routeParams.expid}/quick`
    }
  ])
  const [filters, setFilters] = useState({
    status: "ANY",
    filter: ""
  })
  const [jobs, setJobs] = useState([])
  const { data, isFetching, refetch } = useGetExperimentQuickViewQuery(routeParams.expid)

  useEffect(() => {
    if (data && Array.isArray(data.tree_view)) {
      let newJobs = filterQuickView(data.tree_view, filters.filter, filters.status)
      newJobs = newJobs.slice(0, MAX_ITEMS_QUICK_VIEW)
      setJobs(newJobs)
    }
  }, [data, filters])

  const handleFilterChange = (event) => {
    setFilters({
      ...filters,
      filter: event.target.value
    })
  }

  const handleStatusChange = (event) => {
    setFilters({
      ...filters,
      status: event.target.value
    })
  }

  return (
    <div className="w-full flex flex-col gap-4 grow">
      {
        (data?.error) &&
        <span className="alert alert-danger rounded-2xl">
          <i className="fa-solid fa-triangle-exclamation me-2"></i> {data?.error_message || "Unknown error"}
        </span>
      }
      <div className="flex gap-3 items-center flex-wrap">
        <div>
          <select value={filters.status} onChange={handleStatusChange}
            className="form-select border border-primary text-primary dark:bg-primary dark:text-white font-bold text-center">
            <option value="ANY">TOTAL ({(data && data.total) || 0})</option>
            <option value="COMPLETED">COMPLETED ({(data && data.completed) || 0})</option>
            <option value="FAILED">FAILED ({(data && data.failed) || 0})</option>
            <option value="RUNNING">RUNNING ({(data && data.running) || 0})</option>
            <option value="QUEUING">QUEUING ({(data && data.queuing) || 0})</option>
          </select>
        </div>
        <div className="grow">
          <input value={filters.filter} onChange={handleFilterChange}
            className="form-input w-full" placeholder="Filter job..." />
          {/* <button className="btn btn-dark fw-bold px-4">Filter</button> */}
        </div>
        <div className="text-sm" style={{ whiteSpace: "nowrap" }}>
          Showing {jobs.length} of <strong>{data && data.tree_view && data.tree_view.length} total jobs</strong>
        </div>
        <button className="btn btn-success"
          title="Refresh data"
          onClick={() => { refetch() }}>
          <i className="fa-solid fa-rotate-right"></i>
        </button>
      </div>
      <div className="relative grow basis-0 overflow-auto min-h-[70vh] lg:min-h-[50vh] w-full border p-4 rounded-lg custom-scrollbar bg-white">
        {isFetching && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white">
            <div className="spinner-border dark:invert" role="status"></div>
          </div>
        )}
        <QuickJobList jobs={jobs}></QuickJobList>
      </div>
    </div>
  )
}

export default ExperimentQuick