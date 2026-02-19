import { useMemo, useState } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import Paginator from "../common/Paginator"
import { MAX_ITEMS_QUICK_VIEW } from '../consts'
import useASTitle from "../hooks/useASTitle"
import useBreadcrumb from "../hooks/useBreadcrumb"
import { autosubmitApiV4 } from "../services/autosubmitApiV4"
import { cn } from "../services/utils"


const QuickJobList = ({ jobs }) => {
  if (!Array.isArray(jobs) || jobs.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-4">
        <i className="fa-regular fa-face-frown text-4xl text-primary"></i>
        <span className="text text-gray-500">No jobs found</span>
      </div>
    )
  }

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
          <li key={job.name} className="flex gap-3 px-6">
            <span>
              <i className="fa-regular fa-circle text-primary" />
            </span>
            <span>{job.name} <span className={cn("badge", `badge-status-${job.status.toLowerCase()}`)}>#{job.status}</span></span>
          </li>
        );
      })}
    </ul>
  );
};


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
  const [searchParams, setSearchParams] = useSearchParams({});

  const currentPage = useMemo(() => {
    const page = parseInt(searchParams.get("page") || "1")
    return isNaN(page) ? 1 : page
  }, [searchParams])

  const { data, isFetching, refetch } = autosubmitApiV4.endpoints.getExperimentJobs.useQuery({
    expid: routeParams.expid,
    page: currentPage,
    page_size: MAX_ITEMS_QUICK_VIEW,
    status: searchParams.get("status") || undefined,
    query: searchParams.get("query") || undefined
  }, {
    skip: !routeParams.expid
  })

  const handlePageClick = (e) => {
    const selectedPage = e.selected
    setSearchParams({
      ...Object.fromEntries(searchParams.entries()),
      page: selectedPage
    })
  }

  const handleStatusChange = (event) => {
    const { status, ...rest } = Object.fromEntries(searchParams.entries())
    setSearchParams({
      ...rest,
      page: 1,
      ...(event.target.value && { status: event.target.value })
    })
  }

  const [queryInput, setQueryInput] = useState(searchParams.get("query") || "")

  const handleFilterClick = () => {
    const { query, ...rest } = Object.fromEntries(searchParams.entries())
    setSearchParams({
      ...rest,
      page: 1,
      ...(queryInput && { query: queryInput })
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
          <select value={searchParams.get("status") || ""} onChange={handleStatusChange}
            className="form-select border border-primary text-primary dark:bg-primary dark:text-white font-bold text-center">
            <option value="" className="bg-primary text-white">TOTAL</option>
            <option value="COMPLETED" className="badge-status-completed">COMPLETED</option>
            <option value="FAILED" className="badge-status-failed">FAILED</option>
            <option value="RUNNING" className="badge-status-running">RUNNING</option>
            <option value="QUEUING" className="badge-status-queuing">QUEUING</option>
          </select>
        </div>
        <div className="grow flex">
          <input
            className="form-input w-full rounded-r-none"
            placeholder="Filter job..."
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleFilterClick()} />
          <button className="btn btn-dark font-bold px-4 rounded-l-none border-l-0" onClick={handleFilterClick}>
            Filter
          </button>
        </div>
        <div className="text-sm" style={{ whiteSpace: "nowrap" }}>
          Showing {data?.pagination?.page_items || "0"} of <strong>{data?.pagination?.total_items || "0"} total jobs</strong>
        </div>
        <button className="btn btn-success"
          title="Refresh data"
          onClick={() => { refetch() }}>
          <i className="fa-solid fa-rotate-right"></i>
        </button>
      </div>
      <div className="relative grow basis-0 overflow-auto min-h-[70vh] lg:min-h-[50vh] w-full border p-4 rounded-lg custom-scrollbar bg-white">
        {isFetching ? (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white">
            <div className="spinner-border dark:invert" role="status"></div>
          </div>
        ) : (
          <QuickJobList jobs={data?.jobs}></QuickJobList>
        )}
      </div>
      <div className="flex justify-center items-center">
        <Paginator currentPage={currentPage} totalPages={data?.pagination?.total_pages || 1} onPageClick={handlePageClick}></Paginator>

      </div>
    </div>
  )
}

export default ExperimentQuick