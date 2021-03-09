import React, { useContext, Fragment } from "react";
import ExperimentContext from "../context/experiment/experimentContext";
import GraphContext from "../context/graph/graphContext";
import JobHistory from "./JobHistory";
import JobLog from "./JobLog";
import { secondsToDelta } from "../context/utils";
import { DEBUG, statusCodeToStyle } from "../context/vars";

const Selection = () => {
  const experimentContext = useContext(ExperimentContext);
  const graphContext = useContext(GraphContext);
  const { experiment } = experimentContext;
  const { data, selection } = graphContext;
  // const { model, branch, hpc } = experiment;
  //var currentSelection = "Node: "

  // const navigateTo = e => {
  //     e.preventDefault();
  //     navToLatestCompleted();
  // };

  let currentNode = "";
  let selectedNode = null;
  let parentList = [];
  let childrenList = [];


  const copyContent = (inputname) => (e) => {
    e.preventDefault();
    DEBUG && console.log("Sending " + inputname);
    window.copyToClip(inputname);
  };

  if (selection && data && data.nodes) {
    //console.log("Current selection " + selection);
    selection.map((node) => (currentNode = node));

    selectedNode = data.nodes.find((node) => node.id === currentNode);
    if (selectedNode && selectedNode.parent_list && selectedNode.parent_list.length > 0){
      parentList = data.nodes.filter((node) => selectedNode.parent_list.indexOf(node.id) >= 0);
      //console.log(parentList);
    }
    if (selectedNode && selectedNode.children_list && selectedNode.children_list.length > 0){
      childrenList = data.nodes.filter((node) => selectedNode.children_list.indexOf(node.id) >= 0);
      //console.log(childrenList);
    }

    
    // If selection mode is activated
    //console.log("Selected node")
    //console.log("Data: " + selectedNode.id + " " + selectedNode.platform_name)
  }
  return (
    <Fragment>
      {selectedNode && (
        <Fragment>
          <div className='row'>
            <div className='col-12'>
              <div className='card text-white bg-info' style={experimentStyle}>
                <div className='card-header text-center p-0' style={headerCard}>
                  <div className='mh-100 px-0 mx-0'>
                    <small>
                      <strong>{selectedNode.id}</strong>{" "}
                      </small>
                      <JobHistory source='graph' />
                    
                  </div>
                </div>
                <div className='card-body py-0'>
                  <div className='row'>
                    <div className='col-md-6'>
                      <small>
                        <strong>Start:</strong> {selectedNode.date}
                      </small>
                    </div>
                    <div className='col-md-6'>
                      <small>
                        <strong>End:</strong> {selectedNode.date_plus}
                      </small>
                    </div>
                  </div>
                  <div>
                    <div className='row'>
                      <div className='col-12'>
                        <small>
                          <strong>Section:</strong> {selectedNode.section}
                        </small>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className='row'>
                      <div className='col-md-6'>
                        <small>
                          <strong>Member:</strong> {selectedNode.member}
                        </small>
                      </div>
                      <div className='col-md-6'>
                        <small>
                          <strong>Chunk:</strong> {selectedNode.chunk}
                        </small>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className='row'>
                      <div className='col-12'>
                        <small>
                          <strong>Platform:</strong>{" "}
                          {selectedNode.platform_name &&
                            selectedNode.platform_name}{" "}
                          {!selectedNode.platform_name && experiment.hpc}
                          {selectedNode.rm_id && (
                            <span>
                              <strong> &nbsp; Id: </strong>
                              {selectedNode.rm_id}
                            </span>
                          )}
                        </small>
                      </div>
                    </div>
                  </div>
                  {/* <div>
                                        <small><strong>Priority:</strong> {selectedNode.priority}</small>
                                    </div> */}
                  <div>
                    <div className='row'>
                      <div className='col-6'>
                        <small>
                          <strong>Processors:</strong> {selectedNode.processors}
                        </small>
                      </div>
                      <div className='col-6'>
                        <small>
                          <strong>Wallclock:</strong> {selectedNode.wallclock}
                        </small>
                      </div>
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-md-6'>
                      {" "}
                      {selectedNode.minutes_queue >= 0 && (
                        <span
                          className='badge text-center'
                          style={{
                            width: "100%",
                            backgroundColor:
                              selectedNode.status === "SUBMITTED"
                                ? "cyan"
                                : "pink",
                            color: "black",
                          }}
                        >
                          <small>
                            {selectedNode.status === "SUBMITTED"
                              ? "Submit"
                              : "Queue"}
                            :
                          </small>{" "}
                          {secondsToDelta(selectedNode.minutes_queue)}
                          {/* <small>min.</small> */}
                        </span>
                      )}
                    </div>
                    <div className='col-md-6'>
                      {selectedNode.minutes >= 0 &&
                        ["RUNNING", "COMPLETED", "FAILED"].includes(
                          selectedNode.status
                        ) && (
                          <span
                            className='badge badge-success text-center ml-1'
                            style={{ width: "100%" }}
                          >
                            <small>Run:</small>{" "}
                            {secondsToDelta(selectedNode.minutes)}{" "}
                            {/* <small>min.</small> */}
                          </span>
                        )}
                    </div>
                  </div>

                  <div className='row py-1'>
                    <div className='col-md-6'>
                      <span
                        className='badge text-center'
                        style={{
                          width: "100%",
                          backgroundColor: selectedNode.status_color,
                          color:
                            selectedNode.status === "RUNNING"
                              ? "white"
                              : "black",
                        }}
                      >
                        Status:
                        <strong> {selectedNode.status}</strong>
                      </span>
                    </div>
                    <div className='col-md-3 px-1'>
                      {selectedNode.children_list &&
                        selectedNode.children_list.length > 0 && (
                          <button
                            className='btn btn-dark btn-sm btn-block'
                            data-toggle='modal'
                            data-target='#childrenList'
                            type='button'
                          >
                            <small>
                              <strong>Out:</strong> {selectedNode.children}
                            </small>
                          </button>
                        )}
                      {selectedNode.children_list &&
                        selectedNode.children_list.length === 0 && (
                          <button
                            className='btn-sm btn-dark btn-block'
                            type='button'
                            disabled
                          >
                            <small>
                              <strong>Out:</strong> {selectedNode.children}
                            </small>
                          </button>
                        )}
                    </div>
                    <div className='col-md-3 px-1'>
                      {selectedNode.parent_list &&
                        selectedNode.parent_list.length > 0 && (
                          <button
                            className='btn-sm btn-dark btn-block'
                            data-toggle='modal'
                            data-target='#parentList'
                            type='button'
                          >
                            <small>
                              <strong>In:</strong> {selectedNode.parents}
                            </small>
                          </button>
                        )}
                      {selectedNode.parent_list &&
                        selectedNode.parent_list.length === 0 && (
                          <button
                            className='btn-sm btn-dark btn-block'
                            type='button'
                            disabled
                          >
                            <small>
                              <strong>In:</strong> {selectedNode.parents}
                            </small>
                          </button>
                        )}
                    </div>
                  </div>
                  <div>
                    {selectedNode.out && (
                      <div className='row'>
                        <div className='col-12 px-0'>
                          <form
                            onSubmit={copyContent("g_out")}
                            className='form'
                          >
                            <div className='input-group input-group-sm'>
                              <input
                                className='form-control py-0'
                                type='text'
                                value={selectedNode.out}
                                id='g_out'
                                readOnly
                              />
                              <div className='input-group-append'>
                                <input
                                  type='submit'
                                  className='btn-sm btn-light py-0'
                                  value='Copy out'
                                />
                              </div>
                              <JobLog source={selectedNode.out}/>  
                            </div>
                          </form>
                        </div>
                      </div>
                    )}

                    {selectedNode.err && (
                      <div className='row mt-1'>
                        <div className='col-12 px-0'>
                          <form
                            onSubmit={copyContent("g_err")}
                            className='form'
                          >
                            <div className='input-group input-group-sm'>
                              <input
                                className='form-control py-0'
                                type='text'
                                value={selectedNode.err}
                                id='g_err'
                                readOnly
                              />
                              <div className='input-group-append'>
                                <input
                                  type='submit'
                                  className='btn btn-light btn-sm py-0'
                                  value='Copy err'
                                />
                              </div>
                              <JobLog source={selectedNode.err}/>
                            </div>
                          </form>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className='row'>
                    <div className='col-md-8'>
                      <table>
                        <tbody>
                          {selectedNode.submit !== null && (
                            <tr>
                              <td>
                                <small>Submit:</small>
                              </td>
                              <td>
                                <span className='badge badge-dark'>
                                  {selectedNode.submit}
                                </span>
                              </td>
                            </tr>
                          )}
                          {selectedNode.start !== null && (
                            <tr>
                              <td>
                                <small>Start:</small>
                              </td>
                              <td>
                                <span className='badge badge-dark'>
                                  {selectedNode.start}
                                </span>
                              </td>
                            </tr>
                          )}
                          {selectedNode.finish !== null && (
                            <tr>
                              <td>
                                <small>Finish:</small>
                              </td>
                              <td>
                                <span className='badge badge-dark'>
                                  {selectedNode.finish}
                                </span>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                    {selectedNode.SYPD !== undefined && selectedNode.SYPD !== null && selectedNode.SYPD > 0 && (
                      <div className="col-md-4">
                        <span className="badge badge-info" data-toggle='tooltip' data-placement='bottom' title="Generalization of Simulated Years per Day.">SYPD: {selectedNode.SYPD}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Fragment>
      )}
      {!selectedNode && data && (
        <div className='row'>
          <div className='col-12'>
            <div className='card text-white bg-info' style={experimentStyle}>
              <div className='card-header text-center py-0'>
                <small>Here goes the Job Id</small>
              </div>
              <div className='card-body'>
                <div className='text-center'>
                  <small>Select a Node to see more information.</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {selectedNode &&
        childrenList &&
        childrenList.length > 0 && (
          <div
            className='modal fade'
            id='childrenList'
            tabIndex='-1'
            role='dialog'
            aria-labelledby='childrenListTitle'
            aria-hidden='true'
          >
            <div className='modal-dialog modal-dialog-list' role='document'>
              <div className='modal-content'>
                <div className='modal-header'>
                  <h5 className='modal-title' id='childrenListTitle'>
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
                </div>
                <div className='modal-body'>
                  <ul>
                    {childrenList.map((item, index) => (
                      <li key={index}>{item.id} <span className="badge" style={statusCodeToStyle(item.status_code)}>{item.status}</span></li>
                    ))}
                  </ul>
                </div>
                <div className='modal-footer'>
                  <button
                    type='button'
                    className='btn btn-secondary'
                    data-dismiss='modal'
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      {selectedNode &&
        parentList &&
        parentList.length > 0 && (
          <div
            className='modal fade'
            id='parentList'
            tabIndex='-1'
            role='dialog'
            aria-labelledby='parentListTitle'
            aria-hidden='true'
          >
            <div className='modal-dialog modal-dialog-list' role='document'>
              <div className='modal-content'>
                <div className='modal-header'>
                  <h5 className='modal-title' id='parentListTitle'>
                    Parent List
                  </h5>
                  <button
                    className='close'
                    type='button'
                    data-dismiss='modal'
                    aria-label='Close'
                  >
                    <span aria-hidden='true'>&times;</span>
                  </button>
                </div>
                <div className='modal-body'>
                  <ul>
                    {parentList.map((item, index) => (
                      <li key={index}>{item.id} <span className="badge" style={statusCodeToStyle(item.status_code)}>{item.status}</span></li>
                    ))}
                  </ul>
                </div>
                <div className='modal-footer'>
                  <button
                    type='button'
                    className='btn btn-secondary'
                    data-dismiss='modal'
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
    </Fragment>
  );
};

const experimentStyle = {
  height: 360,
};

const headerCard = {
  height: 30,
};

export default Selection;
