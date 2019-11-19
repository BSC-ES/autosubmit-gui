import React, { Fragment, useContext} from 'react';
import Experiment from '../experiment/Experiment';
// import GraphRepresentation from '../experiment/GraphRepresentation';
import GraphNativeRep from '../experiment/GraphNativeRep';
import TreeNativeRep from '../experiment/TreeNativeRep';
import ExperimentContext from '../context/experiment/experimentContext';
import StatsContext from '../context/statistics/statsContext';
import Selection from '../experiment/Selection';
import SelectionTreeNode from '../experiment/SelectionTreeNode';
// import OpenRun from '../experiment/OpenRun';
import Running from '../experiment/Running';
import JobMonitor from '../experiment/JobMonitor';
import Navigator from '../experiment/Navigator';
import StatsSearch from '../statistics/StatsSearch';
import JobSearcher from '../experiment/JobSearcher';
import JobFilter from '../experiment/JobFilter';

const ExperimentCentral = ({ match }) => {
    const expid = match.params.expid;
    const experimentContext = useContext(ExperimentContext);
    const statsContext = useContext(StatsContext);
    const {data, 
        treedata,
        updateSelection, 
        updateSelectionTree,
        loadingGraph, 
        loadingTree,
        loadingRun, 
        shouldUpdateGraph,
        cleanGraphData, 
        cleanTreeData,
        cleanRunData, 
        cleanNavData,
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
        setFancyTree,
        visNetwork,
        navigateGraph,
        navToLatest,
        experimentRunning } = experimentContext;
    const { clearStats } = statsContext;

    return (
    <Fragment>
        <Experiment expidToken={expid}/>     
        <div className="row mt-2">
            <div className="col-12">
                <ul className="nav nav-tabs" id="myTab" role="tablist">
                    <li className="nav-item">
                        <a className="nav-link active" id="graph-tab" data-toggle="tab" href="#graph" role="tab" aria-controls="graph" aria-selected="true">Graph</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" id="treeview-tab" data-toggle="tab" href="#treeview" role="tab" aria-controls="treeview" aria-selected="false">Tree View</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" id="log-tab" data-toggle="tab" href="#log" role="tab" aria-controls="log" aria-selected="false">Log</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" id="stats-tab" data-toggle="tab" href="#stats" role="tab" aria-controls="stats" aria-selected="false">Statistics</a>
                    </li>
                </ul>
                <div className="tab-content" id="myTabContent">
                    <div className="tab-pane fade show active" id="graph" role="tabpanel" aria-labelledby="graph-tab">
                        <div className='card'>
                            {experiment && data &&    
                                <div className="card-header p-1">
                                    <JobSearcher />                        
                                </div>
                            }
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
                                        cleanNavData={cleanNavData}
                                    />                     
                                </div>
                                <div className='col-3 pl-0'>
                                    {data && <Selection /> }
                                    {startAutoUpdatePkl &&
                                        <JobMonitor                                    
                                            experiment={experiment} 
                                            getExperimentPkl={getExperimentPkl} 
                                            cleanPklData={cleanPklData}
                                            pklchanges={pklchanges}
                                            experimentRunning={experimentRunning} />
                                    }               
                                </div>
                            </div> 
                            <div className="card-footer p-0">
                                {data && visNetwork && <Navigator />}
                            </div>                                        
                        </div> 
                    </div>
                    <div className="tab-pane fade" id="treeview" role="tabpanel" aria-labelledby="treeview-tab">
                        <div className="card">
                            {experiment && treedata &&    
                                <div className="card-header p-1">
                                    <JobFilter />                        
                                </div>
                            }
                            <div className="row">
                                <div className="col-9 pr-0">
                                    <TreeNativeRep 
                                        treedata={treedata}
                                        loadingTree={loadingTree}
                                        cleanTreeData={cleanTreeData}                                
                                        setFancyTree={setFancyTree}
                                        updateSelectionTree={updateSelectionTree}
                                    />
                                </div>
                                <div className='col-3 pl-0'>
                                    <SelectionTreeNode />
                                </div>
                            </div>                            
                        </div>
                    </div>
                    <div className="tab-pane fade" id="log" role="tabpanel" aria-labelledby="log-tab">
                        <div className="card">
                            {startAutoUpdateRun && <Running 
                            rundata={rundata}
                            loadingRun={loadingRun} 
                            cleanRunData={cleanRunData} 
                            getExperimentRun={getExperimentRun}
                            experiment={experiment}  
                            startAutoUpdateRun={startAutoUpdateRun}
                            setAutoUpdateRun={setAutoUpdateRun}
                            experimentRunning={experimentRunning}
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
                    <div className="tab-pane fade" id="stats" role="tabpanel" aria-labelledby="stats-tab">
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
            </div>
        </div>                           
        
        {/* <OpenRun/> */}
        
        
        
    </Fragment>
    );
};  

export default ExperimentCentral;