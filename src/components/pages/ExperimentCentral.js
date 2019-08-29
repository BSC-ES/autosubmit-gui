import React, { Fragment, useContext } from 'react';
import Experiment from '../experiment/Experiment';
// import GraphRepresentation from '../experiment/GraphRepresentation';
import GraphNativeRep from '../experiment/GraphNativeRep';
import ExperimentContext from '../context/experiment/experimentContext';
import StatsContext from '../context/statistics/statsContext';
import Selection from '../experiment/Selection';
// import OpenRun from '../experiment/OpenRun';
import Running from '../experiment/Running';
import JobMonitor from '../experiment/JobMonitor';
import Navigator from '../experiment/Navigator';
import StatsSearch from '../statistics/StatsSearch';

const ExperimentCentral = ({ match }) => {
    const expid = match.params.expid;
    const experimentContext = useContext(ExperimentContext);
    const statsContext = useContext(StatsContext);
    const {data, 
        updateSelection, 
        loadingGraph, 
        loadingRun, 
        shouldUpdateGraph,
        cleanGraphData, 
        cleanRunData, 
        getExperimentRun,
        getExperimentPkl, 
        cleanPklData,
        startAutoUpdateRun, 
        startAutoUpdatePkl,
        setAutoUpdateRun,
        rundata,
        pklchanges,
        experiment,
        setVisData,
        setVisNetwork,
        visNetwork,
        navigateGraph,
        navToLatest } = experimentContext;
    
    const { clearStats } = statsContext;

    return (
    <Fragment>
        <Experiment expidToken={expid} />     
        <div className="row mt-2">
            <div className="col-12">
                <div className='card'>
                    <div className='row'>
                        <div className='col-9 pr-0'>
                            <GraphNativeRep 
                                data={data} 
                                updateSelection={updateSelection} 
                                loadingGraph={loadingGraph} 
                                cleanGraphData={cleanGraphData} 
                                shouldUpdateGraph={shouldUpdateGraph} 
                                setVisData={setVisData}
                                setVisNetwork={setVisNetwork}
                                navigateGraph={navigateGraph}
                                navToLatest={navToLatest}
                                clearStats={clearStats}
                            />
                            {/* <GraphRepresentation 
                                data={data} 
                                updateSelection={updateSelection} 
                                loadingGraph={loadingGraph} 
                                cleanGraphData={cleanGraphData} 
                                shouldUpdateGraph={shouldUpdateGraph} 
                            /> */}
                        </div>
                        <div className='col-3 pl-0'>
                            {data && <Selection /> }
                            {startAutoUpdatePkl &&
                                <JobMonitor 
                                    experiment={experiment} 
                                    getExperimentPkl={getExperimentPkl} 
                                    cleanPklData={cleanPklData}
                                    pklchanges={pklchanges} />
                            }               
                        </div>
                    </div> 
                    <div className="card-footer p-0">
                        {data && visNetwork && <Navigator />}
                    </div>
                    <div className="card-footer p-0">


                        {startAutoUpdateRun && <Running 
                            rundata={rundata}
                            loadingRun={loadingRun} 
                            cleanRunData={cleanRunData} 
                            getExperimentRun={getExperimentRun}
                            experiment={experiment}  
                            startAutoUpdateRun={startAutoUpdateRun}
                            setAutoUpdateRun={setAutoUpdateRun}
                        />} 

                        {!startAutoUpdateRun &&
                            <div className="row">
                                <div className="col-12 text-center">
                                    <p className="lead">
                                        Press <span className='badge badge-dark'>Show Log</span> to see the last 50 lines of the running log of this experiment. 
                                        If the experiment is running, the log will update automatically.
                                    </p>                                            
                                </div>                                            
                            </div>
                        }
                          

                    </div>              
                </div> 
                <div className="card mt-2">
                    <div className="card-header py-0 text-muted">
                        <small>Statistics</small>
                    </div>
                    <div className="card-body p-1">
                        <div className='col-12'>
                            <StatsSearch />    
                        </div>
                    </div>                                             
                </div>
            </div>
        </div>                           
        
        {/* <OpenRun/> */}
        
        
        
    </Fragment>
    );
};  

export default ExperimentCentral;