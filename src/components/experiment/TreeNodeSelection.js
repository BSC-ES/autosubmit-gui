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
          className='btn btn-sm btn-primary menu-btn'
          type='button'
          data-toggle='modal'
          data-target={"#command" + target}
          onClick={onChangeStatus}
        >
          <span
            data-toggle='tooltip'
            data-placement='bottom'
            title='Generate a command/text to change the status of the selected jobs on the Tree View.'
          >
            <strong>Change Status</strong>
          </span>
        </button>
        <CommandModal source={"tree-only"} target={target} />
      </Fragment>
    );
  }

  return null;
};

export default TreeNodeSelection;
