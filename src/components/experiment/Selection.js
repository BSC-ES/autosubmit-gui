import React, { useContext, Fragment } from 'react'
import ExperimentContext from '../context/experiment/experimentContext';

const Selection = () => {
    const experimentContext = useContext(ExperimentContext);
    const { selection, experiment, data } = experimentContext;
    const { model, branch, hpc } = experiment;
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
            <div className='card grid-1'>
                {selectedNode &&
                    <div>
                        <div>
                            <small>Job:</small> <b>{selectedNode.id}</b>
                        </div>
                        <div className="grid-3">
                            <div><strong>Section:</strong> {selectedNode.section}</div>
                            <div><strong>Status:</strong> {selectedNode.status}</div>
                            <div><strong>Platform:</strong> {selectedNode.platform_name}</div>
                        </div>
                        <div className="grid-3">
                            <div><strong>Date:</strong> {selectedNode.date}</div>
                            <div><strong>Priority:</strong> {selectedNode.priority}</div>
                            <div><strong>Processors:</strong> {selectedNode.processors}</div>
                        </div>
                    </div>
                }  
                {!selectedNode && data &&
                    <div>
                        Select a Node to see more information.
                    </div>
                }              
            </div>
            <div>
            <div className="card grid-3">
                <div>
                    <strong>Model:</strong> {model}
                </div>
                <div>
                    <strong>Branch:</strong> {branch}
                </div>
                <div>
                    <strong>Hpc:</strong> {hpc}
                </div>          
            </div>
        </div>
        </Fragment>
        

    )
}

export default Selection;
