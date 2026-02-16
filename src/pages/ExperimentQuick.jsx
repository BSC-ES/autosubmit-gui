import { useParams, useSearchParams } from "react-router-dom";
import { autosubmitApiV4 } from "../services/autosubmitApiV4";
import { useEffect, useState, useMemo } from "react";
import { DEFAULT_ITEMS_QUICK_VIEW } from '../consts';
import useASTitle from "../hooks/useASTitle";
import useBreadcrumb from "../hooks/useBreadcrumb";
import { cn, getStatusBadgeStyle, JOB_STATUSES } from "../services/utils";
import { ChangeStatusModal } from "../common/ChangeStatusModal";
import BottomPanel from "../common/BottomPanel";
import FetchJobDetailCard from "../common/FetchJobDetailCard";
import Paginator from "../common/Paginator";

const ITEMS_PER_PAGE_OPTIONS = [DEFAULT_ITEMS_QUICK_VIEW, 500, 1000];
const DEFAULT_STATUS_QUICK_VIEW = "Any status";

const QuickJobList = ({ jobs, selectedJobIds, onSelectionChange }) => {
  const [lastClickedIndex, setLastClickedIndex] = useState(null);

  useEffect(() => {
    onSelectionChange(selectedJobIds);
  }, [selectedJobIds, onSelectionChange]);

  if (!Array.isArray(jobs) || jobs.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-4">
        <i className="fa-regular fa-face-frown text-4xl text-primary"></i>
        <span className="text text-gray-500">No jobs found</span>
      </div>
    );
  }

  const handleJobClick = (index, jobName, event) => {
    if (event.shiftKey && lastClickedIndex !== null && jobs) {
      // Shift+click: select range
      const start = Math.min(lastClickedIndex, index);
      const end = Math.max(lastClickedIndex, index);
      const newSelected = new Set(selectedJobIds);
      for (let i = start; i <= end; i++) {
        newSelected.add(jobs[i].name);
      }
      onSelectionChange(newSelected);
    } else if (event.ctrlKey || event.metaKey) {
      // Ctrl/Cmd+click: toggle selection
      const newSelected = new Set(selectedJobIds);
      if (newSelected.has(jobName)) {
        newSelected.delete(jobName);
      } else {
        newSelected.add(jobName);
      }
      onSelectionChange(newSelected);
      setLastClickedIndex(index);
    } else {
      // Regular click: select only this item
      onSelectionChange(new Set([jobName]));
      setLastClickedIndex(index);
    }
  };

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
            >
              {job.name} <span className={cn("badge", getStatusBadgeStyle(job.status.toUpperCase()))}>#{job.status}</span>
            </div>
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

  const status = useMemo(() => {
    const raw = searchParams.get("status")
    return JOB_STATUSES.includes(raw) ? raw : undefined
  }, [searchParams])

  const currentPage = useMemo(() => {
    const page = parseInt(searchParams.get("page") || "1", 10)
    return !Number.isFinite(page) || page <= 0 ? 1 : page
  }, [searchParams])

  const pageSize = useMemo(() => {
    const raw = searchParams.get("page_size")
    const size = parseInt(raw || "", 10)

    // Ignore non-valid or non-whitelisted values
    if (!Number.isFinite(size) || !ITEMS_PER_PAGE_OPTIONS.includes(size)) {
      return DEFAULT_ITEMS_QUICK_VIEW
    }

    return size
  }, [searchParams])

  const [jobNameInput, setJobNameInput] = useState(searchParams.get("job_name") || "")

  const jobName = searchParams.get("job_name") || undefined;

  useEffect(() => {
    setJobNameInput(jobName || "");
  }, [jobName]);

  useEffect(() => {
    const rawStatus = searchParams.get("status");
    const rawPageSize = searchParams.get("page_size");
    const rawPage = searchParams.get("page");

    const parsedPageSize = Number.parseInt(
      rawPageSize || "",
      10,
    );

    const parsedPage = Number.parseInt(
      rawPage || "",
      10,
    );

    const invalidStatus =
      rawStatus &&
      !JOB_STATUSES.includes(rawStatus);

    const invalidPageSize =
      rawPageSize &&
      (!Number.isFinite(parsedPageSize) ||
        !ITEMS_PER_PAGE_OPTIONS.includes(parsedPageSize));

    const invalidPage =
      rawPage &&
      (!Number.isInteger(parsedPage) || parsedPage < 1);

    if (invalidStatus || invalidPageSize || invalidPage) {
      const nextParams = new URLSearchParams(searchParams);

      if (invalidStatus) {
        nextParams.delete("status");
      }

      if (invalidPageSize) {
        nextParams.delete("page_size");
      }

      if (invalidPage) {
        nextParams.delete("page");
      }

      setSearchParams(nextParams, {
        replace: true,
      });
    }
  }, [searchParams, setSearchParams]);

  const { data, isFetching, isError, error, refetch } = autosubmitApiV4.endpoints.getExperimentJobs.useQuery({
    expid: routeParams.expid,
    view: "quick",
    job_name: jobName,
    status: status,
    page: currentPage,
    page_size: pageSize
  }, {
    skip: !routeParams.expid
  })

  useEffect(() => {
    const totalPages = data?.pagination?.total_pages;

    if (totalPages && currentPage > totalPages) {
      const nextParams = new URLSearchParams(searchParams);

      nextParams.set("page", "1");

      setSearchParams(nextParams, {
        replace: true,
      });
    }
  }, [data, currentPage, searchParams, setSearchParams]);

  const [showModal, setShowModal] = useState(false);
  const toggleModal = (refresh = false) => {
    setShowModal(!showModal);
    if (refresh === true) {
      refetch();
    }
  };

  const [selectedJobIds, setSelectedJobIds] = useState(new Set());

  useEffect(() => {
    setSelectedJobIds(new Set());
  }, [routeParams.expid, currentPage, pageSize, status, jobName]);

  const handlePageClick = (e) => {
    const selectedPage = e.selected
    setSearchParams({
      ...Object.fromEntries(searchParams.entries()),
      page: selectedPage
    })
  }

  const handleStatusChange = (event) => {
    const { status, ...rest } = Object.fromEntries(searchParams.entries())
    const incomingStatus = event.target.value
    setSearchParams({
      ...rest,
      page: 1,
      ...(JOB_STATUSES.includes(incomingStatus) && { status: incomingStatus })
    })
  }

  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value, 10)
    setSearchParams({
      ...Object.fromEntries(searchParams.entries()),
      page: 1,
      page_size: newSize
    })
  }

  const handleFilterClick = () => {
    const { job_name, ...rest } = Object.fromEntries(searchParams.entries())
    setSearchParams({
      ...rest,
      page: 1,
      ...(jobNameInput && { job_name: jobNameInput })
    })
  }

  return (
    <div className="w-full flex flex-col gap-4 grow">
      {isError && (
        <span className="alert alert-danger rounded-2xl">
          <i className="fa-solid fa-triangle-exclamation me-2"></i>{" "}
          {error?.data?.error_message || "Unknown error"}
        </span>
      )}
      <div className="flex gap-3 items-center flex-wrap">
        <div>
          <select
            id="status-filter"
            value={status ?? ""}
            onChange={handleStatusChange}
            className="form-select border border-primary text-primary dark:bg-primary dark:text-white font-bold text-center"
          >
            <option value="" className="bg-white text-black">{DEFAULT_STATUS_QUICK_VIEW}</option>
            {JOB_STATUSES.map((status) => (
              <option key={status} value={status} className={getStatusBadgeStyle(status)}>
                {status}
              </option>
            ))}
          </select>
        </div>
        <div className="grow flex">
          <input
            id="job-name-filter"
            className="form-input w-full rounded-r-none"
            placeholder="Filter job name..."
            value={jobNameInput}
            onChange={(e) => setJobNameInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleFilterClick()} />
          <button className="btn btn-dark font-bold px-4 rounded-l-none border-l-0" onClick={handleFilterClick}>
            Filter
          </button>
        </div>
        <div className="flex items-center gap-1 text-sm" style={{ whiteSpace: "nowrap" }}>
          <span>Showing</span>
          {data?.pagination?.total_items <= Math.min(...ITEMS_PER_PAGE_OPTIONS) ? (
            <strong>{data?.pagination?.page_items || "0"}</strong>
          ) : (
            <select id="jobs-per-page" value={pageSize} onChange={handlePageSizeChange}
              className="form-select border border-primary text-primary dark:bg-primary dark:text-white font-bold">
              {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          )}
          <span>of</span>
          <strong>{data?.pagination?.total_items || "0"} jobs</strong>
        </div>

        <button
          className="btn btn-success"
          id="refresh-data-btn"
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
            selectedJobIds={selectedJobIds}
            onSelectionChange={setSelectedJobIds}
          ></QuickJobList>
        )}
      </div>
      <div id="paginator" className="flex justify-center items-center">
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
