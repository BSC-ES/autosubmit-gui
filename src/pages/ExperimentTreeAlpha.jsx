import { useParams } from "react-router-dom";
import { autosubmitApiV3 } from "../services/autosubmitApiV3";
import Tree from "../common/JobTree";
import { useEffect, useMemo, useState } from "react";

const _customTitleRender = ({ data }) => {
  return (
    <div
      style={{
        fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
        fontSize: "14px",
        userSelect: "none",
      }}
      dangerouslySetInnerHTML={{ __html: data.title }}
    />
  );
};

const ExperimentTreeAlpha = () => {
  const routeParams = useParams();
  const [filter, setFilter] = useState("");
  const [treeData, setTreeData] = useState(null);

  const { data, isFetching, refetch, isError } =
    autosubmitApiV3.endpoints.getExperimentTreeView.useQuery({
      expid: routeParams.expid,
      runId: null,
    });

  useEffect(() => {
    if (data && data.tree) {
      if (filter && filter.length > 0) {
        // Apply filter to the tree data
        const applyFilter = (nodes) => {
          return nodes
            .map((node) => {
              if (node.children) {
                const filteredChildren = applyFilter(node.children);
                if (
                  filteredChildren.length > 0 ||
                  node.title.includes(filter)
                ) {
                  return { ...node, children: filteredChildren };
                }
                return null;
              } else if (node.title.includes(filter)) {
                return node;
              }
              return null;
            })
            .filter((node) => node !== null);
        };
        const filteredTree = applyFilter(data.tree);
        setTreeData(filteredTree);
        return;
      }
      setTreeData(data.tree);
      return;
    }
    setTreeData(null);
    return;
  }, [data, filter]);

  const handleNodeSelect = (selectedNodeIds) => {
    console.log("Selected node IDs:", selectedNodeIds);
  };

  const handleModify = () => {
    setTreeData([
      { refKey: Date.now(), title: "New node" },
      ...treeData,
      // { refKey: Date.now(), title: "New Node" },
    ]);
  };
  return (
    <div className="w-full border rounded p-2">
      <button
        className="btn btn-sm btn-primary mb-2"
        onClick={() => setFilter("LOCAL")}
      >
        Filter LOCAL
      </button>
      <button
        className="btn btn-sm btn-success mb-2 ms-2"
        onClick={handleModify}
      >
        Add Node
      </button>
      {isFetching && (
        <div className="p-4 text-sm text-gray-500">Loading...</div>
      )}
      {isError && (
        <div className="p-4 text-sm text-red-500">Error loading tree data.</div>
      )}
      {treeData && (
        <Tree
          nodes={treeData}
          titleRenderFn={_customTitleRender}
          onSelectNodes={handleNodeSelect}
          selectable={true}
        />
      )}
    </div>
  );
};
export default ExperimentTreeAlpha;
