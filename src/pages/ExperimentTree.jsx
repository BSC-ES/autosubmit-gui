import { useEffect, useMemo, useRef, useState } from "react";
import { autosubmitApiV4 } from "../services/autosubmitApiV4";
import { useParams, useSearchParams } from "react-router-dom";
import useASTitle from "../hooks/useASTitle";
import useBreadcrumb from "../hooks/useBreadcrumb";
import RunsModal from "../common/RunsModal";
import BottomPanel from "../common/BottomPanel";
import { ChangeStatusModal } from "../common/ChangeStatusModal";
import ExperimentEtaPanel from "../common/ExperimentEtaPanel";
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
  // Route, query-string and DOM references
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
  const fetchJobDetailCardRef = useRef(null);

  /** Creates the initial job selection state. */
  const createEmptySelection = () => ({
    jobIds: new Set(),
    lastClickedIndex: 0,
  });


  // Component state
  const [jobNameInput, setJobNameInput] = useState(searchParams.get("job_name") || "")
  const [selectedDir, setSelectedDir] = useState(null);
  const [selectedWrapper, setSelectedWrapper] = useState(null);
  const [activeMonitor, setActiveMonitor] = useState(false);
  const [isTreeExpanded, setIsTreeExpanded] = useState(true);
  const [areWrappersExpanded, setAreWrappersExpanded] = useState(false);
  const [treeHeight, setTreeHeight] = useState(60);
  const [isResizingSections, setIsResizingSections] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [leftColumnWidth, setLeftColumnWidth] = useState(30);
  const [isResizingColumns, setIsResizingColumns] = useState(false);
  const [selection, setSelection] = useState(createEmptySelection);
  const [showRunsM, setShowRunsM] = useState(false);
  const [selectedRun, setSelectedRun] = useState({
    run_id: null,
    created: null,
  });
  const [areWrappersAvailable, setAreWrappersAvailable] = useState(false);

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

  const jobName = searchParams.get("job_name") || undefined;
  const wrapper = searchParams.get("wrapper") || undefined;


  // Experiment data queries
  const {
    data: jobsData,
    isFetching: isJobsFetching,
    isLoading: isJobsLoading,
    isUninitialized: isJobsUninitialized,
    refetch: refetchJobs,
  } = autosubmitApiV4.endpoints.getExperimentJobs.useQuery(
    {
      expid: routeParams.expid,
      view: "base",
      job_name: jobName,
      status: status,
      page: currentPage,
      page_size: pageSize,
      date: selectedDir?.date || undefined,
      member: selectedDir?.member || undefined,
      section: selectedDir?.section || undefined,
      chunk: selectedDir?.chunk || undefined,
      wrapper,
    },
    {
      skip: !selectedDir && !wrapper,
      pollingInterval: activeMonitor ? 5000 : 0,
    },
  );

  const {
    data: jobsCategoryTreeData,
    isFetching: isTreeFetching,
    refetch: refetchTree,
  } = autosubmitApiV4.endpoints.getJobsCategoryTree.useQuery({
    expid: routeParams.expid,
  }, {
    pollingInterval: activeMonitor ? 5000 : 0,
  });


  // User actions
  /** Toggles polling of the experiment data. */
  const toggleActiveMonitor = () => {
    setActiveMonitor(!activeMonitor);
  };

  /** Selects a directory. Wrapper-specific URL state is cleared. */
  const handleDirSelect = (dir) => {
    setSelectedDir(dir);
    setSelectedWrapper(null);
    const nextSearchParams = Object.fromEntries(searchParams.entries());
    delete nextSearchParams.wrapper;
    delete nextSearchParams.page;
    setSearchParams(nextSearchParams);
  };

  /** Selects a wrapper. Directory-specific URL state is cleared. */
  const handleWrapperSelect = (wrapper) => {
    setSelectedDir(null);
    setSelectedWrapper(wrapper);
    const nextSearchParams = Object.fromEntries(searchParams.entries());
    nextSearchParams.wrapper = wrapper.wrapper_name;
    delete nextSearchParams.date;
    delete nextSearchParams.member;
    delete nextSearchParams.section;
    delete nextSearchParams.chunk;
    delete nextSearchParams.page;
    setSearchParams(nextSearchParams);
  };

  /**
   * Changes just the current page in the query.
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

  /** Applies the job-name input as a URL filter. */
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

  /** Removes the job-name URL filter. */
  const handleClearJobSearch = () => {
    setJobNameInput("");
    const nextSearchParams = Object.fromEntries(searchParams.entries());
    delete nextSearchParams.job_name;
    nextSearchParams.page = "1";
    setSearchParams(nextSearchParams);
  }

  /** Refreshes the category tree. */
  const handleRefetch = () => {
    refetchTree();
    if (!isJobsUninitialized) {
      refetchJobs();
    }
  };

  /** Opens or closes the "change status" modal and optionally refreshes its data. */
  const toggleModal = (refresh = false) => {
    setShowModal(!showModal);
    if (refresh === true) {
      handleRefetch();
    }
  };

  /** Change run selection. */
  const handleRunSelect = (item) => {
    // handleClear();
    setSelectedRun(item);
    setShowRunsM(false);
  };

  /** Clears the selected run so the latest run is used. */
  const handleResetRun = () => {
    handleRunSelect({
      run_id: null,
      created: null,
    });
  };

  /** Toggles visibility of the run selector modal. */
  const toggleShowRunsM = () => {
    setShowRunsM(!showRunsM);
  };

  /** Moves the directory selection back to a breadcrumb level. */
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


  // Effects that react to fetched data or selection changes
  /** Update the job detail card when the jobs are fetched. */
  useEffect(() => {
    fetchJobDetailCardRef.current?.refetch();
  }, [jobsData]);

  /** Keep the selected wrapper object in sync with the URL and API response. */
  useEffect(() => {
    if (!wrapper) {
      setSelectedWrapper(null);
      return;
    }

    setSelectedWrapper({
      key: wrapper,
      wrapper_name: wrapper,
      diff_statuses_counters: jobsCategoryTreeData?.wrapper_tree?.[wrapper] || {},
    });
  }, [jobsCategoryTreeData, wrapper]);

  /**
   * Clears the current selection whenever the list context changes.
   */
  useEffect(() => {
    setSelection(createEmptySelection());
  }, [routeParams.expid, selectedDir, selectedWrapper, currentPage, pageSize, jobName]);


  // Derived values for rendering
  const filteredJobs = jobsData?.jobs || [];
  const etaPanel = activeMonitor ? (
    <ExperimentEtaPanel
      activeMonitor={activeMonitor}
      expid={routeParams.expid}
      pklData={jobsData}
      sectionsTree={jobsCategoryTreeData?.category_tree || {}}
      jobs={filteredJobs}
    />
  ) : null;

  const breadcrumbItems = [
    ["date", selectedDir?.date],
    ["member", selectedDir?.member],
    ["section", selectedDir?.section],
  ]
    .filter(([, value]) => value != null && value !== "NA")
    .map(([key, value]) => ({ key, value }));

  const totalItems = jobsData?.pagination?.total_items ?? 0;
  const pageItems = jobsData?.pagination?.page_items ?? 0;
  const totalPages = jobsData?.pagination?.total_pages ?? 1;
  const showPaginator = (selectedDir || selectedWrapper)
    && totalPages > 1
    && pageItems > 0
    && !isJobsFetching;

  const jobsCountLabel = !isJobsFetching ? (
    <label className="ml-auto text-gray-500 text-sm">
      Showing <span className="font-semibold">{pageItems}</span> of <span className="font-bold">{totalItems || 0}</span> jobs
    </label>
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
          className="group relative flex flex-col gap-2 lg:grow lg:basis-0 lg:min-h-[50vh] lg:flex-row lg:gap-0"
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
              "flex min-h-0 flex-col overflow-hidden rounded-lg border bg-white p-3 mb-1",
              isTreeExpanded ? "h-[50vh] lg:[flex-grow:var(--tree-flex-grow)] lg:basis-0" : "h-auto lg:flex-none",
            )} style={{ "--tree-flex-grow": treeHeight }}>
              <button
                type="button"
                className="flex items-center justify-between px-2 font-semibold text-primary-700"
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
                  jobsCategoryTreeData={jobsCategoryTreeData}
                  isTreeFetching={isTreeFetching}
                  refetchTree={refetchTree}
                  onNodeSelect={handleDirSelect}
                  selectedNode={selectedDir}
                />
              </div>
            </section>
            {isTreeExpanded && areWrappersExpanded && (
              <div className="hidden lg:block">
                <DragableSeparator setIsResizing={setIsResizingSections} orientation="vertical" />
              </div>
            )}
            <section className={cn(
              "flex min-h-0 flex-col overflow-hidden rounded-lg border bg-white p-3 mt-1",
              areWrappersAvailable ? "flex" : "hidden",
              areWrappersExpanded ? "h-[50vh] lg:[flex-grow:var(--wrappers-flex-grow)] lg:basis-0" : "h-auto lg:flex-none",
            )} style={{ "--wrappers-flex-grow": 100 - treeHeight }}>
              <button
                type="button"
                className="flex items-center justify-between px-2 font-semibold text-primary-700"
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
                  wrapperTree={jobsCategoryTreeData?.wrapper_tree}
                  onWrapperSelect={handleWrapperSelect}
                  selectedWrapper={selectedWrapper}
                  setAreWrappersAvailable={setAreWrappersAvailable}
                />
              </div>
            </section>
          </div>
          <div className="hidden lg:block">
            <DragableSeparator setIsResizing={setIsResizingColumns} orientation="horizontal" margin={1} />
          </div>
          <div
            className="flex min-w-0 flex-1 flex-col gap-2 lg:h-full lg:min-h-0 lg:max-h-full"
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
            <div className="flex h-[50vh] flex-col overflow-hidden border rounded-lg bg-white lg:h-auto lg:flex-1">
              <div className="relative flex-1 min-h-0">
                <div
                  className={`relative h-full overflow-auto p-4 custom-scrollbar ${showPaginator ? "pb-20" : ""}`}
                >
                  <div className="sticky top-0 z-10 hidden h-0 lg:block">
                    {etaPanel}
                  </div>
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
                      {isJobsFetching && !activeMonitor ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-white">
                          <div
                            className="spinner-border dark:invert"
                            role="status"
                          ></div>
                        </div>
                      ) : (
                        <>
                          <JobList
                            jobs={filteredJobs}
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
                        small={true}
                      />
                    </div>
                  </div>
                )}
              </div>

              {selectedDir && (
                <div className="flex shrink-0 items-center py-0.5 px-4 text-sm bg-neutral-100 border-t">
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
                  {!isJobsFetching && jobsCountLabel}
                </div>
              )}
              {selectedWrapper && (
                <div className="flex shrink-0 items-center py-0.5 px-4 text-sm bg-neutral-100 border-t">
                  <p className="m-0 flex items-center gap-1">
                    Wrappers <i className="fa-solid fa-chevron-right text-xs" /> {selectedWrapper.wrapper_name}
                  </p>
                  {!isJobsFetching && jobsCountLabel}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden">
        {etaPanel}
      </div>

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
