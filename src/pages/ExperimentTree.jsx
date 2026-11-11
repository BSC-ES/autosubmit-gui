import { useEffect, useMemo, useRef, useState } from "react";
import { autosubmitApiV4 } from "../services/autosubmitApiV4";
import { Link, useParams, useSearchParams } from "react-router-dom";
import useASTitle from "../hooks/useASTitle";
import useBreadcrumb from "../hooks/useBreadcrumb";
import RunsModal from "../common/RunsModal";
import BottomPanel from "../common/BottomPanel";
import { ChangeStatusModal } from "../common/ChangeStatusModal";
import ExperimentEtaPanel from "../common/ExperimentEtaPanel";
import { useWindowSize } from "@uidotdev/usehooks";
import { cn, JOB_STATUSES } from "../services/utils";
import FetchJobDetailCard from "../common/FetchJobDetailCard";
import JobList from "../common/JobList";
import HierarchyTree from "../common/HierarchyTree";
import WrapperList from "../common/WrapperList";
import Paginator from "../common/Paginator";
import DragableSeparator from "../common/DragableSeparator";

const DEFAULT_ITEMS_PER_PAGE = 100;
const ITEMS_PER_PAGE_OPTIONS = [DEFAULT_ITEMS_PER_PAGE, 500, 1000];
const BREADCRUMB_LEVELS = ["date", "member", "section"];

const ExperimentTree = () => {
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

  const hierarchyTreeRef = useRef(null);
  const wrapperListRef = useRef(null);

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
  const [selectedWrapper, setSelectedWrapper] = useState(null);
  const [activeMonitor, setActiveMonitor] = useState(false);
  const [isTreeExpanded, setIsTreeExpanded] = useState(true);
  const [areWrappersExpanded, setAreWrappersExpanded] = useState(false);
  const [treeHeight, setTreeHeight] = useState(60);
  const [isResizingSections, setIsResizingSections] = useState(false);

  const toggleActiveMonitor = () => {
    setActiveMonitor(!activeMonitor);
  };

  const handleDirSelect = (dir) => {
    setSelectedDir(dir);
    setSelectedWrapper(null);
  };

  const handleWrapperSelect = (wrapper) => {
    setSelectedDir(null);
    setSelectedWrapper(wrapper);
  };

  const {
    data: jobsData,
    isFetching: isJobsFetching,
    isLoading: isJobsLoading,
    isUninitialized: isJobsUninitialized,
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

  const handleJobSearch = () => {
    const nextSearchParams = Object.fromEntries(searchParams.entries());
    const nextJobName = jobNameInput.trim();

    if (nextJobName) {
      nextSearchParams.job_name = nextJobName;
    } else {
      delete nextSearchParams.job_name;
    }

    nextSearchParams.page = "1";
    setSearchParams(nextSearchParams);
  }

  const handleClearJobSearch = () => {
    setJobNameInput("");
    const nextSearchParams = Object.fromEntries(searchParams.entries());
    delete nextSearchParams.job_name;
    nextSearchParams.page = "1";
    setSearchParams(nextSearchParams);
  }

  const handleRefetch = () => {
    hierarchyTreeRef.current?.refetchTree();
    wrapperListRef.current?.refetchWrappers();

    if (!isJobsUninitialized) {
      refetchJobs();
    }
  };

  const [showModal, setShowModal] = useState(false);
  const toggleModal = (refresh = false) => {
    setShowModal(!showModal);
    if (refresh === true) {
      handleRefetch();
    }
  };

  const filteredJobs = jobsData?.jobs || [];
  const wrapperJobs = useMemo(
    () => (selectedWrapper?.job_names || []).map((name) => ({ name })),
    [selectedWrapper],
  );
  const displayedJobs = selectedWrapper ? wrapperJobs : filteredJobs;

  const [leftColumnWidth, setLeftColumnWidth] = useState(30);
  const [isResizingColumns, setIsResizingColumns] = useState(false);

  useEffect(() => {
    fetchJobDetailCardRef.current?.refetch();
  }, [jobsData]);

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
  }, [routeParams.expid, selectedDir, selectedWrapper, currentPage, pageSize, jobName]);

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

  const etaPanel = activeMonitor && selectedDir ? (
    <ExperimentEtaPanel
      activeMonitor={activeMonitor}
      expid={routeParams.expid}
      pklData={jobsData}
      jobs={filteredJobs}
      isMobile={isMobile}
    />
  ) : null;

  const breadcrumbItems = [
    ["date", selectedDir?.date],
    ["member", selectedDir?.member],
    ["section", selectedDir?.section],
  ]
    .filter(([, value]) => value != null && value !== "NA")
    .map(([key, value]) => ({ key, value }));

  const handleBreadcrumbClick = (item) => {
    const levels = BREADCRUMB_LEVELS;
    const selectedNode = { ...selectedDir };
    const clickedLevel = levels.indexOf(item.key);

    levels.slice(clickedLevel + 1).forEach((level) => {
      selectedNode[level] = "NA";
    });
    // API requires to explicitly set the chunk to "NA" for directories that are not chunks
    selectedNode.chunk = "NA"; // A previous breadcrumb will never be a chunk
    delete selectedNode.section; // Chunk and section are mutually exclusive
    selectedNode.key = levels
      .slice(0, clickedLevel + 1)
      .map((level) => selectedNode[level])
      .join("-");

    handleDirSelect(selectedNode);
  };

  // Values derived from the API response, used for rendering
  const totalItems = jobsData?.pagination?.total_items ?? 0;
  const pageItems = jobsData?.pagination?.page_items ?? 0;
  const totalPages = jobsData?.pagination?.total_pages ?? 1;
  const showPaginator = selectedDir && !selectedWrapper && totalPages > 1 && pageItems > 0 && !isJobsFetching;

  const [areWrappersAvailable, setAreWrappersAvailable] = useState(false);

  useEffect(() => {
    // Wrappers might arrive after the tree
    if (!areWrappersAvailable) {
      setIsTreeExpanded(true);
      setIsResizingSections(false);
    }
  }, [areWrappersAvailable]);

  return (
    <>
      <RunsModal
        show={showRunsM}
        onHide={toggleShowRunsM}
        expid={routeParams.expid}
        onRunSelect={handleRunSelect}
      />
      <div className="w-full flex flex-col gap-4 grow">
        <div className="flex flex-wrap items-center justify-between gap-2">
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
          className="group relative flex min-h-[120vh] grow basis-0 flex-col gap-2 lg:min-h-[50vh] lg:flex-row lg:gap-0"
          onMouseMove={(event) => {
            if (!isResizingColumns && !isResizingSections) return;
            const bounds = event.currentTarget.getBoundingClientRect();
            if (isResizingColumns) {
              const width = ((event.clientX - bounds.left) / bounds.width) * 100;
              setLeftColumnWidth(Math.min(50, Math.max(20, width)));
            }
            if (isResizingSections && isTreeExpanded && areWrappersExpanded) {
              const height = ((event.clientY - bounds.top) / bounds.height) * 100;
              setTreeHeight(Math.min(80, Math.max(20, height)));
            }
          }}
          onMouseUp={() => {
            setIsResizingColumns(false);
            setIsResizingSections(false);
          }}
          onMouseLeave={() => {
            setIsResizingColumns(false);
            setIsResizingSections(false);
          }}
        >
          <div
            className="relative flex h-[50vh] min-h-0 w-full flex-col lg:h-auto lg:max-h-full lg:w-[var(--left-column-width)]"
            style={{ "--left-column-width": `${leftColumnWidth}%` }}
            data-sections-panel
          >
            <section className={cn(
              "flex min-h-0 flex-col rounded-lg border bg-white p-3 mb-1",
              isTreeExpanded ? "flex-grow" : "flex-none",
            )} style={isTreeExpanded ? { flexGrow: treeHeight, flexBasis: 0 } : undefined}>
              <button
                type="button"
                className="flex items-center justify-between p-2 font-semibold text-primary-700"
                onClick={() => {
                  if (areWrappersAvailable) {
                    setIsTreeExpanded((expanded) => !expanded);
                  }
                }}
              >
                <span className="flex items-center gap-3">
                  <i className="fa-solid fa-folder-tree"></i>Experiment tree
                </span>
                {areWrappersAvailable && (
                  <i className={cn(
                    "fa-solid fa-angle-down text-xs transition-transform duration-200",
                    isTreeExpanded && "rotate-180",
                  )} />
                )}
              </button>
              <div className={cn(
                "min-h-0 flex-1 flex-col pt-3",
                isTreeExpanded ? "flex" : "hidden",
              )}>
                <HierarchyTree
                  ref={hierarchyTreeRef}
                  expid={routeParams.expid}
                  onNodeSelect={handleDirSelect}
                  selectedNode={selectedDir}
                  activeMonitor={activeMonitor}
                />
              </div>
            </section>
            {isTreeExpanded && areWrappersExpanded && (
              <DragableSeparator setIsResizing={setIsResizingSections} orientation="vertical" />
            )}
            <section className={cn(
              "flex min-h-0 flex-col rounded-lg border bg-white p-3 mt-1",
              areWrappersAvailable ? "flex" : "hidden",
              areWrappersExpanded ? "flex-grow" : "flex-none",
            )} style={areWrappersExpanded ? { flexGrow: 100 - treeHeight, flexBasis: 0 } : undefined}>
              <button
                type="button"
                className="flex items-center justify-between p-2 font-semibold text-primary-700"
                onClick={() => setAreWrappersExpanded((expanded) => !expanded)}
              >
                <span className="flex items-center gap-3">
                  <i className="fa-solid fa-layer-group"></i>Wrappers
                </span>
                <i className={cn(
                  "fa-solid fa-angle-down text-xs transition-transform duration-200",
                  areWrappersExpanded && "rotate-180",
                )} />
              </button>
              <div className={cn(
                "min-h-0 flex-1 flex-col pt-3",
                areWrappersExpanded ? "flex" : "hidden",
              )}>
                <WrapperList
                  ref={wrapperListRef}
                  expid={routeParams.expid}
                  onNodeSelect={handleWrapperSelect}
                  selectedNode={selectedWrapper}
                  activeMonitor={activeMonitor}
                  setAreWrappersAvailable={setAreWrappersAvailable}
                />
              </div>
            </section>
          </div>
          <DragableSeparator setIsResizing={setIsResizingColumns} orientation="horizontal" margin={1} />
          <div
            className="flex min-h-0 min-w-0 flex-1 flex-col gap-2 lg:h-full lg:max-h-full"
          >
            <div className="flex items-center">
              <div className="flex w-full grow">
                <div className="relative grow">
                  <input
                    className="form-input w-full rounded-lg rounded-r-none pr-9"
                    placeholder="Filter by job name..."
                    value={jobNameInput}
                    onChange={(e) => setJobNameInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleJobSearch();
                    }}
                  />
                  {jobNameInput && (
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
                      title="Clear job name filter"
                      onClick={handleClearJobSearch}
                    >
                      <i className="fa-solid fa-xmark" />
                    </button>
                  )}
                </div>
                <button
                  className="btn btn-dark font-bold px-4 rounded-l-none border-l-0"
                  onClick={handleJobSearch}
                >
                  Filter
                </button>
              </div>
            </div>
            <div className="flex flex-col min-h-0 max-h-full h-full border rounded-lg bg-white">
              <div className="relative flex-1 min-h-0">
                <div
                  className={`relative h-full overflow-auto p-4 custom-scrollbar ${showPaginator ? "pb-20" : ""}`}
                >
                  {!selectedDir && !selectedWrapper && (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                      <i className="fa-regular fa-folder text-4xl text-primary"></i>
                      <span className="text text-gray-500">
                        Select a directory to view jobs
                      </span>
                    </div>
                  )}

                  {(selectedDir || selectedWrapper) && (
                    <>
                      {selectedDir && !selectedWrapper && isJobsFetching && !activeMonitor ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-white">
                          <div
                            className="spinner-border dark:invert"
                            role="status"
                          ></div>
                        </div>
                      ) : (
                        <>
                          {!isMobile && etaPanel}
                          <JobList
                            jobs={displayedJobs}
                            selection={selection}
                            onSelectionChange={setSelection}
                            tip={jobName && "You may want to remove the name filter"}
                          />
                        </>
                      )}
                    </>
                  )}
                </div>

                {showPaginator && (
                  <div
                    id="paginator"
                    className="pointer-events-none absolute bottom-4 left-0 right-0 flex justify-center items-center"
                  >
                    <div className="pointer-events-auto flex justify-center w-max rounded-xl border p-2 bg-white/50 shadow-md backdrop-blur-md">
                      <Paginator
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageClick={handlePageClick}
                        buttonSize={8}
                      />
                    </div>
                  </div>
                )}
              </div>

              {selectedDir && (
                <div className="flex items-center py-0.5 px-4 text-sm bg-neutral-100 border-t">
                  <p className="m-0 flex items-center gap-1">
                    {breadcrumbItems.length > 0 ? (
                      breadcrumbItems.map((item, index) => (
                        <span
                          key={`${item.value}-${index}`}
                          className="flex items-center gap-1"
                        >
                          {index > 0 && (
                            <i className="fa-solid fa-chevron-right text-xs" />
                          )}
                          {index < breadcrumbItems.length - 1 ? (
                            <button
                              type="button"
                              className="hover:underline"
                              onClick={() => handleBreadcrumbClick(item)}
                            >
                              {item.value}
                            </button>
                          ) : (
                            item.value
                          )}
                        </span>
                      ))
                    ) : "Keys"
                    }
                  </p>
                  {!isJobsLoading && (
                    <label className="ml-auto text-gray-500 text-sm">
                      Showing <span className="font-semibold">{pageItems}</span> of <span className="font-bold">{totalItems || 0}</span> jobs
                    </label>
                  )}
                </div>
              )}
              {selectedWrapper && (
                <div className="flex items-center py-0.5 px-4 text-sm bg-neutral-100 border-t">
                  <p className="m-0 flex items-center gap-1">
                    Wrappers <i className="fa-solid fa-chevron-right text-xs" /> {selectedWrapper.wrapper_name}
                  </p>
                  {!isJobsLoading && (
                    <label className="ml-auto text-gray-500 text-sm">
                      Showing <span className="font-bold">{wrapperJobs.length}</span> jobs
                    </label>
                  )}
                </div>
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
