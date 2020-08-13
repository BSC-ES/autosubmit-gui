import React, { useContext, Fragment } from "react";
import ExperimentContext from "../context/experiment/experimentContext";
import CommandModal from "./CommandModal";

const JobSelection = ({ source, target }) => {
  //const util = require("util");
  const experimentContext = useContext(ExperimentContext);
  const { currentSelected, removeSelectedJob, canSelect } = experimentContext;

  // const onSelectionMode = (e) => {
  //   e.preventDefault();
  //   activateSelectionMode();
  //   //console.log("Sending " + boolValue);
  // };

  // const offSelectionMode = (e) => {
  //   e.preventDefault();
  //   deactivateSelectionMode();
  //   //console.log("Sending " + boolValue);
  // };

  const removeSelected = (name) => (e) => {
    e.preventDefault();
    //console.log("Sending " + inputname);
    removeSelectedJob(name);
  };

  if (canSelect === true) {
    return (
      <Fragment>
        <div className='card p-0 m-0'>
          <div className='card-header text-center p-0 m-0'>
            <button
              className='btn btn-info btn-sm my-0 py-0'
              data-toggle='modal'
              data-target={"#command" + target}
            >
              <strong>Generate Command</strong>
            </button>
          </div>
          <div className='card-body'>
            {currentSelected &&
              currentSelected
                .sort((a, b) => (a.name > b.name ? -1 : 1))
                .map((job) => (
                  <button
                    key={job.name}
                    type='button'
                    className='btn btn-sm m-1 p-1'
                    style={{ background: job.color }}
                    onClick={removeSelected(job.name)}
                  >
                    <small>{job.name}</small>
                  </button>
                ))}
          </div>
        </div>
        <CommandModal source={source} target={target} />
      </Fragment>
    );
  }
  return <div className='card'></div>;
};

export default JobSelection;
