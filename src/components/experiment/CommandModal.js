import React, { useContext } from "react";
import GraphContext from "../context/graph/graphContext";
import TreeContext from "../context/tree/treeContext";
import ExperimentContext from "../context/experiment/experimentContext";
import { DEBUG } from "../context/vars";
import { commandGenerator, commandGeneratorGraph, statusChangeTextGeneratorGraph, statusChangeTextGenerator } from "../context/utils";
//import treeContext from "../context/tree/treeContext";

const CommandModal = ({ source, target }) => {
  const graphContext = useContext(GraphContext);
  const experimentContext = useContext(ExperimentContext);
  const treeContext = useContext(TreeContext);

  const {
    currentSelected,
    setCurrentCommand,
    setCurrentTextCommand,
    experiment,
    currentCommand,
    currentTextCommand,
  } = experimentContext;

  const { treeSelectedNodes, currentCommandTree, currentTextCommandTree, setCurrentTextCommandTree, setCurrentCommandTree } = treeContext;

  const {
    graphSelectedNodes,
    setCurrentCommandGraph,
    setCurrentTextCommandGraph,
    currentTextCommandGraph,
    currentCommandGraph,
  } = graphContext;
  let expid = null;
  if (experiment) {
    expid = experiment.expid;
  }
  const sourceSelection =
    source === "graph-only" ? graphSelectedNodes : (source === "tree-only" ? treeSelectedNodes : currentSelected);
  const sourceCommand =
    source === "graph-only" ? currentCommandGraph : (source === "tree-only" ? currentCommandTree : currentCommand);
  const sourceTextCommand = source === "graph-only" ? currentTextCommandGraph : (source === "tree-only" ? currentTextCommandTree : currentTextCommand);

  const invalidMessage =
    source === "graph-only"
      ? "Invalid Selection: You have to select at least one job from the Graph. You can select multiple jobs."
      : "Invalid Selection: You have to select at least one job.";

  const setStatusTextCommand = (status) => (e) => {
    e.preventDefault();
    let command = "";
    if (source === "graph-only") {
      command = statusChangeTextGeneratorGraph(sourceSelection, status);      
      copyContent(command);
      setCurrentTextCommandGraph(command);
    } else if (source === "tree-only"){      
      command = statusChangeTextGeneratorGraph(sourceSelection, status);
      copyContent(command);
      setCurrentTextCommandTree(command);
    } else {      
      command = statusChangeTextGenerator(sourceSelection, status);
      copyContent(command);
      setCurrentTextCommand(command);
    }
  };


  const setStatusCommand = (status) => (e) => {
    e.preventDefault();
    let command = "";
    if (source === "graph-only") {      
      command = commandGeneratorGraph(expid, sourceSelection, status);
      copyContent(command);
      setCurrentCommandGraph(command);
    } else if (source === "tree-only"){      
      command = commandGeneratorGraph(expid, sourceSelection, status);
      copyContent(command);
      setCurrentCommandTree(command);
    } else {
      command = commandGenerator(expid, sourceSelection, status);
      copyContent(command);
      setCurrentCommand(command);
    }
  };

  const copyContent = (inputname) => {
    //e.preventDefault();
    DEBUG && console.log("Sending " + inputname);
    window.copyTextToClipboard(inputname);
  };

  let modalHeader = <div className='col-12'>{invalidMessage}</div>;
  let modalHeader2 = <div className='col-12'>{invalidMessage}</div>;

  if (sourceSelection && sourceSelection.length > 0) {
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

    modalHeader2 = (
      <div className="col-12">
      Generate file text:{" "}
      <div className='btn-group' role='group' aria-label='Status'>
        <button
          className='btn btn-sm'
          style={{ background: "lightblue" }}
          onClick={setStatusTextCommand("READY")}
        >
          Ready
        </button>
        <button
          className='btn btn-sm btn-secondary'
          onClick={setStatusTextCommand("WAITING")}
        >
          Waiting
        </button>
        <button
          className='btn btn-sm'
          style={{ background: "yellow" }}
          onClick={setStatusTextCommand("COMPLETED")}
        >
          Completed
        </button>
        <button
          className='btn btn-sm'
          style={{ background: "orange" }}
          onClick={setStatusTextCommand("SUSPENDED")}
        >
          Suspended
        </button>
        <button
          className='btn btn-sm btn-danger'
          onClick={setStatusTextCommand("FAILED")}
        >
          Failed
        </button>
      </div>
    </div>
    );
  }
  return (
    <div
      className='modal fade'
      id={"command" + target}
      tabIndex='-1'
      role='dialog'
      aria-labelledby={"commandTitle" + target}
      aria-hidden='true'
    >
      <div className='modal-dialog modal-dialog-status' role='document'>
        <div className='modal-content'>
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
                {sourceCommand && (
                  <div className='p-2'>
                    {JSON.parse(JSON.stringify(sourceCommand))}
                  </div>
                )}
              </div>
            </div>
          </div>
          {sourceCommand && sourceCommand.length > 0 && (
            <div className='row mx-1 mb-2 float-left'>
              <div className='col-12'>
                The command has been copied to the clipboard. Paste it in your
                terminal.
              </div>
            </div>
          )}
          <div className='modal-body pb-1'>
            <div className='row'>{modalHeader2}</div>
            <div className='row mt-2 mx-1'>
              <div
                className='col-12'
                style={{
                  fontFamily: "Courier",
                  background: "black",
                  color: "white",
                }}
              >
                {sourceTextCommand && (
                  <div className='p-2'>
                    {/* {JSON.parse(JSON.stringify(sourceTextCommand))} */}
                    {sourceTextCommand.split("\n").map((item, index) => (
                      <p key={index}>{item}</p>)
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          {sourceTextCommand && sourceTextCommand.length > 0 && (
            <div className='row mx-1 mb-2 float-left'>
              <div className='col-12'>
                The text has been copied to the clipboard. Paste it in your status change file.
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
  );
};

export default CommandModal;
