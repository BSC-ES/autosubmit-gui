import { useParams, useSearchParams } from "react-router-dom";
import { autosubmitApiV4 } from "../services/autosubmitApiV4";
import { useEffect, useState, useMemo } from "react";
import { MAX_ITEMS_QUICK_VIEW } from '../consts';
import useASTitle from "../hooks/useASTitle";
import useBreadcrumb from "../hooks/useBreadcrumb";
import { cn } from "../services/utils";
import { ChangeStatusModal } from "../common/ChangeStatusModal";
import BottomPanel from "../common/BottomPanel";
import FetchJobDetailCard from "../common/FetchJobDetailCard";
import Paginator from "../common/Paginator";


const QuickJobList = ({ jobs, onSelectionChange }) => {
  if (!Array.isArray(jobs) || jobs.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-4">
        <i className="fa-regular fa-face-frown text-4xl text-primary"></i>
        <span className="text text-gray-500">No jobs found</span>
      </div>
    );
  }

  const [selectedJobIds, setSelectedJobIds] = useState(new Set());
  const [lastClickedIndex, setLastClickedIndex] = useState(null);

  const handleJobClick = (index, jobName, event) => {
    if (event.shiftKey && lastClickedIndex !== null && jobs) {
      // Shift+click: select range
      const start = Math.min(lastClickedIndex, index);
      const end = Math.max(lastClickedIndex, index);
      const newSelected = new Set(selectedJobIds);
      for (let i = start; i <= end; i++) {
        newSelected.add(jobs[i].name);
      }
      setSelectedJobIds(newSelected);
    } else if (event.ctrlKey || event.metaKey) {
      // Ctrl/Cmd+click: toggle selection
      const newSelected = new Set(selectedJobIds);
      if (newSelected.has(jobName)) {
        newSelected.delete(jobName);
      } else {
        newSelected.add(jobName);
      }
      setSelectedJobIds(newSelected);
      setLastClickedIndex(index);
    } else {
      // Regular click: select only this item
      setSelectedJobIds(new Set([jobName]));
      setLastClickedIndex(index);
    }
  };

  useEffect(() => {
    onSelectionChange(selectedJobIds);
  }, [selectedJobIds]);

  return (
    <ul
      className="text-sm flex flex-col gap-[0.3rem] py-1 font-thin"
      style={{
        fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
        color: "#333",
      }}
    >
      {jobs.map((job, index) => {
        const isSelected = selectedJobIds.has(job.name);

        return (
          <li
            key={job.name}
            className="flex gap-3 px-6"
            onClick={(event) => handleJobClick(index, job.name, event)}
          >
            <span>
              <i className="fa-regular fa-circle text-primary" />
            </span>
            <div
              className={cn(
                "px-1 py-[1px] hover:bg-gray-100 rounded cursor-pointer select-none",
                isSelected && "bg-blue-100 hover:bg-blue-200",
              )}
             >{job.name} <span className={cn("badge", `badge-status-${job.status.toLowerCase()}`)}>#{job.status}</span
            ></div>
          </li>
        );
      })}
    </ul>
  );
};


const ExperimentQuick = () => {
  const routeParams = useParams();
  useASTitle(`Experiment ${routeParams.expid} quick view`);
  useBreadcrumb([
    {
      name: `Experiment ${routeParams.expid}`,
      route: `/experiment/${routeParams.expid}`,
    },
    {
      name: `Quick View`,
      route: `/experiment/${routeParams.expid}/quick`,
    },
  ]);
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

  const [showModal, setShowModal] = useState(false);
  const toggleModal = (refresh = false) => {
    setShowModal(!showModal);
    if (refresh === true) {
      refetch();
    }
  };

  const [selectedJobIds, setSelectedJobIds] = useState(new Set());
  const handleJobSelectionChange = (selectedIds) => {
    setSelectedJobIds(selectedIds);
  };

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
      {data?.error && (
        <span className="alert alert-danger rounded-2xl">
          <i className="fa-solid fa-triangle-exclamation me-2"></i>{" "}
          {data?.error_message || "Unknown error"}
        </span>
      )}
      <div className="flex gap-3 items-center flex-wrap">
        <div>
          <select
            value={searchParams.get("status") || ""}
            onChange={handleStatusChange}
            className="form-select border border-primary text-primary dark:bg-primary dark:text-white font-bold text-center"
          >
            <option value="" className="bg-primary text-white">TOTAL</option>
            <option value="COMPLETED" className="badge-status-completed">
              COMPLETED
            </option>
            <option value="FAILED" className="badge-status-failed">
              FAILED
            </option>
            <option value="RUNNING" className="badge-status-running">
              RUNNING
            </option>
            <option value="QUEUING" className="badge-status-queuing">
              QUEUING
            </option>
            <option value="READY" className="badge-status-ready">
              READY
            </option>
            <option value="WAITING" className="badge-status-waiting">
              WAITING
            </option>
            <option value="SUBMITTED" className="badge-status-submitted">
              SUBMITTED
            </option>
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
        <button
          className="btn btn-success"
          title="Refresh data"
          onClick={() => {
            refetch();
          }}
        >
          <i className="fa-solid fa-rotate-right"></i>
        </button>
      </div>
      <div className="relative grow basis-0 overflow-auto min-h-[70vh] lg:min-h-[50vh] w-full border p-4 rounded-lg custom-scrollbar bg-white">
        {isFetching ? (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white">
            <div className="spinner-border dark:invert" role="status"></div>
          </div>
        ) : (
          <QuickJobList
            jobs={data?.jobs}
            onSelectionChange={handleJobSelectionChange}
          ></QuickJobList>
        )}
      </div>
      <div className="flex justify-center items-center">
        <Paginator currentPage={currentPage} totalPages={data?.pagination?.total_pages || 1} onPageClick={handlePageClick}></Paginator>
      </div>

      {selectedJobIds.size > 0 && (
        <BottomPanel
          title={
            selectedJobIds.size === 1
              ? selectedJobIds.values().next().value
              : `${selectedJobIds.size} jobs selected`
          }
        >
          <div className="flex flex-col gap-3">
            {selectedJobIds.size === 1 && (
              <FetchJobDetailCard
                expid={routeParams.expid}
                jobName={selectedJobIds.values().next().value}
              />
            )}

            <div className="flex items-center justify-center gap-3">
              <div className="font-semibold">Actions:</div>
              <button className="btn btn-primary" onClick={toggleModal}>
                Change status
              </button>
            </div>
            <ChangeStatusModal
              selectedJobs={Array.from(selectedJobIds)}
              show={showModal}
              onHide={toggleModal}
              expid={routeParams.expid}
            />
          </div>
        </BottomPanel>
      )}
    </div>
  );
};

export default ExperimentQuick;
