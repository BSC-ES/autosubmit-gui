import React, { useContext, Fragment } from "react";
import GraphContext from "../context/graph/graphContext";
import ExperimentContext from "../context/experiment/experimentContext";
import CommandModal from "./CommandModal";

const GraphNodeSelection = ({ target = "manual-graph" }) => {
  const graphContext = useContext(GraphContext);
  const experimentContext = useContext(ExperimentContext);
  const { selection, updateGraphSelectedNodes } = graphContext;
  const { canSelect } = experimentContext;

  const onChangeStatus = (e) => {
    e.preventDefault();
    updateGraphSelectedNodes();
  };

  if (selection && !canSelect) {
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
        <CommandModal source={"graph-only"} target={target} />
      </Fragment>
    );
  }

  return null;
};

export default GraphNodeSelection;
