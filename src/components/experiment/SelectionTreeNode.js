import React, { useContext, Fragment } from "react";
import ExperimentContext from "../context/experiment/experimentContext";
import TreeContext from "../context/tree/treeContext";
import JobHistory from "./JobHistory";
import JobLog from "./JobLog";
import { secondsToDelta } from "../context/utils";
import { DEBUG, statusCodeToStyle } from "../context/vars";

const SelectionTreeNode = () => {
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
      if (selectedNode && selectedNode.parent_list && selectedNode.parent_list.length > 0){
        parentList = treedata.jobs.filter((job) => selectedNode.parent_list.indexOf(job.id) >= 0);
        //console.log(selectedNode.parent_list);
        //console.log(parentList);
      }
      if (selectedNode && selectedNode.children_list && selectedNode.children_list.length > 0){
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

  console.log(selectedNode);
  return (
    <Fragment>
      {selectedNode && (
        <Fragment>
          {/* <div className='row'> */}
          <div className='col-12 px-0'>
            <div className='card text-white bg-info' style={experimentStyle}>
              <div className='card-header text-center p-0' style={headerCard}>
                <div className='mh-100 px-0 mx-0'>
                  <small>
                    <strong>{selectedNode.id}</strong>{" "}
                  </small>
                  <JobHistory source='tree' />
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
                          selectedNode.status === "RUNNING" ? "white" : "black",
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
                          className='btn-sm btn-dark btn-block'
                          data-toggle='modal'
                          data-target='#childrenList-tree'
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
                    {selectedNode.parent_list !== null &&
                      selectedNode.parents > 0 && (
                        <button
                          className='btn-sm btn-dark btn-block'
                          data-toggle='modal'
                          data-target='#parentList-tree'
                          type='button'
                        >
                          <small>
                            <strong>In:</strong> {selectedNode.parents}
                          </small>
                        </button>
                      )}
                    {selectedNode.parent_list !== null &&
                      selectedNode.parents === 0 && (
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
                  {/* .out log viewer */}
                  {selectedNode.out && (
                    <div className='row'>
                      <div className='col-12 px-0'>
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
                              readOnly
                            />
                            <div className='input-group-append'>
                              <input
                                type='submit'
                                className='btn btn-light btn-sm py-0'
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
        </Fragment>
      )}
      {!selectedNode && treedata && treedata.jobs && (
        <div className='col-12 px-0'>
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

export default SelectionTreeNode;
