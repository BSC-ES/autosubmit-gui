import React, { Fragment, useContext } from 'react';
import Experiment from '../experiment/Experiment';
import GraphRepresentation from '../experiment/GraphRepresentation';
import ExperimentContext from '../context/experiment/experimentContext';
import Selection from '../experiment/Selection';

const ExperimentCentral = ({ match }) => {
    const expid = match.params.expid;
    const experimentContext = useContext(ExperimentContext);
    const { data, updateSelection, loadingGraph, cleanGraphData } = experimentContext;
    
    return (
    <Fragment>
        <Experiment expidToken={expid} />
        <GraphRepresentation data={data} updateSelection={updateSelection} loadingGraph={loadingGraph} cleanGraphData={cleanGraphData} />
        <Selection />
    </Fragment>
    );
};  

export default ExperimentCentral;