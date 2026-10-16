import { useState, useMemo } from "react";
import { autosubmitApiV4 } from "../services/autosubmitApiV4";

const useHierarchyTree = ({
  expid,
  onNodeSelect,
  activeMonitor
}) => {
  const {
    data: jobsCategoryTreeData,
    isFetching: isTreeFetching,
    refetch: refetchTree,
  } = autosubmitApiV4.endpoints.getJobsCategoryTree.useQuery(
    {
      expid: expid,
    },
    {
      pollingInterval: activeMonitor ? 5000 : 0,
    },
  );

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

    return result;
  };

  const treeDirs = useMemo(() => {
    if (jobsCategoryTreeData && jobsCategoryTreeData.category_tree)
      return getTreeDirs(jobsCategoryTreeData.category_tree);

    return null;
  }, [jobsCategoryTreeData]);

  const [expandedNodes, setExpandedNodes] = useState({});

  const handleNodeSelect = (node) => {
    if (onNodeSelect) {
      onNodeSelect(node);
    }
  };

  const handleNodeExpand = (event, nodeKey) => {
    event.stopPropagation();
    setExpandedNodes((current) => ({
      ...current,
      [nodeKey]: current[nodeKey] === undefined ? false : !current[nodeKey],
    }));
  };

  const handleAllNodesExpand = (event, expand) => {
    event.stopPropagation();

    if (!treeDirs || !Array.isArray(treeDirs) || treeDirs.length === 0) return;

    const nodesToExpand = {};

    const addExpandableNodes = (nodes) => {
      nodes.forEach((node) => {
        if (!node || !node.key) return;

        const children = Array.isArray(node.children) ? node.children : [];

        if (children.length > 0) {
          nodesToExpand[node.key] = expand;
          addExpandableNodes(children);
        }
      });
      setExpandedNodes(nodesToExpand);
    };

    addExpandableNodes(treeDirs);
  };

  return {
    treeDirs,
    isTreeFetching,
    refetchTree,
    expandedNodes,
    handleNodeSelect,
    handleNodeExpand,
    handleAllNodesExpand,
  };
};

export default useHierarchyTree;
