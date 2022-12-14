import React, { Fragment, useContext, useEffect, useState } from "react";
import { useLocation, useHistory, useRouteMatch } from 'react-router-dom'
import { withRouter } from "react-router";
//import Experiment from "../experiment/Experiment";
import ExperimentColumn from "../experiment/ExperimentColumn";
// import GraphRepresentation from '../experiment/GraphRepresentation';
import GraphNativeRep from "../experiment/GraphNativeRep";
import SelectedJobs from "../experiment/SelectedJobs";
import TreeNativeRep from "../experiment/TreeNativeRep";
import LighterNativeRep from "../experiment/LighterNativeRep";
import ExperimentContext from "../context/experiment/experimentContext";
import StatsContext from "../context/statistics/statsContext";
import GraphContext from "../context/graph/graphContext";
import TreeContext from "../context/tree/treeContext";
import LighterContext from "../context/lighter/lighterContext";
import GraphJob from "../experiment/GraphJob";
import FAQ from "../experiment/FAQ";
import TreeJob from "../experiment/TreeJob";
import Running from "../experiment/Running";
import JobMonitor from "../experiment/JobMonitor";
import JobMonitorTree from "../experiment/JobMonitorTree";
import Navigator from "../experiment/Navigator";
import StatsSearch from "../statistics/StatsSearch";
import StatsControl from "../statistics/StatsControl";
import JobSearcher from "../experiment/JobSearcher";
import JobFilter from "../experiment/JobFilter";
import WrapperList from "../experiment/WrapperList";
import GraphControl from "../experiment/GraphControl";
import LogControl from "../experiment/LogControl";
import TreeControl from "../experiment/TreeControl";
import LighterControl from "../experiment/LighterControl";
import PerformanceControl from "../experiment/PerformanceControl";
import Performance from "../experiment/Performance";
import ReadyJobs from "../experiment/ReadyJobs";
import ConfigurationControl from "../experiment/ConfigurationControl";
import CurrentConfiguration from "../experiment/CurrentConfiguration";
import { buildWarningInactiveMessageTree } from "../context/utils";
import { SHOW_PERFORMANCE_TAB } from "../context/vars";

let controller = new AbortController();

// Main render component. Calls other component and supplies props if necessary.
const ExperimentCentral = ({ match }) => {
  const location = useLocation()
  const history = useHistory()
  const { url } = useRouteMatch();

  // Focus Logic
  const expid = match.params.expid;
  // From custom URL
  let resolve_action = match.params.action;
  // Param
  if(location.params && location.params.tab) {
    resolve_action = location.params.tab
  }
  // Default param = Tree
  if (resolve_action === undefined) {
    resolve_action = "tree"
  }

  const [currentTab, setCurrentTab] = useState(resolve_action)

  const classTree = currentTab === "tree" ? "nav-link active" : "nav-link";
  const classTabTree = currentTab === "tree" ? "tab-pane fade show active" : "tab-pane fade";

  const classGraph = currentTab === "graph" ? "nav-link active" : "nav-link";
  const classTabGraph = currentTab === "graph" ? "tab-pane fade show active" : "tab-pane fade";

  const classLighter = currentTab === "light" ? "nav-link active" : "nav-link";
  const classTabLighter = currentTab === "light" ? "tab-pane fade show active" : "tab-pane fade";

  const classLog = currentTab === "log" ? "nav-link active" : "nav-link";
  const classTabLog = currentTab === "log" ? "tab-pane fade show active" : "tab-pane fade";

  const classConfig = currentTab === "cofiguration" ? "nav-link active" : "nav-link ";
  const classTabConfig = currentTab === "configuration" ? "tab-pane fade show active" : "tab-pane fade";

  const classStats = currentTab === "stats" ? "nav-link active" : "nav-link ";
  const classTabStats = currentTab === "stats" ? "tab-pane fade show active" : "tab-pane fade";

  const classPerformance = currentTab === "performance" ? "nav-link active" : "nav-link ";
  const classTabPerformance = currentTab === "performance" ? "tab-pane fade show active" : "tab-pane fade";

  const classFaq = currentTab === "faq" ? "nav-link active" : "nav-link ";
  const classTabFaq = currentTab === "faq" ? "tab-pane fade show active" : "tab-pane fade";
    
  const experimentContext = useContext(ExperimentContext);
  const graphContext = useContext(GraphContext);
  const treeContext = useContext(TreeContext);
  const statsContext = useContext(StatsContext);
  const lighterContext = useContext(LighterContext);
  const {
    loadingRun,
    cleanRunData,
    getExperiment,
    getRunningState,
    getExperimentRun,
    // getExperimentPerformanceMetrics,
    startAutoUpdateRun,
    setAutoUpdateRun,
    rundata,
    experiment,
    canSelect,
    experimentRunning,
    updateCurrentSelectedGraph,
    updateCurrentSelectedTree,
    cleanExperimentData,
    totalJobs,
    getLogStatus,
    logTimeDiff,
    currentLog,
    // testToken,
    // performancedata,
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
    notificationTitleTree,
    setNotificationTitleTree,
    treeReady,
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
    notificationTitleGraph,
    setNotificationTitleGraph,
    graphReady,
    displayJobInfoPanel,
  } = graphContext;

  const { clearStats } = statsContext;

  const {
    loadingView,
    setLighterFancyTree,
    currentData,
    isValid,
    errorMessage,
    cleanLoadingLighterView,
    getLighterView,
  } = lighterContext;

  useEffect(() => {
    controller.abort()
    controller = new AbortController();

    function fetchTree() {
      getLogStatus(expid, controller);
      getExperimentTree(
        expid,
        buildWarningInactiveMessageTree(
          experimentRunning,
          logTimeDiff,
          currentLog,
          treedata ? treedata.jobs : null
        ),
        controller,
        experimentContext.loggedUser
      )
    }

    function fetchGraph() {
      getLogStatus(expid, controller);
      const warningMessage = buildWarningInactiveMessageTree(
        experimentRunning,
        logTimeDiff,
        currentLog,
        data ? data.nodes : null
      );
      // By default we load the classic view
      getExperimentGraph(expid, "none", "standard", warningMessage, controller, experimentContext.loggedUser);
    }

    function fetchQuickView() {
      getLighterView(expid);
    }

    if (currentTab === "tree" && !treedata) {
      experimentContext.shutdown("graph", experimentContext.loggedUser, expid);
      fetchTree()
    }

    if (currentTab === "graph" && !data) {
      experimentContext.shutdown("tree", experimentContext.loggedUser, expid);
      setTimeout(() => {
        fetchGraph()
      }, 100);
    }

    if (currentTab === "quick" && !isValid) {
      // No need to shutdown because quickView is not time consuming
      fetchQuickView()
    }

    url.lastIndexOf("/");
    var newUrl = url.substring(0, url.lastIndexOf("/"));
    history.replace(newUrl + "/" + currentTab, {params: { tab: currentTab }})

  // eslint-disable-next-line
  }, [currentTab])

  // Window close
  useEffect(() => {
    const unloadCallback = (event) => {
      event.preventDefault()
      controller.abort()
      controller = new AbortController();
      if (!treedata) experimentContext.shutdown("tree", experimentContext.loggedUser, expid);
      if (!data) experimentContext.shutdown("graph", experimentContext.loggedUser, expid);
      return;
    };

    window.addEventListener("beforeunload", unloadCallback);
      return () => window.removeEventListener("beforeunload", unloadCallback);
  });

  useEffect(() => {
    // Get experiment header data
    getExperiment(expid);
    // Get experiment running status
    getRunningState(expid);
    // Get current log status
    getLogStatus(expid);

    const interval = setInterval(() => getRunningState(expid), 300000); // Every 5 minutes

    // componentWillUnmount cleanup
    return (() => {
      clearInterval(interval);
      cleanExperimentData();

      controller.abort()
      controller = new AbortController();

      if (!treedata) experimentContext.shutdown("tree", experimentContext.loggedUser, expid);
      if (!data) experimentContext.shutdown("graph", experimentContext.loggedUser, expid);
    })
  // eslint-disable-next-line
  }, [])

  return (
    <Fragment>
      <div className='row'>
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
                onClick={() => setCurrentTab("tree")}
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
                onClick={() => setCurrentTab("graph")}
              >
                Graph
              </a>
            </li>
            <li className='nav-item'>
              <a
                className={classLog}
                id='log-tab'
                data-toggle='tab'
                href='#log'
                role='tab'
                aria-controls='log'
                aria-selected='false'
                onClick={() => setCurrentTab("log")}
              >
                Log
              </a>
            </li>
            <li className='nav-item'>
              <a
                className={classConfig}
                id='config-tab'
                data-toggle='tab'
                href='#config'
                role='tab'
                aria-controls='config'
                aria-selected='false'
                onClick={() => setCurrentTab("configuration")}
              >
                Configuration
              </a>
            </li>
            <li className='nav-item'>
              <a
                className={classStats}
                id='stats-tab'
                data-toggle='tab'
                href='#stats'
                role='tab'
                aria-controls='stats'
                aria-selected='false'
                onClick={() => setCurrentTab("statistics")}
              >
                Statistics
              </a>
            </li>
            {SHOW_PERFORMANCE_TAB && (
              <li className='nav-item'>
                <a
                  className={classPerformance}
                  id='performance-tab'
                  data-toggle='tab'
                  href='#performance'
                  role='tab'
                  aria-controls='performance'
                  aria-selected='false'
                  onClick={() => setCurrentTab("performance")}
                >
                  Performance
                </a>
              </li>
            )}

            <li className='nav-item'>
              <a
                className={classLighter}
                id='lightview-tab'
                data-toggle='tab'
                href='#lightview'
                role='tab'
                aria-controls='lightview'
                aria-selected='false'
                onClick={() => setCurrentTab("light")}
              >
                Quick View
              </a>
            </li>
            <li className='nav-item'>
              <a
                className={classFaq}
                id='faq-tab'
                data-toggle='tab'
                href='#faq'
                role='tab'
                aria-controls='faq'
                aria-selected='false'
                onClick={() => setCurrentTab("faq")}
              >
                FAQ
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
                <div className='container'>
                  <div className='row'>
                    <div className='col px-0'>
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
                    {data && (
                      <div
                        className='col-lg-3 px-0'
                        style={{ display: displayJobInfoPanel }}
                      >
                        <div className='col-12 px-0'>
                          <ul
                            className='nav nav-tabs'
                            id='myTabSide'
                            role='tablist'
                          >
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
                              {data && <GraphJob />}
                              {(startAutoUpdatePkl || graphReady) && (
                                <div>
                                  <ul
                                    className='nav nav-tabs'
                                    id='downTabSideGraph'
                                    role='tablist'
                                  >
                                    {startAutoUpdatePkl && (
                                      <li className='nav-item'>
                                        <a
                                          className={
                                            "nav-link " +
                                            (!graphReady ? "active" : "")
                                          }
                                          id='monitor-tab-graph'
                                          data-toggle='tab'
                                          href='#monitor-graph'
                                          role='tab'
                                          aria-controls='monitor-graph'
                                        >
                                          Monitor
                                        </a>
                                      </li>
                                    )}
                                    {graphReady && (
                                      <li className='nav-item'>
                                        <a
                                          className={
                                            "nav-link " +
                                            (!startAutoUpdatePkl
                                              ? "active"
                                              : "")
                                          }
                                          id='readyjobs-tab-graph'
                                          data-toggle='tab'
                                          href='#readyjobs-graph'
                                          role='tab'
                                          aria-controls='readyjobs-graph'
                                        >
                                          Ready Jobs
                                        </a>
                                      </li>
                                    )}
                                  </ul>
                                  <div
                                    className='tab-content'
                                    id='graphDownSide'
                                  >
                                    {startAutoUpdatePkl && (
                                      <div
                                        className='tab-pane fade show active'
                                        id='monitor-graph'
                                        role='tabpanel'
                                        aria-labelledby='monitor-tab-graph'
                                      >
                                        <JobMonitor
                                          experiment={experiment}
                                          getExperimentPkl={getExperimentPkl}
                                          cleanPklData={cleanPklData}
                                          pklchanges={pklchanges}
                                          experimentRunning={experimentRunning}
                                          notificationTitleGraph={
                                            notificationTitleGraph
                                          }
                                          setNotificationTitleGraph={
                                            setNotificationTitleGraph
                                          }
                                        />
                                      </div>
                                    )}
                                    {graphReady && (
                                      <div
                                        className={
                                          "tab-pane fade show " +
                                          (!startAutoUpdatePkl ? "active" : "")
                                        }
                                        id='readyjobs-graph'
                                        role='tabpanel'
                                        aria-labelledby='readyjobs-tab-graph'
                                      >
                                        <ReadyJobs
                                          readyJobs={graphReady}
                                          source='graph'
                                        />
                                      </div>
                                    )}
                                  </div>
                                </div>
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
                      </div>
                    )}

                    {experiment && data && canSelect && (
                      <div className='col-2 pl-0'>
                        <SelectedJobs target={"graph"} source={"experiment"} />
                      </div>
                    )}
                  </div>
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
                <div className='card-body p-0'>
                  <div className='container'>
                    <div className='row'>
                      <div className='col px-0'>
                        <TreeNativeRep
                          treedata={treedata}
                          loadingTree={loadingTree}
                          cleanTreeData={cleanTreeData}
                          setFancyTree={setFancyTree}
                          updateSelectionTree={updateSelectionTree}
                          updateCurrentSelected={updateCurrentSelectedTree}
                          canSelect={canSelect}
                          totalJobs={totalJobs}
                        />
                      </div>
                      {treedata && (
                        <div className='col-lg-3 px-0'>
                          <TreeJob />
                          {(startAutoUpdateTreePkl || treeReady) && (
                            <div>
                              <ul
                                className='nav nav-tabs'
                                id='downTabSideTree'
                                role='tablist'
                              >
                                {startAutoUpdateTreePkl && (
                                  <li className='nav-item'>
                                    <a
                                      className={
                                        "nav-link " +
                                        (!treeReady ? "active" : "")
                                      }
                                      id='monitor-tab-tree'
                                      data-toggle='tab'
                                      href='#monitor-tree'
                                      role='tab'
                                      aria-controls='monitor-tree'
                                    >
                                      Monitor
                                    </a>
                                  </li>
                                )}
                                {treeReady && (
                                  <li className='nav-item'>
                                    <a
                                      className={
                                        "nav-link " +
                                        (!startAutoUpdateTreePkl
                                          ? "active"
                                          : "")
                                      }
                                      id='readyjobs-tab-tree'
                                      data-toggle='tab'
                                      href='#readyjobs-tree'
                                      role='tab'
                                      aria-controls='readyjobs-tree'
                                    >
                                      Ready Jobs
                                    </a>
                                  </li>
                                )}
                              </ul>

                              <div className='tab-content' id='treeDownSide'>
                                {startAutoUpdateTreePkl && (
                                  <div
                                    className='tab-pane fade show active'
                                    id='monitor-tree'
                                    role='tabpanel'
                                    aria-labelledby='monitor-tab-tree'
                                  >
                                    <JobMonitorTree
                                      experiment={experiment}
                                      getExperimentTreePkl={
                                        getExperimentTreePkl
                                      }
                                      cleanPklTreeData={cleanPklTreeData}
                                      pkltreechanges={pkltreechanges}
                                      experimentRunning={experimentRunning}
                                      notificationTitleTree={
                                        notificationTitleTree
                                      }
                                      setNotificationTitleTree={
                                        setNotificationTitleTree
                                      }
                                    />
                                  </div>
                                )}
                                {treeReady && (
                                  <div
                                    className={
                                      "tab-pane fade show " +
                                      (!startAutoUpdateTreePkl ? "active" : "")
                                    }
                                    id='readyjobs-tree'
                                    role='tabpanel'
                                    aria-labelledby='readyjobs-tab-tree'
                                  >
                                    <ReadyJobs
                                      readyJobs={treeReady}
                                      source='tree'
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      {experiment && treedata && canSelect && (
                        <div className='col-md-2 px-0'>
                          <SelectedJobs target={"tree"} source={"experiment"} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className={classTabLog}
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
              className={classTabStats}
              id='stats'
              role='tabpanel'
              aria-labelledby='stats-tab'
            >
              <div className='card' style={experimentMinStyle}>
                <StatsControl />
                <div className='card-body p-1'>
                  <StatsSearch />
                </div>
              </div>
            </div>
            {SHOW_PERFORMANCE_TAB && (
              <div
                className={classTabPerformance}
                id='performance'
                role='tabpanel'
                aria-labelledby='performance-tab'
              >
                <div className='card'>
                  {experiment && <PerformanceControl />}
                  <div className='card-body'>
                    {experiment && <Performance />}
                  </div>
                </div>
              </div>
            )}
            <div
              className={classTabLighter}
              id='lightview'
              role='tabpanel'
              aria-labelledby='lightview-tab'
            >
              <div className='card'>
                {experiment && <LighterControl />}
                <div className='card-body p-1'>
                  {experiment && (
                    <LighterNativeRep
                      data={currentData}
                      isValid={isValid}
                      errorMessage={errorMessage}
                      loadingView={loadingView}
                      setLighterFancyTree={setLighterFancyTree}
                      cleanLoadingLighterView={cleanLoadingLighterView}
                    />
                  )}
                </div>
              </div>
            </div>
            <div
              className={classTabFaq}
              id='faq'
              role='tabpanel'
              aria-labelledby='faq-tab'
            >
              <div className='card mt-2'>
                <div className='card-header'>Frequently Asked Questions</div>
                <div className='card-body p-1'>
                  <FAQ />
                </div>
              </div>
            </div>
            <div
              className={classTabConfig}
              id='config'
              role='tabpanel'
              aria-labelledby='config-tab'
            >
              <div className='card'>
                <ConfigurationControl />
                <div className='card-body p-1'>
                  <CurrentConfiguration />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ExperimentColumn expidToken={expid} />
    </Fragment>
  );
};

const experimentMinStyle = {
  minHeight: "100%",
};

export default withRouter(ExperimentCentral);
