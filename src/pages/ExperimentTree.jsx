import { useEffect, useMemo, useRef, useState, MutableRefObject } from "react";
import { autosubmitApiV4 } from "../services/autosubmitApiV4";

import { Link, useParams, useSearchParams } from "react-router-dom";
import useASTitle from "../hooks/useASTitle";
import useBreadcrumb from "../hooks/useBreadcrumb";
import { useDispatch, useSelector } from "react-redux";
import RunsModal from "../common/RunsModal";
import TreeContentHandler from "../components/context/tree/business/treeUpdate";
import BottomPanel from "../common/BottomPanel";
import { ChangeStatusModal } from "../common/ChangeStatusModal";
import ExperimentEtaPanel from "../common/ExperimentEtaPanel";
import { useWindowSize } from "@uidotdev/usehooks";
import { JOB_STATUSES } from "../services/utils";
import FetchJobDetailCard from "../common/FetchJobDetailCard";
import { QuickJobList } from "./ExperimentQuick";
import HierarchyTree from "../common/HierarchyTree";

const DEFAULT_ITEMS_PER_PAGE = 100;
const ITEMS_PER_PAGE_OPTIONS = [DEFAULT_ITEMS_PER_PAGE, 500, 1000];

const ExperimentTree = () => {
  const dispatch = useDispatch();
  const routeParams = useParams();
  useASTitle(`Experiment ${routeParams.expid} tree`);
  useBreadcrumb([
    {
      name: `Experiment ${routeParams.expid}`,
      route: `/experiment/${routeParams.expid}`,
    },
    {
      name: `Tree View`,
      route: `/experiment/${routeParams.expid}/tree`,
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

  const fetchJobDetailCardRef = useRef(null);

  const [selectedDir, setSelectedDir] = useState(null);
  const [activeMonitor, setActiveMonitor] = useState(false);

  const toggleActiveMonitor = () => {
    setActiveMonitor(!activeMonitor);
  };

  const handleDirSelect = (dir) => {
    setSelectedDir(dir);
  };

  const {
    data: jobsData,
    isFetching: isJobsFetching,
    refetch: refetchJobs,
  } = autosubmitApiV4.endpoints.getExperimentJobs.useQuery(
    {
      expid: routeParams.expid,
      view: "extended",
      job_name: jobName,
      status: status,
      page: currentPage,
      page_size: pageSize,
      date: selectedDir?.date || undefined,
      member: selectedDir?.member || undefined,
      section: selectedDir?.section || undefined,
      chunk: selectedDir?.chunk || undefined,
    },
    {
      skip: !selectedDir, // Skip fetching if no directory is selected
      pollingInterval: activeMonitor ? 5000 : 0,
    },
  );

  const handleRefetch = () => {
    refetchTree();
    refetchJobs();
  };

  const [showModal, setShowModal] = useState(false);
  const toggleModal = (refresh = false) => {
    setShowModal(!showModal);
    if (refresh === true) {
      handleRefetch();
    }
  };

  const [filterJobsText, setFilterJobsText] = useState("");
  const [filteredJobs, setFilteredJobs] = useState([]);

  const [leftColumnWidth, setLeftColumnWidth] = useState(33.333);
  const [isResizingColumns, setIsResizingColumns] = useState(false);

  useEffect(() => {
    fetchJobDetailCardRef.current?.refetch();
  }, [jobsData]);

  useEffect(() => {
    setFilterJobsText("");
  }, [selectedDir]);

  useEffect(() => {
    if (filterJobsText.trim() === "") {
      setFilteredJobs(jobsData?.jobs || []);
    } else {
      const filtered = (jobsData?.jobs || []).filter((job) =>
        job.name.toLowerCase().includes(filterJobsText.toLowerCase()),
      );
      setFilteredJobs(filtered);
    }
  }, [filterJobsText, jobsData]);

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
  }, [routeParams.expid, selectedDir, currentPage, pageSize, jobName]);

  const isMobile = useWindowSize().width < 1024;

  const [showRunsM, setShowRunsM] = useState(false);
  const [selectedRun, setSelectedRun] = useState({
    run_id: null,
    created: null,
  });

  const handleRunSelect = (item) => {
    // handleClear();
    setSelectedRun(item);
    setShowRunsM(false);
  };

  const handleResetRun = () => {
    handleRunSelect({
      run_id: null,
      created: null,
    });
  };

  const toggleShowRunsM = () => {
    setShowRunsM(!showRunsM);
  };

  const etaPanel = activeMonitor ? (
    <ExperimentEtaPanel
      activeMonitor={activeMonitor}
      expid={routeParams.expid}
      pklData={jobsData}
      jobs={filteredJobs}
      isMobile={isMobile}
    />
  ) : null;

  return (
    <>
      <RunsModal
        show={showRunsM}
        onHide={toggleShowRunsM}
        expid={routeParams.expid}
        onRunSelect={handleRunSelect}
      />
      <div className="w-full flex flex-col gap-4 grow">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <button
                className={
                  "btn btn-primary font-bold" +
                  (selectedRun?.run_id ? " rounded-e-none" : "")
                }
                title="Select run"
                onClick={toggleShowRunsM}
              >
                <i className="fa-solid fa-clock-rotate-left me-2" /> Run:{" "}
                {(selectedRun.run_id && selectedRun.created) || "Latest"}
              </button>
              {selectedRun?.run_id && (
                <button
                  className="btn btn-light text-primary rounded-s-none ring-1 ring-inset ring-neutral-300"
                  title="Reset to latest"
                  onClick={handleResetRun}
                >
                  <i className="fa-solid fa-xmark" />
                </button>
              )}
            </div>
            <Link
              to={`/experiment/${routeParams.expid}/tree-legacy`}
              className="btn btn-dark font-bold px-4 text-nowrap"
            >
              Legacy View <i className="fa-solid fa-right-from-bracket ml-2" />
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <button
              className={
                "btn font-bold px-4 text-nowrap " +
                (activeMonitor ? "btn-danger" : "btn-success")
              }
              onClick={toggleActiveMonitor}
            >
              {activeMonitor ? "STOP MONITORING" : "START MONITOR"}
            </button>
            <button
              className="btn btn-success font-bold"
              title="Refresh data"
              onClick={handleRefetch}
            >
              <i className="fa-solid fa-rotate-right"></i>
            </button>
          </div>
        </div>

        <div
          className="group relative flex grow basis-0 min-h-[70vh] lg:min-h-[50vh]"
          onMouseMove={(event) => {
            if (!isResizingColumns) return;
            const bounds = event.currentTarget.getBoundingClientRect();
            const width =
              ((event.clientX - bounds.left) / bounds.width) * 100;
            setLeftColumnWidth(Math.min(70, Math.max(20, width))); // TODO: make the content to overflow instead of adjust the inner widths
          }}
          onMouseUp={() => setIsResizingColumns(false)}
          onMouseLeave={() => setIsResizingColumns(false)}
        >
          <div
            className="relative flex flex-col max-h-full overflow-auto p-4 border rounded-lg custom-scrollbar bg-white"
            style={{ width: `${leftColumnWidth}%` }}
          >
            <HierarchyTree
              expid={routeParams.expid}
              onNodeSelect={handleDirSelect}
              selectedNode={selectedDir}
              activeMonitor={activeMonitor}
            />
          </div>
          <div
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize columns"
            className="relative z-10 px-1 mx-1 w-1 cursor-col-resize opacity-0 transition-opacity active:opacity-100 hover:opacity-100 bg-[radial-gradient(circle,#9ca3af_1px,transparent_1px)] [background-size:4px_4px]"
            onMouseDown={(event) => {
              event.preventDefault();
              setIsResizingColumns(true);
            }}
          />
          <div
            className="flex min-w-0 flex-1 flex-col h-full max-h-full gap-2"
          >
            <div className="flex items-center">
              <div className="grow flex">
                <input
                  className="form-input rounded-lg rounded-r-none grow"
                  placeholder="Filter job..."
                  value={filterJobsText}
                  onChange={(e) => setFilterJobsText(e.target.value)}
                />
                <button
                  className="btn btn-dark font-bold px-4 rounded-l-none border-l-0"
                  onClick={() => setFilterJobsText(filterJobsText)}
                >
                  Filter
                </button>
              </div>
              <label className="ml-4 text-gray-500 text-sm">
                {filteredJobs.length} / {jobsData?.jobs?.length || 0} jobs
              </label>
            </div>

            <div className="relative flex flex-col max-h-full h-full overflow-auto p-4 border rounded-lg custom-scrollbar bg-white">
              {!selectedDir && (
                <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                  <i className="fa-regular fa-folder text-4xl text-primary"></i>
                  <span className="text text-gray-500">
                    Select a directory to view jobs
                  </span>
                </div>
              )}

              {selectedDir && (
                <>
                  {isJobsFetching && !activeMonitor ? (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-white">
                      <div
                        className="spinner-border dark:invert"
                        role="status"
                      ></div>
                    </div>
                  ) : (
                    <>
                      {!isMobile && etaPanel}
                      <QuickJobList
                        jobs={filteredJobs}
                        selection={selection}
                        onSelectionChange={setSelection}
                      />
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {isMobile && etaPanel}

      {selection.jobIds.size > 0 && (
        <BottomPanel
          title={
            selection.jobIds.size === 1
              ? selection.jobIds.values().next().value
              : `${selection.jobIds.size} jobs selected`
          }
          allowTitleCopy={selection.jobIds.size === 1}
        >
          <div className="flex flex-col gap-3">
            {selection.jobIds.size === 1 && (
              <FetchJobDetailCard
                ref={fetchJobDetailCardRef}
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
    </>
  );
};

export default ExperimentTree;
