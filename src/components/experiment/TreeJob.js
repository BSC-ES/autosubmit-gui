import React, { useContext, Fragment } from "react";
import ExperimentContext from "../context/experiment/experimentContext";
import TreeContext from "../context/tree/treeContext";
import JobHistory from "./JobHistory";
import JobLog from "./JobLog";
import { secondsToDelta } from "../context/utils";
import { DEBUG, statusCodeToStyle, SHOW_PERFORMANCE_TAB } from "../context/vars";

const TreeJob = () => {
  const experimentContext = useContext(ExperimentContext);
  const treeContext = useContext(TreeContext);
  const { experiment } = experimentContext;
  const { selectedTreeNode, treedata } = treeContext;

  let selectedNode = null;
  let parentList = null;
  let childrenList = null;
  //var currentNode = "";
  if (
    selectedTreeNode &&
    selectedTreeNode.node &&
    selectedTreeNode.node.refKey
  ) {
    const currentNode = selectedTreeNode.node.refKey;
    if (treedata && treedata.jobs) {
      selectedNode = treedata.jobs.find((job) => job.id === currentNode);
      if (selectedNode && selectedNode.parent_list && selectedNode.parent_list.length > 0) {
        parentList = treedata.jobs.filter((job) => selectedNode.parent_list.indexOf(job.id) >= 0);
        //console.log(selectedNode.parent_list);
        //console.log(parentList);
      }
      if (selectedNode && selectedNode.children_list && selectedNode.children_list.length > 0) {
        childrenList = treedata.jobs.filter((job) => selectedNode.children_list.indexOf(job.id) >= 0);
        //console.log(selectedNode.children_list);
        //console.log(childrenList);
      }
      //console.log(selectedNode);
    } else {
      selectedNode = null;
    }
  } else {
    selectedNode = null;
  }

  const copyContent = (inputname) => (e) => {
    e.preventDefault();
    DEBUG && console.log("Sending " + inputname);
    window.copyToClip(inputname);
  };

  // console.log(selectedNode);
  return (
    <Fragment>
      {selectedNode && (
        <Fragment>
          {/* <div className='row'> */}
          <div className='col-12 px-0'>
            <div className='card text-white bg-primary rounded-0' style={experimentStyle}>
              <div className='card-header text-center p-0' style={headerCard}>
                <div className='mh-100 px-0 mx-0'>

                  <strong>{selectedNode.id}</strong>{" "}

                  <JobHistory source='tree' />
                </div>
              </div>
              <div className='card-body p-0'>
                <div className="container">
                  <div className='row'>
                    <div className='col'>
                      <strong>Start:</strong> {selectedNode.date}
                    </div>
                    <div className='col'>
                      <strong>End:</strong> {selectedNode.date_plus}
                    </div>
                  </div>
                  <div>
                    <div className='row'>
                      <div className='col'>
                        <strong>Section:</strong> {selectedNode.section}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className='row'>
                      <div className="col">
                        <strong>Member:</strong> {selectedNode.member}
                      </div>
                      <div className="col">
                        <strong>Chunk:</strong> {selectedNode.chunk}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className='row-hl d-flex flex-wrap'>
                      <div className="item-hl"><strong>Platform: </strong>{selectedNode.platform_name ? selectedNode.platform_name : experiment.hpc}</div>
                      {selectedNode.queue && <div className="item-hl ml-3"><strong>QoS: </strong>{selectedNode.queue}</div>}
                      <div className="item-hl ml-3">{selectedNode.rm_id && <span><strong>Id: </strong>{selectedNode.rm_id}</span>}</div>
                    </div>
                  </div>
                  <div>
                    <div className='row'>
                      <div className='col'>
                        <strong>Processors:</strong> {selectedNode.processors}
                      </div>
                      <div className='col'>
                        <strong>Wallclock:</strong> {selectedNode.wallclock}
                      </div>
                    </div>
                  </div>
                  <div className='row-hl d-flex flex-wrap py-1'>
                    <div className='item-hl'>
                      {" "}
                      {selectedNode.minutes_queue >= 0 && ["SUBMITTED", "QUEUING", "RUNNING", "COMPLETED", "FAILED"].includes(selectedNode.status) && (
                        <span
                          className='rounded text-center px-2'
                          style={{
                            width: "100%",
                            backgroundColor:
                              selectedNode.status === "SUBMITTED"
                                ? "cyan"
                                : "pink",
                            color: "black",
                          }}
                        >
                          <strong>
                            {selectedNode.status === "SUBMITTED"
                              ? "Submit"
                              : "Queue"}
                            :
                            {" "}
                            {secondsToDelta(selectedNode.minutes_queue)}</strong>
                          {/* <small>min.</small> */}
                        </span>
                      )}
                    </div>
                    <div className='item-hl'>
                      {selectedNode.minutes >= 0 &&
                        ["RUNNING", "COMPLETED", "FAILED"].includes(
                          selectedNode.status
                        ) && (
                          <span
                            className='px-2 bg-success rounded text-center ml-1'
                            style={{ width: "100%" }}
                          >
                            <strong>Run:{" "}
                              {secondsToDelta(selectedNode.minutes)}{" "}</strong>
                            {/* <small>min.</small> */}
                          </span>
                        )}
                    </div>
                  </div>

                  <div className='row-hl d-flex flex-wrap py-1'>
                    <div className='item-hl'>
                      <span
                        className='px-1 mr-2 rounded text-center'
                        style={{
                          width: "100%",
                          backgroundColor: selectedNode.status_color,
                          color:
                            selectedNode.status === "RUNNING" ? "white" : "black",
                        }}
                      >
                        <strong>
                          Status: {selectedNode.status}
                        </strong>
                      </span>
                    </div>
                    <div className='item-hl'>
                      {selectedNode.children_list &&
                        selectedNode.children_list.length > 0 && (
                          <button
                            className='btn btn-sm btn-dark btn-block'
                            data-toggle='modal'
                            data-target='#childrenList-tree'
                            type='button'
                          >
                            <span
                              data-toggle='tooltip'
                              data-placement='bottom'
                              title="Shows the list of jobs that depend on this job.">
                              <strong>Out:</strong> {selectedNode.children}
                            </span>
                          </button>

                        )}
                      {selectedNode.children_list &&
                        selectedNode.children_list.length === 0 && (
                          <button
                            className='btn btn-sm btn-dark btn-block'
                            type='button'
                            disabled
                          >

                            <strong>Out:</strong> {selectedNode.children}

                          </button>
                        )}
                    </div>
                    <div className='item-hl ml-1'>
                      {selectedNode.parent_list !== null &&
                        selectedNode.parents > 0 && (
                          <button
                            className='btn btn-sm btn-dark'
                            data-toggle='modal'
                            data-target='#parentList-tree'
                            type='button'
                          >
                            <span
                              data-toggle='tooltip'
                              data-placement='bottom'
                              title="Shows the list of jobs on which this job depends.">
                              <strong>In:</strong> {selectedNode.parents}
                            </span>
                          </button>
                        )}
                      {selectedNode.parent_list !== null &&
                        selectedNode.parents === 0 && (
                          <button
                            className='btn btn-sm btn-dark'
                            type='button'
                            disabled
                          >
                            <strong>In:</strong> {selectedNode.parents}
                          </button>
                        )}
                    </div>
                  </div>

                  {selectedNode.out && (
                    <div className='row'>
                      <div className='col-12'>
                        <form
                          onSubmit={copyContent("g_out_t")}
                          className='form'
                        >
                          <div className='input-group input-group-sm'>
                            <input
                              className='form-control py-0'
                              type='text'
                              value={selectedNode.out}
                              id='g_out_t'
                              aria-describedby="addon-out1"
                              readOnly
                            />
                            <div className='input-group-append' id='addon-out1'>
                              <input
                                type='submit'
                                className='btn btn-light btn-sm py-0'
                                value='Copy out'
                                data-toggle='tooltip'
                                data-placement='left'
                                title="Copies the path to your clipboard."
                              />
                              <JobLog source={selectedNode.out} tab="tree" />
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                  {selectedNode.err && (
                    <div className='row mt-1'>
                      <div className='col-12'>
                        <form
                          onSubmit={copyContent("g_err_t")}
                          className='form'
                        >
                          <div className='input-group input-group-sm'>
                            <input
                              className='form-control py-0'
                              type='text'
                              value={selectedNode.err}
                              id='g_err_t'
                              readOnly
                            />
                            <div className='input-group-append'>
                              <input
                                type='submit'
                                className='btn btn-light btn-sm py-0'
                                value='Copy err'
                                data-toggle='tooltip'
                                data-placement='left'
                                title="Copies the path to your clipboard."
                              />
                              <JobLog source={selectedNode.err} tab="tree" />
                            </div>

                          </div>
                        </form>
                      </div>
                    </div>
                  )}

                  <div className='row-hl d-flex flex-wrap pt-1'>
                    <div className='item-hl'>
                      <table>

                        {selectedNode.submit !== null && (
                          <tr>
                            <td className="black-font">
                              <span>Submit:</span>
                            </td>
                            <td>
                              <span className='bg-dark px-1 rounded'>
                                {selectedNode.submit}
                              </span>
                            </td>
                          </tr>
                        )}
                        {selectedNode.start !== null && (
                          <tr>
                            <td className="black-font">
                              <span>Start:</span>
                            </td>
                            <td>
                              <span className='bg-dark px-1 rounded'>
                                {selectedNode.start}
                              </span>
                            </td>
                          </tr>
                        )}
                        {selectedNode.finish !== null && (
                          <tr>
                            <td className="black-font">
                              <span>Finish:</span>
                            </td>
                            <td>
                              <span className='bg-dark px-1 rounded'>
                                {selectedNode.finish}
                              </span>
                            </td>
                          </tr>
                        )}

                      </table>
                    </div>
                    <div className="item-hl ml-1">
                      {SHOW_PERFORMANCE_TAB && selectedNode.SYPD !== undefined && selectedNode.SYPD !== null && selectedNode.SYPD > 0 && (
                        <span className="bg-secondary text-dark rounded px-2" data-toggle='tooltip' data-placement='bottom' title="Generalization of Simulated Years per Day.">SYPD: <strong>{selectedNode.SYPD}</strong></span>
                      )}
                      <br></br>
                      {SHOW_PERFORMANCE_TAB && selectedNode.ASYPD !== undefined && selectedNode.ASYPD !== null && selectedNode.ASYPD > 0 && (
                        <span className="bg-secondary text-dark rounded px-2" data-toggle='tooltip' data-placement='bottom' title="Generalization of Actual SYPD.">ASYPD: <strong>{selectedNode.ASYPD}</strong></span>
                      )}
                    </div>
                  </div>
                  {selectedNode.wrapper !== null &&
                    selectedNode.wrapper.length > 0 && (
                      <div>
                        <div className='row'>
                          <div className='col-12'>
                            <small>
                              <strong>Wrapper:</strong>
                            </small>
                          </div>
                        </div>
                        <div className='row'>
                          <div className='col-12'>
                            <small>{selectedNode.wrapper}</small>
                          </div>
                        </div>
                      </div>
                    )}
                  {/* {selectedNode.wrapper_code !== null &&
                  selectedNode.wrapper_code.length > 0 && (
                    <div>
                      <div className='row'>
                        <div className='col-6'>
                          <small>
                            <strong>Code:</strong>
                          </small>
                        </div>
                        <div className='col-6'>
                          <small>{selectedNode.wrapper_code}</small>
                        </div>
                      </div>
                    </div>
                  )} */}
                </div>
              </div>
            </div>
          </div>
        </Fragment>
      )}
      {!selectedNode && treedata && treedata.jobs && (
        <div className='col-12 px-0'>
          <div className='card text-white bg-primary rounded-0' style={experimentStyle}>
            <div className='card-header text-center py-0'>
              <span>Here goes the Job Id</span>
            </div>
            <div className='card-body'>
              <div className='text-center'>
                <span>Select a Node to see more information.</span>
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
            id='childrenList-tree'
            tabIndex='-1'
            role='dialog'
            aria-labelledby='childrenListTitle-tree'
            aria-hidden='true'
          >
            <div className='modal-dialog modal-dialog-list' role='document'>
              <div className='modal-content'>
                <div className='modal-header'>
                  <h5 className='modal-title' id='childrenListTitle-tree'>
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
            id='parentList-tree'
            tabIndex='-1'
            role='dialog'
            aria-labelledby='parentListTitle-tree'
            aria-hidden='true'
          >
            <div className='modal-dialog modal-dialog-list' role='document'>
              <div className='modal-content'>
                <div className='modal-header'>
                  <h5 className='modal-title' id='parentListTitle-tree'>
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
  height: 430,
};

const headerCard = {
  height: 30,
};

export default TreeJob;
