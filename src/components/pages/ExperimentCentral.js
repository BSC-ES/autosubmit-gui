import React, { Fragment, useContext, useEffect } from "react";
//import Experiment from "../experiment/Experiment";
import ExperimentColumn from "../experiment/ExperimentColumn";
// import GraphRepresentation from '../experiment/GraphRepresentation';
import GraphNativeRep from "../experiment/GraphNativeRep";
import JobSelection from "../experiment/JobSelection";
import TreeNativeRep from "../experiment/TreeNativeRep";
import ExperimentContext from "../context/experiment/experimentContext";
import StatsContext from "../context/statistics/statsContext";
import GraphContext from "../context/graph/graphContext";
import TreeContext from "../context/tree/treeContext";
import Selection from "../experiment/Selection";
import SelectionTreeNode from "../experiment/SelectionTreeNode";
// import OpenRun from '../experiment/OpenRun';
import Running from "../experiment/Running";
import JobMonitor from "../experiment/JobMonitor";
import JobMonitorTree from "../experiment/JobMonitorTree";
import Navigator from "../experiment/Navigator";
import StatsSearch from "../statistics/StatsSearch";
import JobSearcher from "../experiment/JobSearcher";
import JobFilter from "../experiment/JobFilter";
import WrapperList from "../experiment/WrapperList";
import GraphControl from "../experiment/GraphControl";
import LogControl from "../experiment/LogControl";
import TreeControl from "../experiment/TreeControl";
import PerformanceControl from "../experiment/PerformanceControl";
import Performance from "../experiment/Performance";

const ExperimentCentral = ({ match }) => {
  const expid = match.params.expid;
  const resolve_action = match.params.action;
  const focus_graph =
    resolve_action && resolve_action === "graph" ? true : false;
  //console.log("Focus: " + focus_graph);
  const classTree = focus_graph === true ? "nav-link" : "nav-link active";
  const classGraph = focus_graph === true ? "nav-link active" : "nav-link";
  const classTabTree =
    focus_graph === true ? "tab-pane fade" : "tab-pane fade show active";
  const classTabGraph =
    focus_graph === true ? "tab-pane fade show active" : "tab-pane fade";
  //const isGraph = this.props.isGraph;
  const experimentContext = useContext(ExperimentContext);
  const graphContext = useContext(GraphContext);
  const treeContext = useContext(TreeContext);
  const statsContext = useContext(StatsContext);
  const {
    loadingRun,
    cleanRunData,
    getExperiment,
    getRunningState,
    getExperimentRun,
    getExperimentPerformanceMetrics,
    startAutoUpdateRun,
    setAutoUpdateRun,
    rundata,
    experiment,
    canSelect,
    experimentRunning,
    updateCurrentSelectedGraph,
    updateCurrentSelectedTree,
  } = experimentContext;

  const {
    treedata,
    updateSelectionTree,
    loadingTree,
    getExperimentTreePkl,
    getExperimentTree,
    cleanPklTreeData,
    startAutoUpdateTreePkl,
    pkltreechanges,
    setFancyTree,
    cleanTreeData,
  } = treeContext;

  const {
    cleanPklData,
    cleanNavData,
    getExperimentGraph,
    setVisData,
    getExperimentPkl,
    updateSelection,
    setVisNetwork,
    data,
    visNetwork,
    navToLatest,
    navigateAfterLoadGraph,
    pklchanges,
    loadingGraph,
    shouldUpdateGraph,
    startAutoUpdatePkl,
    cleanGraphData,
    current_grouped,
    updateGraphSelectedNodes,
  } = graphContext;
  const { clearStats } = statsContext;

  useEffect(() => {
    getExperiment(expid);
    getRunningState(expid);
    if (expid && expid.length > 0) {
      if (resolve_action && resolve_action === "graph") {
        getExperimentGraph(expid);
      } else {
        getExperimentTree(expid);
      }

      getExperimentPerformanceMetrics(expid);
    }
    // getExperimentTree(expid);
    const interval = setInterval(() => getRunningState(expid), 300000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, []);

  return (
    <Fragment>
      <div className='row'>
        {/* <div className='col-2 pr-1'>
          <ExperimentColumn expidToken={expid} />
        </div> */}
        <div className='col-12'>
          <ul className='nav nav-tabs' id='myTab' role='tablist'>
            <li className='nav-item'>
              <a
                className={classTree}
                id='treeview-tab'
                data-toggle='tab'
                href='#treeview'
                role='tab'
                aria-controls='treeview'
                aria-selected='false'
              >
                Tree View
              </a>
            </li>
            <li className='nav-item'>
              <a
                className={classGraph}
                id='graph-tab'
                data-toggle='tab'
                href='#graph'
                role='tab'
                aria-controls='graph'
                aria-selected='true'
              >
                Graph
              </a>
            </li>
            <li className='nav-item'>
              <a
                className='nav-link'
                id='log-tab'
                data-toggle='tab'
                href='#log'
                role='tab'
                aria-controls='log'
                aria-selected='false'
              >
                Log
              </a>
            </li>
            <li className='nav-item'>
              <a
                className='nav-link'
                id='stats-tab'
                data-toggle='tab'
                href='#stats'
                role='tab'
                aria-controls='stats'
                aria-selected='false'
              >
                Statistics
              </a>
            </li>
            <li className='nav-item'>
              <a
                className='nav-link'
                id='performance-tab'
                data-toggle='tab'
                href='#performance'
                role='tab'
                aria-controls='performance'
                aria-selected='false'
              >
                Performance
              </a>
            </li>
          </ul>
          <div className='tab-content' id='myTabContent'>
            <div
              className={classTabGraph}
              id='graph'
              role='tabpanel'
              aria-labelledby='graph-tab'
            >
              <div className='card'>
                {experiment && <GraphControl />}
                {experiment && data && (
                  <div className='card-header p-1'>
                    <JobSearcher />
                  </div>
                )}
                <div className='row'>
                  <div className='col pr-0'>
                    <GraphNativeRep
                      data={data}
                      updateSelection={updateSelection}
                      loadingGraph={loadingGraph}
                      cleanGraphData={cleanGraphData}
                      shouldUpdateGraph={shouldUpdateGraph}
                      setVisData={setVisData}
                      setVisNetwork={setVisNetwork}
                      navToLatest={navToLatest}
                      clearStats={clearStats}
                      cleanNavData={cleanNavData}
                      current_grouped={current_grouped}
                      experimentRunning={experimentRunning}
                      navigateAfterLoadGraph={navigateAfterLoadGraph}
                      updateCurrentSelected={updateCurrentSelectedGraph}
                      canSelect={canSelect}
                      updateGraphSelectedNodes={updateGraphSelectedNodes}
                    />
                  </div>
                  <div
                    className={canSelect === true ? "col-3 px-0" : "col-3 pl-0"}
                  >
                    <ul className='nav nav-tabs' id='myTabSide' role='tablist'>
                      <li className='nav-item'>
                        <a
                          className='nav-link active'
                          id='selection-tab'
                          data-toggle='tab'
                          href='#selection'
                          role='tab'
                          aria-controls='selection'
                          aria-selected='true'
                        >
                          Selection
                        </a>
                      </li>
                      <li className='nav-item'>
                        <a
                          className='nav-link'
                          id='wrapper-tab'
                          data-toggle='tab'
                          href='#wrapper'
                          role='tab'
                          aria-controls='treeview'
                          aria-selected='false'
                        >
                          Wrappers
                        </a>
                      </li>
                    </ul>
                    <div className='tab-content' id='myTabSideContent'>
                      <div
                        className='tab-pane fade show active'
                        id='selection'
                        role='tabpanel'
                        aria-labelledby='selection-tab'
                      >
                        {data && <Selection />}
                        {startAutoUpdatePkl && (
                          <JobMonitor
                            experiment={experiment}
                            getExperimentPkl={getExperimentPkl}
                            cleanPklData={cleanPklData}
                            pklchanges={pklchanges}
                            experimentRunning={experimentRunning}
                          />
                        )}
                      </div>
                      <div
                        className='tab-pane fade show'
                        id='wrapper'
                        role='tabpanel'
                        aria-labelledby='wrapper-tab'
                      >
                        <div>
                          <WrapperList />
                        </div>
                      </div>
                    </div>
                  </div>
                  {experiment && data && canSelect && (
                    <div className='col-2 pl-0'>
                      <JobSelection target={"graph"} source={"experiment"} />
                    </div>
                  )}
                </div>
                <div className='card-footer p-0'>
                  {data && visNetwork && <Navigator />}
                </div>
              </div>
            </div>
            <div
              className={classTabTree}
              id='treeview'
              role='tabpanel'
              aria-labelledby='treeview-tab'
            >
              <div className='card'>
                {experiment && <TreeControl />}
                {experiment && treedata && (
                  <div className='card-header p-1'>
                    <JobFilter />
                  </div>
                )}
                <div className='row'>
                  <div className='col pr-0'>
                    <TreeNativeRep
                      treedata={treedata}
                      loadingTree={loadingTree}
                      cleanTreeData={cleanTreeData}
                      setFancyTree={setFancyTree}
                      updateSelectionTree={updateSelectionTree}
                      updateCurrentSelected={updateCurrentSelectedTree}
                      canSelect={canSelect}
                      // getExperimentTree={getExperimentTree}
                      // expid={expid}
                    />
                  </div>
                  <div
                    className={canSelect === true ? "col-3 px-0" : "col-3 pl-0"}
                  >
                    <SelectionTreeNode />
                    {startAutoUpdateTreePkl && (
                      <JobMonitorTree
                        experiment={experiment}
                        getExperimentTreePkl={getExperimentTreePkl}
                        cleanPklTreeData={cleanPklTreeData}
                        pkltreechanges={pkltreechanges}
                        experimentRunning={experimentRunning}
                      />
                    )}
                  </div>
                  {experiment && treedata && canSelect && (
                    <div className='col-2 pl-0'>
                      <JobSelection target={"tree"} source={"experiment"} />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div
              className='tab-pane fade'
              id='log'
              role='tabpanel'
              aria-labelledby='log-tab'
            >
              <div className='card'>
                {experiment && <LogControl />}
                <div className='card-body p-0' style={experimentMinStyle}>
                  <div className='col-12 p-0'>
                    {startAutoUpdateRun && (
                      <Running
                        rundata={rundata}
                        loadingRun={loadingRun}
                        cleanRunData={cleanRunData}
                        getExperimentRun={getExperimentRun}
                        experiment={experiment}
                        startAutoUpdateRun={startAutoUpdateRun}
                        setAutoUpdateRun={setAutoUpdateRun}
                        experimentRunning={experimentRunning}
                      />
                    )}
                    {!startAutoUpdateRun && (
                      <div className='row'>
                        <div className='col-12 text-center'>
                          <p className='lead'>
                            Press{" "}
                            <span className='badge badge-dark'>Show Log</span>{" "}
                            to see the last 50 lines of the running log of this
                            experiment. If the experiment is running, the log
                            will update automatically.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div
              className='tab-pane fade'
              id='stats'
              role='tabpanel'
              aria-labelledby='stats-tab'
            >
              <div className='card mt-2' style={experimentMinStyle}>
                <div className='card-header py-0 text-muted'>
                  <small>Statistics</small>
                </div>
                <div className='card-body p-1'>
                  <div className='col-12'>
                    <StatsSearch />
                  </div>
                </div>
              </div>
            </div>
            <div
              className='tab-pane fade'
              id='performance'
              role='tabpanel'
              aria-labelledby='performance-tab'
            >
              <div className='card mt-2'>
                {experiment && <PerformanceControl />}
                <div className='card-body p-1'>
                  {experiment && <Performance />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className='row'>
        <div className='col-12'>
          <JobSelection />
        </div>
      </div> */}
      {/* <div className='row' style={experimentBuffer}></div> */}
      <ExperimentColumn expidToken={expid} />
    </Fragment>
  );
};

// const experimentStyle = {
//   height: 600,
// };

const experimentMinStyle = {
  minHeight: "100%",
};

export default ExperimentCentral;
