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
import { cn, JOB_STATUSES } from "../services/utils";
import FetchJobDetailCard from "../common/FetchJobDetailCard";
import { QuickJobList } from "./ExperimentQuick";

const DEFAULT_ITEMS_PER_PAGE = 100;
const ITEMS_PER_PAGE_OPTIONS = [DEFAULT_ITEMS_PER_PAGE, 500, 1000];

/***
 * param treeData: Array of objects representing the tree structure
 */
const getTreeDirs = (treeData) => {
  const result = [];

  // First level: date
  Object.keys(treeData).forEach((date) => {
    const dateNode = {
      title: date,
      key: date,
      date: date,
      member: "NA",
      section: null,
      chunk: "NA",
      children: [],
    };

    let date_statuses_counters = {};
    let diff_date_statuses_counters = {};

    // Second level: member
    Object.keys(treeData[date]).forEach((member) => {
      const memberNode = {
        title: member,
        key: `${date}-${member}`,
        date: date,
        member: member,
        section: null,
        chunk: "NA",
        children: [],
      };

      let member_statuses_counters = {};
      let diff_member_statuses_counters = {};

      // Third level: section
      Object.keys(treeData[date][member]).forEach((section) => {
        let section_statuses_counters = treeData[date][member][section];

        let jobs_counter = 0;

        Object.entries(section_statuses_counters).forEach(([status, count]) => {
          jobs_counter += count;
          if (member_statuses_counters[status]) {
            member_statuses_counters[status] += count;
          } else {
            member_statuses_counters[status] = count;
          }
        });

        // Check if the section has more than one job to determine if it's a directory
        // If it has more than one job, we treat it as a directory; otherwise,
        // we treat it as a leaf node that won't be displayed in the tree dir view.
        const is_section_dir = jobs_counter > 1;
        if (is_section_dir) {
          const sectionNode = {
            title: section,
            key: `${date}-${member}-${section}`,
            date: date,
            member: member,
            section: section,
            chunk: null,
            children: [],
            statuses_counters: section_statuses_counters,
            diff_statuses_counters: section_statuses_counters, // Not lower level, so we can use the same counters for diff
          };

          memberNode.children.push(sectionNode);
        } else {
          Object.entries(section_statuses_counters).forEach(
            ([status, count]) => {
              if (diff_member_statuses_counters[status]) {
                diff_member_statuses_counters[status] += count;
              } else {
                diff_member_statuses_counters[status] = count;
              }
            },
          );
        }
      });

      memberNode.statuses_counters = member_statuses_counters;
      memberNode.diff_statuses_counters = diff_member_statuses_counters;

      // Update date level statuses counters
      Object.entries(member_statuses_counters).forEach(([status, count]) => {
        if (date_statuses_counters[status]) {
          date_statuses_counters[status] += count;
        } else {
          date_statuses_counters[status] = count;
        }
      });

      if (member === "NA") {
        // Forward the children of the memberNode to the dateNode if member is "NA"
        dateNode.children.push(...memberNode.children);
      } else {
        dateNode.children.push(memberNode);
      }
    });

    dateNode.statuses_counters = date_statuses_counters;

    // Subtract the statuses counters of the children
    dateNode.diff_statuses_counters = date_statuses_counters;
    Object.keys(dateNode.children).forEach((child) => {
      const childNode = dateNode.children[child];
      Object.entries(childNode.statuses_counters).forEach(([status, count]) => {
        if (dateNode.diff_statuses_counters[status]) {
          dateNode.diff_statuses_counters[status] -= count;
        }
      });
    });

    if (date === "NA") dateNode.title = "Keys";

    result.push(dateNode);
  });

  console.log(JSON.stringify(result, null, 2));
  return result;
};

const HierarchyTree = ({ treeDirs, onNodeSelect, selectedNode }) => {
  const handleNodeSelect = (node) => {
    if (onNodeSelect) {
      onNodeSelect(node);
    }
  };

  return (
    <ul
      className="text-sm flex flex-col gap-[0.35rem] py-1 font-thin"
      style={{
        fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
        color: "#333",
      }}
    >
      {treeDirs &&
        treeDirs.length > 0 &&
        treeDirs.map((treeDir, index) => {
          const counter = Object.values(
            treeDir.diff_statuses_counters || {},
          ).reduce((acc, count) => acc + count, 0);
          const isSelected = selectedNode && selectedNode.key === treeDir.key;

          return (
            <li key={index}>
              <div
                className="flex items-center"
                onClick={() => handleNodeSelect(treeDir)}
              >
                <div className="flex mr-2">
                  <i className="fa-solid fa-caret-down mr-1" />
                  <i className="fa-solid fa-folder" />
                  {/* {counter > 0 && (
                    <span className="absolute -top-1 -right-2 text-[0.6rem] bg-gray-400 text-white rounded-full aspect-square h-[0.8rem] w-[0.8rem] flex items-center justify-center">
                      {counter}
                    </span>
                  )} TODO: REMOVE SINCE IT'S ALREADY DISPLAYED IN THE COMPLETED BADGE*/} 
                </div>

                <span
                  className={cn(
                    "flex items-center gap-2 px-1 py-[1px] hover:bg-gray-100 rounded cursor-pointer select-none",
                    isSelected && "bg-blue-100 hover:bg-blue-200",
                  )}
                >
                  <span>{treeDir.title}</span>
                </span>
                <div className="flex items-center gap-1 ml-2">
                  {counter > 0 && (
                    <span
                      className={cn(
                        "badge text-[0.7rem] text-nowrap",
                        (treeDir.diff_statuses_counters?.COMPLETED || 0) === counter
                          ? "badge-status-completed"
                          : "badge-status-some-completed",
                      )}
                    >
                      {treeDir.diff_statuses_counters?.COMPLETED || 0}/{counter} COMPLETED
                    </span>
                  )}
                  {treeDir.diff_statuses_counters &&
                    Object.entries(treeDir.diff_statuses_counters).map(
                      ([status, count]) => {
                        if (
                          count > 0 &&
                          ["RUNNING", "QUEUING", "FAILED"].includes(status)
                        ) {
                          return (
                            <span
                              className={`badge badge-status-${status.toLowerCase()} text-[0.7rem] text-nowrap`}
                            >
                              {count} {status}
                            </span>
                          );
                        }
                      },
                    )}
                </div>
              </div>
              {treeDir.children && treeDir.children.length > 0 && (
                <div className="ml-6">
                  <HierarchyTree
                    treeDirs={treeDir.children}
                    onNodeSelect={handleNodeSelect}
                    selectedNode={selectedNode}
                  />
                </div>
              )}
            </li>
          );
        })}
    </ul>
  );
};

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

  const {
    data: jobsCategoryTreeData,
    isFetching: isTreeFetching,
    refetch: refetchTree,
  } = autosubmitApiV4.endpoints.getJobsCategoryTree.useQuery(
    {
      expid: routeParams.expid,
    },
    {
      pollingInterval: activeMonitor ? 5000 : 0,
    },
  );

  const tree = useMemo(() => {
    if (jobsCategoryTreeData && jobsCategoryTreeData.category_tree)
      return getTreeDirs(jobsCategoryTreeData.category_tree);

    return [];
  }, [jobsCategoryTreeData]);

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
      <div className="w-full flex flex-col gap-4 grow">
        <div className="flex items-center gap-2 justify-between">
          <Link
            to={`/experiment/${routeParams.expid}/tree-legacy`}
            className="btn btn-dark font-bold px-4 text-nowrap"
          >
            Legacy View <i className="fa-solid fa-right-from-bracket ml-2"></i>
          </Link>
          <div className="flex items-center gap-2">
            {/* TODO: Add the go to previous runs button */}
            {/* <button className={"btn btn-primary font-bold "} title="Select Run">
              <i className="fa-solid fa-clock-rotate-left me-2"></i> Run: Latest
            </button> */}
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
          {isTreeFetching && !activeMonitor ? (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-white">
              <div className="spinner-border dark:invert" role="status"></div>
            </div>
          ) : (
            <>
              <div
                className="relative flex flex-col max-h-full overflow-auto p-4 border rounded-lg custom-scrollbar bg-white"
                style={{ width: `${leftColumnWidth}%` }}
              >
                <HierarchyTree
                  treeDirs={tree}
                  onNodeSelect={handleDirSelect}
                  selectedNode={selectedDir}
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
            </>
          )}
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
