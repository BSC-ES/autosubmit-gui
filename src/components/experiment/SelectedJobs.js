import React, { useContext, Fragment } from "react";
import ExperimentContext from "../context/experiment/experimentContext";
import CommandModal from "./CommandModal";

const SelectedJobs = ({ source, target }) => {
  const experimentContext = useContext(ExperimentContext);
  const { currentSelected, removeSelectedJob, canSelect } = experimentContext;

  const removeSelected = (name) => (e) => {
    e.preventDefault();
    removeSelectedJob(name);
  };

  if (canSelect === true) {
    return (
      <Fragment>
        <div className='card p-0 m-0'>
          <div className='card-header text-center p-1'>
            <button
              className='btn btn-primary btn-sm'
              data-toggle='modal'
              data-target={"#command" + target}
            >
              <span>Generate Command</span>
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
                    className='btn btn-sm btn-secondary'
                    style={{ background: job.color }}
                    onClick={removeSelected(job.name)}
                  >
                    <span>{job.name}</span>
                    <span></span>
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

export default SelectedJobs;
