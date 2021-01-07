import React, { useContext, Fragment } from "react";
import TreeContext from "../context/tree/treeContext";
import ExperimentContext from "../context/experiment/experimentContext";
import CommandModal from "./CommandModal";

const TreeNodeSelection = ({ target = "manual-tree" }) => {
  const treeContext = useContext(TreeContext);
  const experimentContext = useContext(ExperimentContext);
  const { selectedTreeNode, updateTreeSelectedNodes } = treeContext;
  const { canSelect } = experimentContext;

  const onChangeStatus = (e) => {
    e.preventDefault();
    updateTreeSelectedNodes();
  };

  if (selectedTreeNode && !canSelect) {
    return (
      <Fragment>
        <button
          className='btn-sm btn-info'
          type='button'
          data-toggle='modal'
          data-target={"#command" + target}
          onClick={onChangeStatus}
        >
          <strong>Change Status</strong>
        </button>
        <CommandModal source={"tree-only"} target={target} />
      </Fragment>
    );
  }

  return null;
};

export default TreeNodeSelection;
