import React, { useContext } from 'react'
import ExperimentContext from '../context/experiment/experimentContext';

const Selection = () => {
    const experimentContext = useContext(ExperimentContext);
    var currentSelection = "Selected nodes: "
    if (experimentContext.selection) {
        experimentContext.selection.map(node => (
            currentSelection += node + ", "
        ));
    }    
    return (
        <div className='card grid-1'>
            {experimentContext.selection && currentSelection}
        </div>
    )
}

export default Selection;
