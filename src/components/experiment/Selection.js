import React, { useContext, Fragment } from 'react'
import ExperimentContext from '../context/experiment/experimentContext';

const Selection = () => {
    const experimentContext = useContext(ExperimentContext);
    const { selection, data } = experimentContext;
    // const { model, branch, hpc } = experiment;
    //var currentSelection = "Node: "
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
        //console.log("Data: " + selectedNode.id + " " + selectedNode.platform_name)
    }    
    return (
        <Fragment>
                {selectedNode &&
                <Fragment>
                     <div className='row'>
                         <div className='col-12'>
                            <div className="card text-white bg-info" style={experimentStyle}>
                                <div className='card-header text-center py-0'>
                                    <small><strong>{selectedNode.id}</strong></small>
                                </div>
                                <div className='card-body py-0'>
                                    <div className='text-left'>
                                    <small><strong>Date:</strong> {selectedNode.date}</small>
                                    </div>                        
                                    <div>
                                        <small><strong>Section:</strong> {selectedNode.section}</small>
                                    </div>                            
                                    <div>
                                        <small><strong>Platform:</strong> {selectedNode.platform_name}</small>
                                    </div>                                                                
                                    <div>
                                        <small><strong>Priority:</strong> {selectedNode.priority}</small>
                                    </div>
                                    <div>
                                        <small><strong>Processors:</strong> {selectedNode.processors}</small>
                                    </div>                                                                
                                    <div>
                                        <small><strong>Status:</strong></small> {selectedNode.status}
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
        </Fragment>
        
        

    )
}

const experimentStyle = {
    height: 200
  };

export default Selection;
