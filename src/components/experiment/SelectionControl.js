import React, { useContext } from "react";
import ExperimentContext from "../context/experiment/experimentContext";

const SelectionControl = () => {
  const experimentContext = useContext(ExperimentContext);
  const {
    canSelect,
    activateSelectionMode,
    deactivateSelectionMode,
  } = experimentContext;
  // var expid = null;
  // if (experiment) {
  //   expid = experiment.expid;
  // }

  const onSelectionMode = (e) => {
    e.preventDefault();
    activateSelectionMode();
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
          className='btn btn-info btn-sm btn-block'
        />
      </form>
    );
  }
};

export default SelectionControl;
