import React, { useContext, Fragment } from 'react'
import ExperimentContext from '../context/experiment/experimentContext';

const Selection = () => {
    const experimentContext = useContext(ExperimentContext);
    const { selection, experiment } = experimentContext;
    const { model, branch, hpc } = experiment;
    var currentSelection = "Selected nodes: "
    if (selection) {
        selection.map(node => (
            currentSelection += node + ", "
        ));
    }    
    return (
        <Fragment>
            <div className='card grid-1'>
                <small>{selection && currentSelection}</small>
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
