import { useEffect, useMemo, useRef, useState, MutableRefObject } from "react";
import { autosubmitApiV3 } from "../services/autosubmitApiV3";
import { autosubmitApiV4 } from "../services/autosubmitApiV4";

import { Link, useParams } from "react-router-dom";
import useASTitle from "../hooks/useASTitle";
import useBreadcrumb from "../hooks/useBreadcrumb";
import JobDetailCard from "../common/JobDetailCard";
import { useDispatch, useSelector } from "react-redux";
import RunsModal from "../common/RunsModal";
import TreeContentHandler from "../components/context/tree/business/treeUpdate";
import BottomPanel from "../common/BottomPanel";
import { ChangeStatusModal } from "../common/ChangeStatusModal";

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
          };

          memberNode.children.push(sectionNode);
        }
      });

      memberNode.statuses_counters = member_statuses_counters;

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
    if (date === "NA") dateNode.title = "Keys";

    result.push(dateNode);
  });

  console.log(JSON.stringify(result, null, 2));
  return result;
};

const HierarchyTree = ({ treeDirs, onNodeSelect }) => {
  const handleNodeSelect = (node) => {
    if (onNodeSelect) {
      onNodeSelect(node);
    }
  };

  return (
    <ul>
      {treeDirs &&
        treeDirs.length > 0 &&
        treeDirs.map((treeDir, index) => (
          <li key={index}>
            <span
              className="cursor-pointer hover:bg-black/10 "
              onClick={() => handleNodeSelect(treeDir)}
            >
              {treeDir.title}{" "}
              <span style={{ fontSize: "0.8em", color: "gray" }}>
                {treeDir.statuses_counters &&
                  Object.entries(treeDir.statuses_counters).map(
                    ([status, count]) => (
                      <span key={status} style={{ marginRight: "5px" }}>
                        {status}: {count}
                      </span>
                    ),
                  )}
              </span>
            </span>
            {treeDir.children && treeDir.children.length > 0 && (
              <div style={{ marginLeft: "20px" }}>
                <HierarchyTree
                  treeDirs={treeDir.children}
                  onNodeSelect={handleNodeSelect}
                />
              </div>
            )}
          </li>
        ))}
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

  const { data: jobsCategoryTreeData } =
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
        date: selectedDir?.date || undefined,
        member: selectedDir?.member || undefined,
        section: selectedDir?.section || undefined,
        chunk: selectedDir?.chunk || undefined,
      },
      {
        skip: !selectedDir, // Skip fetching if no directory is selected
      },
    );

  return (
    <>
      <div className="w-full flex flex-col gap-4 grow">
        <Link to={`/experiment/${routeParams.expid}/tree-legacy`}>
          Go to Legacy Tree View
        </Link>

        <div className="flex gap-4 grow">
          <div className="flex flex-col border border-gray-300 rounded-lg p-4 w-1/4">
            <HierarchyTree treeDirs={tree} onNodeSelect={handleDirSelect} />
          </div>

          <div className="flex flex-col border border-gray-300 rounded-lg p-4 w-3/4">
            {selectedDir ? (
              <div>
                <h3>Selected Directory Details</h3>
                <p>Date: {selectedDir.date || "Any"}</p>
                <p>Member: {selectedDir.member || "Any"}</p>
                <p>Section: {selectedDir.section || "Any"}</p>
              </div>
            ) : (
              <p>Please select a directory from the tree to see its details.</p>
            )}

            {
              jobsData && jobsData.jobs && jobsData.jobs.length > 0 ? (
                <div className="mt-4">
                  <h4>Jobs in Selected Directory</h4>
                  <ul>
                    {jobsData.jobs.map((job) => (
                      <li key={job.job_name}>
                        {job.name} - Status: {job.status}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                selectedDir && (
                  <p>No jobs found for the selected directory.</p>
                )
              )
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default ExperimentTree;
