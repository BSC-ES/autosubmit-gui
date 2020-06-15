import React, { useContext, Fragment } from "react";
import ExperimentContext from "../context/experiment/experimentContext";

const JobSelection = () => {
  //const util = require("util");
  const experimentContext = useContext(ExperimentContext);
  const {
    currentSelected,
    activateSelectionMode,
    deactivateSelectionMode,
    removeSelectedJob,
    canSelect,
    setCurrentCommand,
    experiment,
    currentCommand,
  } = experimentContext;
  var expid = null;
  if (experiment) {
    expid = experiment.expid;
  }

  const onSelectionMode = (e) => {
    e.preventDefault();
    activateSelectionMode();
    //console.log("Sending " + boolValue);
  };

  const copyContent = (inputname) => (e) => {
    e.preventDefault();
    console.log("Sending " + inputname);
    window.copyTextToClipboard(inputname);
  };

  const offSelectionMode = (e) => {
    e.preventDefault();
    deactivateSelectionMode();
    //console.log("Sending " + boolValue);
  };

  const removeSelected = (name) => (e) => {
    e.preventDefault();
    //console.log("Sending " + inputname);
    removeSelectedJob(name);
  };

  const setStatusCommand = (status) => (e) => {
    e.preventDefault();
    setCurrentCommand(status, currentSelected, expid);
  };

  if (canSelect === false) {
    return (
      <div className='card-footer p-0'>
        <div className='row'>
          <div className='col-3'>
            <form className='form' onSubmit={onSelectionMode}>
              <input
                type='submit'
                value='Activate Selection Mode'
                className='btn btn-info btn-sm m-2'
              />
            </form>
          </div>
          <div className='col-9'></div>
        </div>
      </div>
    );
  } else if (canSelect === true) {
    //console.log(currentSelected);
    return (
      <Fragment>
        <div className='card-footer p-0'>
          <div className='row'>
            <div className='col-2'>
              <button
                className='btn btn-info btn-sm m-2'
                data-toggle='modal'
                data-target='#command'
              >
                <strong>Generate Command</strong>
              </button>
              <form className='form' onSubmit={offSelectionMode}>
                <input
                  type='submit'
                  value='Deactivate Selection Mode'
                  className='btn btn-danger btn-sm m-2'
                />
              </form>
            </div>
            <div className='col-10'>
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
        </div>

        <div
          className='modal fade'
          id='command'
          tabIndex='-1'
          role='dialog'
          aria-labelledby='commandTitle'
          aria-hidden='true'
        >
          <div className='modal-dialog' role='document'>
            <div className='modal-content' style={{ width: "600px" }}>
              {/* <div className='modal-header'>
                <h5 className='modal-title' id='commandTitle'>
                  Children List
                </h5>
                <button
                  className='close'
                  type='button'
                  data-dismiss='modal'
                  aria-label='Close'
                >
                  <span aria-hidden='true'>&times;</span>
                </button>
              </div> */}
              <div className='modal-body pb-1'>
                <div className='row'>
                  <div className='col-12'>
                    To:{" "}
                    <div className='btn-group' role='group' aria-label='Status'>
                      <button
                        className='btn btn-sm'
                        style={{ background: "lightblue" }}
                        onClick={setStatusCommand("READY")}
                      >
                        Ready
                      </button>
                      <button
                        className='btn btn-sm btn-secondary'
                        onClick={setStatusCommand("WAITING")}
                      >
                        Waiting
                      </button>
                      <button
                        className='btn btn-sm'
                        style={{ background: "yellow" }}
                        onClick={setStatusCommand("COMPLETED")}
                      >
                        Completed
                      </button>
                      <button
                        className='btn btn-sm'
                        style={{ background: "orange" }}
                        onClick={setStatusCommand("SUSPENDED")}
                      >
                        Suspended
                      </button>
                      <button
                        className='btn btn-sm btn-danger'
                        onClick={setStatusCommand("FAILED")}
                      >
                        Failed
                      </button>
                    </div>
                  </div>
                </div>
                <div className='row mt-2 mx-1'>
                  <div
                    className='col-12'
                    style={{
                      fontFamily: "Courier",
                      background: "black",
                      color: "white",
                    }}
                  >
                    {currentCommand && (
                      <div className='p-2'>
                        {JSON.parse(JSON.stringify(currentCommand))}
                      </div>
                    )}
                  </div>
                </div>

                {/* <ul>
                    {selectedNode.children_list.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul> */}
              </div>
              {currentCommand && currentCommand.length > 0 && (
                <div className='row mx-1'>
                  <div className='col-12'>
                    <button
                      className='btn btn-sm btn-light'
                      onClick={copyContent(
                        JSON.parse(JSON.stringify(currentCommand))
                      )}
                    >
                      Copy to Clipboard
                    </button>
                  </div>
                </div>
              )}
              <div className='modal-footer'>
                <button
                  type='button'
                  className='btn btn-sm btn-dark'
                  data-dismiss='modal'
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
  return <div className='card-footer'></div>;
};

export default JobSelection;
