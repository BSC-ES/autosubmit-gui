import React, { Fragment, useContext } from 'react';
import Experiment from '../experiment/Experiment';
import GraphRepresentation from '../experiment/GraphRepresentation';
import ExperimentContext from '../context/experiment/experimentContext';
import Selection from '../experiment/Selection';
import OpenRun from '../experiment/OpenRun';
import Running from '../experiment/Running';

const ExperimentCentral = ({ match }) => {
    const expid = match.params.expid;
    const experimentContext = useContext(ExperimentContext);
    const {data, 
        updateSelection, 
        loadingGraph, 
        loadingRun, 
        cleanGraphData, 
        cleanRunData, 
        getExperimentRun, 
        startAutoUpdateRun, 
        rundata,
        experiment } = experimentContext;
    
    return (
    <Fragment>
        <Experiment expidToken={expid} />
        <GraphRepresentation data={data} updateSelection={updateSelection} loadingGraph={loadingGraph} cleanGraphData={cleanGraphData} />
        <Selection />
        <OpenRun/>
        {startAutoUpdateRun && <Running 
            rundata={rundata}
            loadingRun={loadingRun} 
            cleanRunData={cleanRunData} 
            getExperimentRun={getExperimentRun}
            experiment={experiment}  
        />} 
    </Fragment>
    );
};  

export default ExperimentCentral;