import { useEffect, useMemo, useRef, useState, MutableRefObject } from "react";
import { autosubmitApiV4 } from "../services/autosubmitApiV4";

import { Link, useParams } from "react-router-dom";
import useASTitle from "../hooks/useASTitle";
import useBreadcrumb from "../hooks/useBreadcrumb";
import { useDispatch, useSelector } from "react-redux";
import RunsModal from "../common/RunsModal";
import TreeContentHandler from "../components/context/tree/business/treeUpdate";
import BottomPanel from "../common/BottomPanel";
import { ChangeStatusModal } from "../common/ChangeStatusModal";
import { cn } from "../services/utils";
import FetchJobDetailCard from "../common/FetchJobDetailCard";
import { QuickJobList } from "./ExperimentQuick";

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
                <span className="relative mr-4">
                  <i className="fa-solid fa-folder" />
                  {counter > 0 && (
                    <span className="absolute -top-1 -right-2 text-[0.6rem] bg-gray-400 text-white rounded-full aspect-square h-[0.8rem] w-[0.8rem] flex items-center justify-center">
                      {counter}
                    </span>
                  )}
                </span>

                <span
                  className={cn(
                    "flex items-center gap-2 px-1 py-[1px] hover:bg-gray-100 rounded cursor-pointer select-none",
                    isSelected && "bg-blue-100 hover:bg-blue-200",
                  )}
                >
                  <span>{treeDir.title}</span>

                  <span className="flex items-center gap-1">
                    {counter > 0 && (
                      <span className="badge badge-status-completed text-[0.7rem] text-nowrap">
                        {treeDir.diff_statuses_counters?.COMPLETED || 0}/
                        {counter} COMPLETED
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
                  </span>
                </span>
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

  const [selectedDir, setSelectedDir] = useState(null);

  const { data: jobsCategoryTreeData, isFetching: isTreeFetching } =
    autosubmitApiV4.endpoints.getJobsCategoryTree.useQuery({
      expid: routeParams.expid,
    });

  const tree = useMemo(() => {
    if (jobsCategoryTreeData && jobsCategoryTreeData.category_tree)
      return getTreeDirs(jobsCategoryTreeData.category_tree);

    return [];
  }, [jobsCategoryTreeData]);

  const handleDirSelect = (dir) => {
    setSelectedDir(dir);
  };

  const { data: jobsData, isFetching: isJobsFetching } =
    autosubmitApiV4.endpoints.getExperimentJobs.useQuery(
      {
        expid: routeParams.expid,
        view: "extended",
        date: selectedDir?.date || undefined,
        member: selectedDir?.member || undefined,
        section: selectedDir?.section || undefined,
        chunk: selectedDir?.chunk || undefined,
      },
      {
        skip: !selectedDir, // Skip fetching if no directory is selected
      },
    );

  const [selectedJobIds, setSelectedJobIds] = useState(new Set());
  const handleJobSelectionChange = (selectedIds) => {
    setSelectedJobIds(selectedIds);
  };

  const [showModal, setShowModal] = useState(false);
  const toggleModal = (refresh = false) => {
    setShowModal(!showModal);
    if (refresh === true) {
      refetch();
    }
  };

  return (
    <>
      <div className="w-full flex flex-col gap-4 grow">
        <Link to={`/experiment/${routeParams.expid}/tree-legacy`}>
          Go to Legacy Tree View
        </Link>

        <div className="relative flex gap-4 grow basis-0 min-h-[70vh] lg:min-h-[50vh]">
          {isTreeFetching ? (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-white">
              <div className="spinner-border dark:invert" role="status"></div>
            </div>
          ) : (
            <>
              <div className="w-1/3 relative flex flex-col max-h-full overflow-auto py-4 px-6 border rounded-lg custom-scrollbar bg-white">
                <HierarchyTree
                  treeDirs={tree}
                  onNodeSelect={handleDirSelect}
                  selectedNode={selectedDir}
                />
              </div>

              <div className="w-2/3 relative flex flex-col max-h-full overflow-auto p-4 border rounded-lg custom-scrollbar bg-white">
                {!selectedDir && (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                    <i className="fa-regular fa-face-smile text-4xl text-primary"></i>
                    <span className="text text-gray-500">
                      Select a directory to view jobs
                    </span>
                  </div>
                )}

                {selectedDir && isJobsFetching && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center bg-white">
                    <div
                      className="spinner-border dark:invert"
                      role="status"
                    ></div>
                  </div>
                )}

                {selectedDir && !isJobsFetching && (
                  <QuickJobList
                    jobs={jobsData?.jobs || []}
                    onSelectionChange={handleJobSelectionChange}
                  />
                )}
              </div>
            </>
          )}
        </div>
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
    </>
  );
};

export default ExperimentTree;
