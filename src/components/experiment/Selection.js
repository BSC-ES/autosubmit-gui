import React, { useContext, Fragment } from 'react'
import ExperimentContext from '../context/experiment/experimentContext';

const Selection = () => {
    const experimentContext = useContext(ExperimentContext);
    const { selection, data, experiment} = experimentContext;
    // const { model, branch, hpc } = experiment;
    //var currentSelection = "Node: "

    // const navigateTo = e => {
    //     e.preventDefault();
    //     navToLatestCompleted();
    // };

    var currentNode = ""
    var selectedNode = null

    const copyContent = (inputname) => e => {
        e.preventDefault();
        console.log("Sending " + inputname);
        window.copyToClip(inputname);
    }

    
    if (selection) {
        console.log("Current selection " + selection)
        selection.map(node => (

            currentNode = node
        ));
  
        selectedNode = data.nodes.find(node => node.id === currentNode)    
        //console.log("Selected node")
        //console.log("Data: " + selectedNode.id + " " + selectedNode.platform_name)
    }    
    return (
        <Fragment>
                {selectedNode &&
                <Fragment>
                    <div className='row'>
                         <div className='col-12'>
                            <div className="card text-white bg-info" style={experimentStyle}>
                                <div className='card-header text-center p-0' style={headerCard}>
                                    <div className='mh-100 px-0 mx-0'>
                                        <small><strong>{selectedNode.id}</strong></small>
                                    </div>                                    
                                </div>
                                <div className='card-body py-0'>
                                    <div className="row">
                                        <div className='col-6 text-left'>
                                            <small><strong>Date:</strong> {selectedNode.date}</small>
                                        </div>            
                                        <div className='col-3 px-1 pt-1'>
                                            {selectedNode.children_list && selectedNode.children_list.length > 0 &&
                                                <button className="btn btn-dark btn-sm btn-block" data-toggle="modal" data-target="#childrenList">
                                                    <small><strong>Out:</strong> {selectedNode.children}</small>
                                                </button>
                                            }
                                            {selectedNode.children_list && selectedNode.children_list.length === 0 &&
                                                <small><strong>Out:</strong> {selectedNode.children}</small>
                                            }  
                                        </div> 
                                        <div className='col-3 px-1 pt-1'>
                                            {selectedNode.parent_list && selectedNode.parent_list.length > 0 &&
                                                <button className="btn btn-darkgit pul btn-sm btn-block" data-toggle="modal" data-target="#parentList">
                                                    <small><strong>In:</strong> {selectedNode.parents}</small>
                                                </button>
                                            }
                                            {selectedNode.parent_list && selectedNode.parent_list.length === 0 &&
                                                <small><strong>In:</strong> {selectedNode.parents}</small>
                                            }   
                                        </div>                    
                                    </div>
                                    <div className="text-left">
                                        <small><strong>Real date:</strong> {selectedNode.date_plus}</small>
                                    </div>   
                                    <div>
                                        <div className='row'>
                                            <div className='col-12'>
                                                <small><strong>Section:</strong> {selectedNode.section}</small>
                                            </div>                                            
                                            {/* <div className='col-4'>
                                                <small>{selectedNode.member}</small>
                                            </div>                  */}
                                        </div>                                        
                                    </div>  
                                    <div>
                                        <div className='row'>
                                            <div className='col-12'>
                                                <small><strong>Member:</strong> {selectedNode.member}</small>
                                            </div>                                            
                                            {/* <div className='col-4'>
                                                <small>{selectedNode.member}</small>
                                            </div>                  */}
                                        </div>                                        
                                    </div>    
                                    <div>
                                        <div className='row'>
                                            <div className='col-12'>
                                                <small><strong>Chunk:</strong> {selectedNode.chunk}</small>
                                            </div>                                            
                                            {/* <div className='col-4'>
                                                <small>{selectedNode.member}</small>
                                            </div>                  */}
                                        </div>                                        
                                    </div>                        
                                    <div>
                                        <div className='row'>
                                            <div className='col-12'>
                                                <small><strong>Platform:</strong> {selectedNode.platform_name && selectedNode.platform_name} {!selectedNode.platform_name && experiment.hpc}</small>
                                            </div>
                                            {/* <div className="col-4">
                                                <small><strong>Chunk:</strong> {selectedNode.chunk}</small>
                                            </div> */}
                                        </div>                                         
                                    </div>                                                                
                                    {/* <div>
                                        <small><strong>Priority:</strong> {selectedNode.priority}</small>
                                    </div> */}
                                    <div>
                                        <div className='row'>
                                            <div className='col-6'>
                                                <small><strong>Processors:</strong> {selectedNode.processors}</small>
                                            </div>
                                            <div className='col-6'>
                                                <small><strong>Wallclock:</strong> {selectedNode.wallclock}</small>
                                            </div>
                                        </div>                                        
                                    </div>                                                               
                                    <div>
                                        <div className='row'>
                                            <div className='col-12'>
                                                <small><strong>Status:</strong></small> {selectedNode.status}
                                            </div>
                                            {/* <div className='col-4 text-right'>
                                                <small><strong>c:{data.max_children}/p:{data.max_parents}</strong></small>
                                            </div> */}
                                        </div>                                               
                                    </div>
                                    <br></br>
                                    <div>
                                        {selectedNode.out && 
                                            <div className="row">
                                                <div className="col-12 px-0">
                                                    <form onSubmit={copyContent("g_out")} className="form">                                            
                                                        <div className="input-group input-group-sm">  
                                                            <input
                                                                className="form-control py-0"
                                                                type='text'
                                                                value={selectedNode.out}
                                                                id = "g_out"
                                                                readOnly
                                                            />
                                                            <div className="input-group-append">
                                                                <input type='submit' className="btn btn-alert btn-sm py-0" value='Copy out'/>                                                    
                                                            </div>                                                
                                                        </div>
                                                    </form>
                                                </div>                                            
                                            </div>
                                        }
                                        {selectedNode.err &&
                                            <div className="row">
                                                <div className="col-12 px-0">
                                                    <form onSubmit={copyContent("g_err")} className="form">
                                                        <div className="input-group input-group-sm">  
                                                            <input
                                                                className="form-control py-0"
                                                                type='text'
                                                                value={selectedNode.err}
                                                                id = "g_err"  
                                                                readOnly                                                  
                                                            />
                                                            <div className="input-group-append">
                                                                <input type='submit' className="btn btn-alert btn-sm py-0" value='Copy err'/> 
                                                            </div>
                                                        </div>                                           
                                                    </form>
                                                </div>                                                                                        
                                            </div>
                                        }
                                        
                                    </div>
                                   
                                </div>                            
                            </div>
                         </div>
                    </div>                    
                </Fragment>                    
                }  
                {!selectedNode && data &&
                    <div className='row'>
                        <div className='col-12'>
                            <div className="card text-white bg-info" style={experimentStyle}>
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
                }    
                {selectedNode && selectedNode.children_list && selectedNode.children_list.length > 0 &&
                    <div className="modal fade" id="childrenList" tabIndex="-1" role='dialog' aria-labelledby='childrenListTitle' aria-hidden='true'>
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="childrenListTitle">
                                        Children List
                                    </h5>
                                    <button className="close" type="button" data-dismiss='modal' aria-label='Close'>
                                        <span aria-hidden='true'>&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <ul>
                                        {selectedNode.children_list.map((item,index) => 
                                            <li key={index}>
                                                {item}
                                            </li>
                                        )}
                                    </ul>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                }   
                {selectedNode && selectedNode.parent_list && selectedNode.parent_list.length > 0 &&
                    <div className="modal fade" id="parentList" tabIndex="-1" role='dialog' aria-labelledby='parentListTitle' aria-hidden='true'>
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="parentListTitle">
                                        Parent List
                                    </h5>
                                    <button className="close" type="button" data-dismiss='modal' aria-label='Close'>
                                        <span aria-hidden='true'>&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <ul>
                                        {selectedNode.parent_list.map((item,index) => 
                                            <li key={index}>
                                                {item}
                                            </li>
                                        )}
                                    </ul>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                }       
        </Fragment>            
    )
}

const experimentStyle = {
    height: 320
  };

const headerCard = {
    height: 30
}


export default Selection;
