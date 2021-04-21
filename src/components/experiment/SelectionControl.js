import React, { useContext } from "react";
import ExperimentContext from "../context/experiment/experimentContext";
import TreeContext from "../context/tree/treeContext";

const SelectionControl = () => {
  const experimentContext = useContext(ExperimentContext);
  const treeContext = useContext(TreeContext);
  const {
    canSelect,
    activateSelectionMode,
    deactivateSelectionMode,
  } = experimentContext;
  const { setStartSelection } = treeContext;
  // var expid = null;
  // if (experiment) {
  //   expid = experiment.expid;
  // }

  const onSelectionMode = (e) => {
    e.preventDefault();
    activateSelectionMode();
    setStartSelection();
    //console.log("Sending " + boolValue);
  };

  const offSelectionMode = (e) => {
    e.preventDefault();
    deactivateSelectionMode();
    //console.log("Sending " + boolValue);
  };

  if (canSelect === true) {
    return (
      <form className='form' onSubmit={offSelectionMode}>
        <input
          type='submit'
          value='Deactivate Selection Mode'
          className='btn btn-danger btn-sm btn-block'
        />
      </form>
    );
  } else {
    return (
      <form className='form' onSubmit={onSelectionMode}>
        <input
          type='submit'
          value='Activate Selection Mode'
          className='btn btn-secondary btn-sm btn-block'
          data-toggle='tooltip' 
          data-placement='bottom' 
          title="You select jobs by clicking on them, then you can generate a command with those selected jobs."
        />
      </form>
    );
  }
};

export default SelectionControl;
