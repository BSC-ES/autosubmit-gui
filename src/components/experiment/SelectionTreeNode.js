import React, { useContext, Fragment } from 'react'
import ExperimentContext from '../context/experiment/experimentContext';

const SelectionTreeNode = () => {
    const experimentContext = useContext(ExperimentContext);
    const { selectedTreeNode, treedata, experiment} = experimentContext;

    var selectedNode = null;
    var currentNode = "";
    if(selectedTreeNode && selectedTreeNode.node && selectedTreeNode.node.refKey){
        currentNode = selectedTreeNode.node.refKey;
        if (treedata && treedata.jobs){
            selectedNode = treedata.jobs.find(job => job.id === currentNode);
            //console.log(selectedNode);
        } else {
            selectedNode = null;
        }
    } else {
        selectedNode = null;
    }

    const copyContent = (inputname) => e => {
        e.preventDefault();
        console.log("Sending " + inputname);
        window.copyToClip(inputname);
    }

    return (
        <Fragment>
                {selectedNode &&
                <Fragment>
                     {/* <div className='row'> */}
                         <div className='col-12 px-0'>
                            <div className="card text-white bg-info" style={experimentStyle}>
                                <div className='card-header text-center p-0' style={headerCard}>
                                    <div className='mh-100 px-0 mx-0'>
                                        <small><strong>{selectedNode.id}</strong></small>
                                    </div>                                    
                                </div>
                                <div className='card-body py-0'>
                                    <div className='text-left'>
                                        <small><strong>Initial Date:</strong> {selectedNode.date}</small>
                                    </div>
                                    <div className='text-left'>
                                        <small><strong>Real date:</strong> {selectedNode.date_plus}</small>
                                    </div>                                                            
                                    <div>
                                        <div className='row'>
                                            <div className='col-12'>
                                                <small><strong>Section:</strong> {selectedNode.section}</small>
                                            </div>                                            
                                        </div>                                        
                                    </div>  
                                    <div>
                                        <div className='row'>
                                            <div className='col-12'>
                                                <small><strong>Member:</strong> {selectedNode.member}</small>
                                            </div>                                            
                                        </div>                                        
                                    </div>  
                                    <div>
                                        <div className='row'>
                                            <div className='col-12'>
                                                <small><strong>Chunk:</strong> {selectedNode.chunk}</small>
                                            </div>                                            
                                        </div>                                        
                                    </div>                            
                                    <div>
                                        <div className='row'>
                                            <div className='col-12'>
                                                <small><strong>Platform:</strong> {selectedNode.platform_name && selectedNode.platform_name} {!selectedNode.platform_name && experiment.hpc}</small>
                                            </div>
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
                                            <div className='col-6'>
                                                {/* <small><strong>Priority:</strong> {selectedNode.priority}</small> */}
                                            </div>
                                            <div className='col-3 px-1'>
                                                {selectedNode.children_list && selectedNode.children_list.length > 0 &&
                                                    <button className="btn btn-dark btn-sm btn-block" data-toggle="modal" data-target="#childrenList-tree">
                                                        <small><strong>Out:</strong> {selectedNode.children}</small>
                                                    </button>
                                                }
                                                {selectedNode.children_list && selectedNode.children_list.length === 0 &&
                                                    <small><strong>Out:</strong> {selectedNode.children}</small>
                                                }                                                
                                            </div>
                                            <div className='col-3 px-1'>
                                                {selectedNode.parent_list && selectedNode.parent_list.length > 0 &&
                                                    <button className="btn btn-darkgit pul btn-sm btn-block" data-toggle="modal" data-target="#parentList-tree">
                                                        <small><strong>In:</strong> {selectedNode.parents}</small>
                                                    </button>
                                                }
                                                {selectedNode.parent_list && selectedNode.parent_list.length === 0 &&
                                                    <small><strong>In:</strong> {selectedNode.parents}</small>
                                                }   
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
                                    {selectedNode.custom_directives && selectedNode.custom_directives.length > 0 &&
                                        <div>
                                            <div className='row'>
                                                <div className="col-12">
                                                    <small><strong>Custom Directives:</strong></small>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className="col-12">
                                                    <small>{selectedNode.custom_directives}</small>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    {selectedNode.wrapper &&
                                        <div>
                                            <div className="row">
                                                <div className="col-12">
                                                    <small><strong>Wrapper:</strong></small>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-12">
                                                    <small>{selectedNode.wrapper}</small>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    {selectedNode.wrapper_code &&
                                        <div>
                                            <div className="row">
                                                <div className="col-6">
                                                    <small><strong>Code:</strong></small>
                                                </div>
                                                <div className="col-6">
                                                    <small>{selectedNode.wrapper_code}</small>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    <div>
                                        {selectedNode.out && 
                                            <div className="row">
                                                <div className="col-12 px-0">
                                                    <form onSubmit={copyContent("g_out_t")} className="form">                                            
                                                        <div className="input-group input-group-sm">  
                                                            <input
                                                                className="form-control py-0"
                                                                type='text'
                                                                value={selectedNode.out}
                                                                id = "g_out_t"
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
                                            <div className="row mt-1">
                                                <div className="col-12 px-0">
                                                    <form onSubmit={copyContent("g_err_t")} className="form">
                                                        <div className="input-group input-group-sm">  
                                                            <input
                                                                className="form-control py-0"
                                                                type='text'
                                                                value={selectedNode.err}
                                                                id = "g_err_t"  
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
                                    
                                    {/* <div>
                                        <div className='row'>
                                            <div className='col-md-4 text-left'>
                                                <small>{data.max_children}/{data.max_parents} </small>
                                            </div>
                                         
                                            <div className='col-md-4 offset-md-4 text-right'>
                                                <small>{data.total_jobs}</small>
                                            </div>
                                        </div>
                                    </div> */}
                                    {/* <div>
                                        <div className="row">
                                            <form onSubmit={navigateTo(10,10)} className='form'>
                                                <input
                                                type='submit'
                                                value='Go to 10,10'
                                                className='btn btn-danger btn-block btn-sm'                              
                                                />
                                            </form>
                                        </div>
                                    </div> */}
                                </div>                            
                            </div>
                         </div>
                    {/* </div>                     */}
                </Fragment>                    
                }  
                {!selectedNode && treedata && treedata.jobs &&
                    <div className='col-12 px-0'>
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
                }    
                {selectedNode && selectedNode.children_list && selectedNode.children_list.length > 0 &&
                    <div className="modal fade" id="childrenList-tree" tabIndex="-1" role='dialog' aria-labelledby='childrenListTitle-tree' aria-hidden='true'>
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="childrenListTitle-tree">
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
                    <div className="modal fade" id="parentList-tree" tabIndex="-1" role='dialog' aria-labelledby='parentListTitle-tree' aria-hidden='true'>
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="parentListTitle-tree">
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
    height: 800
  };

const headerCard = {
    height: 30
}

export default SelectionTreeNode
