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
    if (selection) {
        //console.log("Current selection " + selection)
        selection.map(node => (
            // currentSelection += node + ", "
            currentNode = node
        ));
        //console.log("Current node " + currentNode)
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
                                    <div className='text-left'>
                                        <small><strong>Date:</strong> {selectedNode.date}</small>
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
                                                <small><strong>Level:</strong> {selectedNode.level}</small>
                                            </div>
                                            <div className='col-6'>
                                                <small><strong>Out:</strong> {selectedNode.children} <strong>In:</strong> {selectedNode.parents} </small>                                                
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
                                    <div>
                                        <div className='row'>
                                            <div className='col-4'>
                                                <small>o:{data.max_children}/i:{data.max_parents} </small>
                                            </div>
                                            {/* <div className='col-4'>
                                                <small>o:{data.avg_children}/i:{data.avg_parents} </small>
                                            </div> */}
                                            <div className='col-4'>
                                                <small>{data.total_jobs}</small>
                                            </div>
                                        </div>
                                    </div>
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
        </Fragment>
        
        

    )
}

const experimentStyle = {
    height: 200
  };

const headerCard = {
    height: 30
}

export default Selection;
