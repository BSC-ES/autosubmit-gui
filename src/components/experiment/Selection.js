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
              <div className='card text-white bg-primary rounded-0' style={experimentStyle}>
                <div className='card-header text-center p-0' style={headerCard}>
                  <div className='mh-100 px-0 mx-0'>
                    
                      <strong>{selectedNode.id}</strong>{" "}
                      
                      <JobHistory source='graph' />
                    
                  </div>
                </div>
                <div className='card-body py-0'>
                  <div className='row'>
                    <div className='col-md-6'>
                      
                        <strong>Start:</strong> {selectedNode.date}
                      
                    </div>
                    <div className='col-md-6'>
                      
                        <strong>End:</strong> {selectedNode.date_plus}
                      
                    </div>
                  </div>
                  <div>
                    <div className='row'>
                      <div className='col-12'>
                        
                          <strong>Section:</strong> {selectedNode.section}
                       
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className='row'>
                      <div className='col-md-6'>
                       
                          <strong>Member:</strong> {selectedNode.member}
                        
                      </div>
                      <div className='col-md-6'>
                        
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
                      <div className='col-6'>
                        
                          <strong>Processors:</strong> {selectedNode.processors}
                        
                      </div>
                      <div className='col-6'>
                        
                          <strong>Wallclock:</strong> {selectedNode.wallclock}
                        
                      </div>
                    </div>
                  </div>
                  <div className='row-hl d-flex flex-wrap py-1'>
                    <div className='item-hl'>
                      {" "}
                      {selectedNode.minutes_queue >= 0 && ["SUBMITTED", "QUEUING", "RUNNING", "COMPLETED", "FAILED"].includes(
                          selectedNode.status
                        ) &&  (
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
                          <span>
                            {selectedNode.status === "SUBMITTED"
                              ? "Submit"
                              : "Queue"}
                            :
                          </span>{" "}
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
                            className='rounded px-2 bg-success text-center ml-1'
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
                            selectedNode.status === "RUNNING"
                              ? "white"
                              : "black",
                        }}
                      >
                        <strong> 
                        Status: {selectedNode.status}</strong>
                      </span>
                    </div>
                    <div className='item-hl'>
                      {selectedNode.children_list &&
                        selectedNode.children_list.length > 0 && (
                          <button
                            className='btn btn-dark btn-sm btn-block'
                            data-toggle='modal'
                            data-target='#childrenList'
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
                      {selectedNode.parent_list &&
                        selectedNode.parent_list.length > 0 && (
                        <button
                          className='btn btn-sm btn-dark btn-block'
                          data-toggle='modal'
                          data-target='#parentList'
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
                      {selectedNode.parent_list &&
                        selectedNode.parent_list.length === 0 && (
                          <button
                            className='btn btn-sm btn-dark btn-block'
                            type='button'
                            disabled
                          >
                              <strong>In:</strong> {selectedNode.parents}
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
                                  className='btn btn-sm btn-light py-0'
                                  value='Copy out'
                                  data-toggle='tooltip' 
                                  data-placement='left' 
                                  title="Copies the path to your clipboard."
                                />
                                <JobLog source={selectedNode.out} tab="graph"/>  
                              </div>
                              
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
                                  data-toggle='tooltip' 
                                  data-placement='left' 
                                  title="Copies the path to your clipboard."
                                />
                                <JobLog source={selectedNode.err} tab="graph"/>
                              </div>
                              
                            </div>
                          </form>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className='row-hl d-flex flex-wrap pt-1'>
                    <div className='item-hl'>
                      <table>
                        <tbody>
                          {selectedNode.submit !== null && (
                            <tr>
                              <td>
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
                              <td>
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
                              <td>
                                <span>Finish:</span>
                              </td>
                              <td>
                                <span className='bg-dark px-1 rounded'>
                                  {selectedNode.finish}
                                </span>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                    <div className="item-hl ml-1">
                    {selectedNode.SYPD !== undefined && selectedNode.SYPD !== null && selectedNode.SYPD > 0 && (                      
                        <span className="bg-secondary rounded text-dark px-2" data-toggle='tooltip' data-placement='bottom' title="Generalization of Simulated Years per Day.">SYPD: <strong>{selectedNode.SYPD}</strong></span>                     
                    )}
                    <br></br>
                    {selectedNode.ASYPD !== undefined && selectedNode.ASYPD !== null && selectedNode.ASYPD > 0 && (
                      <span className="bg-secondary rounded text-dark px-2" data-toggle='tooltip' data-placement='bottom' title="Generalization of Actual SYPD.">ASYPD: <strong>{selectedNode.ASYPD}</strong></span>                        
                    )}
                    </div>
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
            <div className='card text-white bg-primary' style={experimentStyle}>
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
