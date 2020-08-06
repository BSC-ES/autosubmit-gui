import React, { useContext, Fragment } from "react";
import ExperimentContext from "../context/experiment/experimentContext";
import { DEBUG } from "../context/vars";

const JobSelection = ({ target }) => {
  //const util = require("util");
  const experimentContext = useContext(ExperimentContext);
  const {
    currentSelected,
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

  // const onSelectionMode = (e) => {
  //   e.preventDefault();
  //   activateSelectionMode();
  //   //console.log("Sending " + boolValue);
  // };

  const copyContent = (inputname) => {
    //e.preventDefault();
    DEBUG && console.log("Sending " + inputname);
    window.copyTextToClipboard(inputname);
  };

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

  const setStatusCommand = (status) => (e) => {
    e.preventDefault();
    setCurrentCommand(status, currentSelected, expid);
  };

  let modalHeader = (
    <div className='col-12'>
      Invalid Selection: You have to select at least one job.
    </div>
  );
  if (currentSelected && currentSelected.length > 0) {
    modalHeader = (
      <div className='col-12'>
        Set status to:{" "}
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
    );
  }
  //copying to Clipboard
  if (currentCommand && currentCommand.length > 0) {
    DEBUG && console.log(currentCommand);
    copyContent(JSON.parse(JSON.stringify(currentCommand)));
  }

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

        <div
          className='modal fade'
          id={"command" + target}
          tabIndex='-1'
          role='dialog'
          aria-labelledby={"commandTitle" + target}
          aria-hidden='true'
        >
          <div className='modal-dialog' role='document'>
            <div className='modal-content' style={{ width: "600px" }}>
              <div className='modal-body pb-1'>
                <div className='row'>{modalHeader}</div>
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
              {/* {currentCommand && currentCommand.length > 0 && (
                
                <div className='row mx-1 mb-2'>
                  <div className='col-12'>
                    <button
                      className='btn btn-sm btn-info'
                      onClick={copyContent(
                        JSON.parse(JSON.stringify(currentCommand))
                      )}
                    >
                      Copy to Clipboard
                    </button>
                  </div>
                </div>
              )} */}
              {currentCommand && currentCommand.length > 0 && (
                <div className='row mx-1 mb-2 float-left'>
                  <div className='col-12'>
                    The command has been copied to the clipboard. Paste it in
                    your terminal.
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
  return <div className='card'></div>;
};

export default JobSelection;
