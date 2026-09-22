import { useParams, useSearchParams } from "react-router-dom";
import { autosubmitApiV4 } from "../services/autosubmitApiV4";
import { useEffect, useState, useMemo } from "react";
import useASTitle from "../hooks/useASTitle";
import useBreadcrumb from "../hooks/useBreadcrumb";
import { cn, getStatusBadgeStyle, JOB_STATUSES } from "../services/utils";
import { ChangeStatusModal } from "../common/ChangeStatusModal";
import BottomPanel from "../common/BottomPanel";
import FetchJobDetailCard from "../common/FetchJobDetailCard";
import Paginator from "../common/Paginator";

const DEFAULT_ITEMS_PER_PAGE = 100;
const ITEMS_PER_PAGE_OPTIONS = [DEFAULT_ITEMS_PER_PAGE, 500, 1000];
const DEFAULT_STATUS_QUICK_VIEW = "Any status";

/**
 * @typedef {Object} Job
 * @property {string} name - Unique name of the job.
 * @property {string} status - Current status of the job.
 */

/**
 * @typedef {Object} JobSelection
 * @property {Set<string>} jobIds - Names of the selected jobs.
 * @property {number} lastClickedIndex - Anchor index for range selection.
 */


/**
 * Renders the jobs displayed in the quick view and handles selection.
 *
 * @param {Object} props - Component properties.
 * @param {Job[]} props.jobs - Jobs to display.
 * @param {JobSelection} props.selection - Current selection state.
 * @param {(selection: JobSelection) => void} props.onSelectionChange -
 *   Callback invoked when the selection changes.
 * @returns {JSX.Element} The job list or an empty-list message.
 */
const QuickJobList = ({ jobs, selection, onSelectionChange }) => {
  if (!Array.isArray(jobs) || jobs.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-4">
        <i className="fa-regular fa-face-frown text-4xl text-primary"></i>
        <span className="text text-gray-500">No jobs found</span>
      </div>
    );
  }

  /**
   * Handles a click on a job according to the modifier keys pressed.
   *
   * A regular click replaces the current selection, Ctrl/Cmd-click toggles
   * the clicked job, and Shift-click adds the range between the last clicked
   * index and the current index.
   *
   * @param {number} index - Index of the clicked job.
   * @param {string} jobName - Name of the clicked job.
   * @param {Object} event - Click event.
   */
  const handleJobClick = (index, jobName, event) => {
    let newSelected = new Set(selection.jobIds);
    let newLastClickedIndex = index;

    if (event.shiftKey && selection.lastClickedIndex !== null) {
      const start = Math.min(selection.lastClickedIndex, index);
      const end = Math.max(selection.lastClickedIndex, index);

      for (let i = start; i <= end; i++) {
        newSelected.add(jobs[i].name);
      }
    } else if (event.ctrlKey || event.metaKey) {
      if (newSelected.has(jobName)) {
        newSelected.delete(jobName);
      } else {
        newSelected.add(jobName);
      }
    } else {
      newSelected = new Set([jobName]);
    }

    onSelectionChange({
      jobIds: newSelected,
      lastClickedIndex: newLastClickedIndex,
    });
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
        const isSelected = selection.jobIds.has(job.name);

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


/**
 * Renders the quick view for an experiment.
 *
 * It manages query filters, pagination, job selection, job details,
 * data refreshing, and status changes for selected jobs.
 *
 * @returns {JSX.Element} The experiment quick view page.
 */
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

  /**
   * Reads the selected status from the query string.
   *
   * @returns {string|undefined} A valid job status or `undefined`, 
   * which disables the filter.
   */
  const status = useMemo(() => {
    const raw = searchParams.get("status")
    return JOB_STATUSES.includes(raw) ? raw : undefined
  }, [searchParams])

  /**
   * Reads the current page from the query string.
   * 
   * Missing, non-numeric, or non-positive values fall back to page one.
   *
   * @returns {number} A valid page number starting at one.
   */
  const currentPage = useMemo(() => {
    const page = parseInt(searchParams.get("page") || "1", 10)
    return !Number.isFinite(page) || page <= 0 ? 1 : page
  }, [searchParams])

  /**
   * Reads the page size from the query string.
   * 
   * Only values included in `ITEMS_PER_PAGE_OPTIONS` are accepted.
   * Invalid values fall back to `DEFAULT_ITEMS_PER_PAGE`.
   *
   * @returns {number} A valid page size.
   */
  const pageSize = useMemo(() => {
    const raw = searchParams.get("page_size")
    const size = parseInt(raw || "", 10)

    // Ignore non-valid or non-whitelisted values
    if (!Number.isFinite(size) || !ITEMS_PER_PAGE_OPTIONS.includes(size)) {
      return DEFAULT_ITEMS_PER_PAGE
    }

    return size
  }, [searchParams])

  const [jobNameInput, setJobNameInput] = useState(searchParams.get("job_name") || "")

  const jobName = searchParams.get("job_name") || undefined;

  /**
   * Synchronizes the job name input with the currently applied value
   * from the query string.
   */
  useEffect(() => {
    setJobNameInput(jobName || "");
  }, [jobName]);

  /**
   * Validates the status, page size, and page number query parameters.
   *
   * Invalid parameters are removed from the query string using
   * replacement navigation.
   */
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

  /**
   * Checks whether the requested page exceeds the total number of pages
   * returned by the API, and if so, navigates back to the first page.
   */
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

  /**
   * Shows or hides the change status modal. Optionally refetches the job list.
   *
   * @param {boolean} [refresh=false] - Whether the job list should be refetched.
   */
  const toggleModal = (refresh = false) => {
    setShowModal(!showModal);
    if (refresh === true) {
      refetch();
    }
  };

  /**
   * Creates the initial job selection state.
   *
   * @returns {JobSelection} The initial selection state.
   */
  const createEmptySelection = () => ({
    jobIds: new Set(),
    lastClickedIndex: 0,
  });

  const [selection, setSelection] = useState(createEmptySelection);

  /**
   * Clears the current selection whenever the list context changes,
   * including the experiment, page, page size, status, or job name filter.
   */
  useEffect(() => {
    setSelection(createEmptySelection());
  }, [routeParams.expid, currentPage, pageSize, status, jobName]);

  /**
   * Changes the current page while preserving the other query parameters.
   *
   * @param {{selected: number}} event - Pagination event from `Paginator`.
   */
  const handlePageClick = (e) => {
    const selectedPage = e.selected
    setSearchParams({
      ...Object.fromEntries(searchParams.entries()),
      page: selectedPage
    })
  }

  /**
   * Updates the status filter in the query string and resets pagination
   * to the first page.
   *
   * Selecting the default status option removes the `status` parameter.
   *
   * @param {Object} event - Change event from the status selector.
   */
  const handleStatusChange = (event) => {
    const { status, ...rest } = Object.fromEntries(searchParams.entries())
    const incomingStatus = event.target.value
    setSearchParams({
      ...rest,
      page: 1,
      ...(JOB_STATUSES.includes(incomingStatus) && { status: incomingStatus })
    })
  }

  /**
   * Updates the page size in the query string and resets pagination
   * to the first page.
   *
   * @param {Object} e - Change event from the page size selector.
   */
  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value, 10)
    setSearchParams({
      ...Object.fromEntries(searchParams.entries()),
      page: 1,
      page_size: newSize
    })
  }

  /**
   * Applies the job name filter using the text entered by the user and
   * resets pagination to the first page.
   */
  const handleFilterClick = () => {
    const { job_name, ...rest } = Object.fromEntries(searchParams.entries())
    setSearchParams({
      ...rest,
      page: 1,
      ...(jobNameInput && { job_name: jobNameInput })
    })
  }

  // Values derived from the API response, used for rendering
  const totalItems = data?.pagination?.total_items ?? 0;
  const pageItems = data?.pagination?.page_items ?? 0;
  const totalPages = data?.pagination?.total_pages ?? 1;
  const jobList = data?.jobs || [];
  const errorMessage = error?.data?.error_message || "Unknown error";

  return (
    <div className="w-full flex flex-col gap-4 grow">
      {isError && (
        <span className="alert alert-danger rounded-2xl">
          <i className="fa-solid fa-triangle-exclamation me-2"></i>{" "}
          {errorMessage}
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
          {totalItems <= ITEMS_PER_PAGE_OPTIONS[0] ? (
            <strong>{pageItems}</strong>
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
          <strong>{totalItems} jobs</strong>
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
            jobs={jobList}
            selection={selection}
            onSelectionChange={setSelection}
          ></QuickJobList>
        )}
      </div>
      <div id="paginator" className="flex justify-center items-center">
        <Paginator currentPage={currentPage} totalPages={totalPages} onPageClick={handlePageClick}></Paginator>
      </div>

      {selection.jobIds.size > 0 && (
        <BottomPanel
          title={
            selection.jobIds.size === 1
              ? selection.jobIds.values().next().value
              : `${selection.jobIds.size} jobs selected`
          }
        >
          <div className="flex flex-col gap-3">
            {selection.jobIds.size === 1 && (
              <FetchJobDetailCard
                expid={routeParams.expid}
                jobName={selection.jobIds.values().next().value}
              />
            )}

            <div className="flex items-center justify-center gap-3">
              <div className="font-semibold">Actions:</div>
              <button className="btn btn-primary" onClick={toggleModal}>
                Change status
              </button>
            </div>
            <ChangeStatusModal
              selectedJobs={Array.from(selection.jobIds)}
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
