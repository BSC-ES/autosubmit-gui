import React, { useReducer, useContext } from "react";
import axios from "axios";
import GraphContext from "./graphContext";
import GraphReducer from "./graphReducer";
import ExperimentContext from "../experiment/experimentContext";
import { sleep } from "../utils";

import {
  GET_GRAPH,
  GET_PKL_DATA,
  CLEAN_GRAPH_DATA,
  CLEAN_ONLY_GRAH_DATA,
  SET_LOADING_GRAPH,
  SET_AUTOUPDATE_PKL,
  SET_VIS_DATA,
  SET_VIS_NETWORK,
  UPDATE_SELECTION,
  SET_FOUND_NODES,
  SET_LOADING_SEARCH_JOB,
  SET_LOADING_PKL,
  SET_WARNING_ACTIVE,
  SHOULD_UPDATE_GRAPH,
  SET_LOADING_JOB_MONITOR,
  SET_CURRENT_COMMAND,
  SET_CURRENT_TEXT_COMMAND,
  NAVIGATE_GRAPH_TO,
  CLEAN_PKL_DATA,
  CLEAN_NAV_DATA,
  NAVIGATE_AFTER_LOADING_GRAPH,
  NAVIGATE_TO_GROUP_GRAPH,
  NAVIGATE_TO_LATEST,
  UPDATE_GRAPH_SELECTED_NODES,
  SET_NOTIFICATION_TITLE_GRAPH,
  SET_OFF_LOADING_GRAPH,
  SET_JOB_INFO_PANEL_VISIBILITY,
} from "../types";

import { AUTOSUBMIT_API_SOURCE, DEBUG, NOAPI } from "../vars";

//import { timeStampToDate } from "../utils";

const GraphState = (props) => {
  const initialState = {
    data: null,
    visNodes: null,
    visNetwork: null,
    loadingGraph: false,
    loadingPkl: false,
    loadingJobMonitor: false,
    enabledGraphSearch: true,
    loadingSearchJob: false,
    startAutoUpdatePkl: false,
    shouldUpdateGraph: false,
    pklchanges: null,
    notificationTitleGraph: null,
    warningActive: null,
    currentCommandGraph: null,
    currentTextCommandGraph: null,
    current_grouped: "none",
    current_layout: "standard",
    selection: null,
    foundNodes: null,
    graphSelectedNodes: null,
    pkldata: null,
    graphReady: null,
    displayJobInfoPanel: "block",
    activeWarning: null,
  };

  const [state, dispatch] = useReducer(GraphReducer, initialState);
  const localserver = AUTOSUBMIT_API_SOURCE;
  //const localserver = "http://84.88.185.94:8081";
  const debug = DEBUG;

  const experimentContext = useContext(ExperimentContext);
  const { updateExperimentTimeStamp, experimentRunning } = experimentContext;

  // Get Experiment Graph
  const getExperimentGraph = async (
    expid,
    grouped = "none",
    layout = "standard",
    warningMessage = null,
    controller,
    loggedUser
  ) => {
    cleanOnlyGraphData();
    setLoadingGraph();
    let result = null;
    if (NOAPI) {
      //res = {data: null};
      result = require("../data/graph_" +
        String(expid) +
        "_standard_" +
        String(grouped) +
        ".json");
      //console.log(res.data);
      await sleep(1000);
    } else if(controller !== undefined && loggedUser !== undefined) {
      const res = await axios
        .get(`${localserver}/graph/${expid}/${layout}/${grouped}`, {
          signal: controller.signal,
          params: {
            loggedUser: loggedUser,
          }
        })
        .catch((error) => {
          if(error.message !== "canceled") {
            alert("getExperimentGraph: " + error.message);
            setOffLoadingGraph();
          } else {
            cleanGraphData()
          }
        });
      result = res ? res.data : null;
    } else {
      const res = await axios
        .get(`${localserver}/graph/${expid}/${layout}/${grouped}`)
        .catch((error) => {
          alert(error.message);
          setOffLoadingGraph();
        });
      result = res ? res.data : null;
    }

    if (result) {
      debug && console.log(result);
      //const resdata = res.data;
      dispatch({
        type: GET_GRAPH,
        payload: { resdata: result, grouped, layout, warning: warningMessage },
      });
    }
  };

  // Get Experiment Pkl Data for Graph changes update
  const getExperimentPkl = async (expid, timeStamp) => {
    // if (state.isGrouped === false){
    if (experimentRunning === false) return;
    setLoadingPkl();
    setLoadingJobMonitor();
    //timeStamp = 1000;
    debug &&
      console.log(
        "Exp: " + expid + "\t" + timeStamp + "\t" + experimentRunning
      );
    let retrievedPkl = null;
    if (NOAPI) {
      retrievedPkl = require("../data/pklinfo_" + String(expid) + ".json");
    } else {
      const res = await axios.get(
        `${localserver}/pklinfo/${expid}/${timeStamp}`
      );
      debug && console.log(res.data);
      retrievedPkl = res.data;
      const { error, error_message } = retrievedPkl;
      if (error === true) console.log(error_message);
    }

    dispatch({
      type: GET_PKL_DATA,
      payload: retrievedPkl,
    });

    updateExperimentTimeStamp(retrievedPkl.pkl_timestamp);
  };

  const navigateAfterLoadGraph = (running = false) => {
    debug && console.log("Nav. After Loading");
    dispatch({ type: NAVIGATE_AFTER_LOADING_GRAPH, payload: running });
  };

  const navigateTo = (Id) => {
    debug && console.log("Nav. To");
    dispatch({ type: NAVIGATE_GRAPH_TO, payload: Id });
  };

  const navToLatest = (statusCode, latest) => {
    debug && console.log("Nav. To Latest");
    dispatch({
      type: NAVIGATE_TO_LATEST,
      payload: { status: statusCode, latest: latest },
    });
  };

  const navigateToGroup = (IdList) => {
    debug && console.log("Nav. To Group.");
    dispatch({
      type: NAVIGATE_TO_GROUP_GRAPH,
      payload: IdList,
    });
  };

  const searchJobInGraph = async (string) => {
    setLoadingSearchJob();
    dispatch({
      type: SET_FOUND_NODES,
      payload: string.toUpperCase(),
    });
  };

  const setCurrentCommandGraph = async (command) => {
    // for change status
    //let arrayNames = [];

    //console.log(command);
    dispatch({
      type: SET_CURRENT_COMMAND,
      payload: command,
    });
  };

  const setCurrentTextCommandGraph = async (command) => {
    dispatch({
      type: SET_CURRENT_TEXT_COMMAND,
      payload: command,
    });
  };

  // value: block or none
  const setJobInfoPanelVisibility = (value) => {
    dispatch({
      type: SET_JOB_INFO_PANEL_VISIBILITY,
      payload: value,
    });
  };

  // Clean state data
  const cleanOnlyGraphData = () => dispatch({ type: CLEAN_ONLY_GRAH_DATA });
  const cleanGraphData = () => dispatch({ type: CLEAN_GRAPH_DATA });
  const cleanPklData = () => dispatch({ type: CLEAN_PKL_DATA });
  const cleanNavData = () => dispatch({ type: CLEAN_NAV_DATA });
  // Loading
  const setLoadingGraph = () => dispatch({ type: SET_LOADING_GRAPH });
  const setOffLoadingGraph = () => dispatch({ type: SET_OFF_LOADING_GRAPH });
  const setLoadingSearchJob = () => dispatch({ type: SET_LOADING_SEARCH_JOB });
  const setLoadingPkl = () => dispatch({ type: SET_LOADING_PKL });
  const setLoadingJobMonitor = () =>
    dispatch({ type: SET_LOADING_JOB_MONITOR });

  // Set Data
  const setWarningActive = (warning = null) => {
    if (warning !== null) {
      dispatch({ type: SET_WARNING_ACTIVE, payload: warning });
    }
  };
  const setAutoUpdatePkl = (value) =>
    dispatch({ type: SET_AUTOUPDATE_PKL, payload: value });
  const setVisData = (value) =>
    dispatch({ type: SET_VIS_DATA, payload: value });
  const setVisNetwork = (value) =>
    dispatch({ type: SET_VIS_NETWORK, payload: value });
  const setUpdateGraph = (value) =>
    dispatch({ type: SHOULD_UPDATE_GRAPH, payload: value });
  const updateSelection = (currentSelection) =>
    dispatch({ type: UPDATE_SELECTION, payload: currentSelection });
  const updateGraphSelectedNodes = () =>
    dispatch({ type: UPDATE_GRAPH_SELECTED_NODES });
  const setNotificationTitleGraph = (notification) =>
    dispatch({ type: SET_NOTIFICATION_TITLE_GRAPH, payload: notification });
  //const deactivateCanCopyTo = () => dispatch({ type: DEACTIVATE_COPY_TO });

  return (
    <GraphContext.Provider
      value={{
        visNetwork: state.visNetwork,
        data: state.data,
        loadingGraph: state.loadingGraph,
        loadingPkl: state.loadingPkl,
        loadingJobMonitor: state.loadingJobMonitor,
        pklchanges: state.pklchanges,
        enabledGraphSearch: state.enabledGraphSearch,
        current_grouped: state.current_grouped,
        current_layout: state.current_layout,
        selection: state.selection,
        foundNodes: state.foundNodes,
        pkldata: state.pkldata,
        startAutoUpdatePkl: state.startAutoUpdatePkl,
        shouldUpdateGraph: state.shouldUpdateGraph,
        graphSelectedNodes: state.graphSelectedNodes,
        currentCommandGraph: state.currentCommandGraph,
        currentTextCommandGraph: state.currentTextCommandGraph,
        notificationTitleGraph: state.notificationTitleGraph,
        graphReady: state.graphReady,
        displayJobInfoPanel: state.displayJobInfoPanel,
        warningActive: state.warningActive,
        getExperimentGraph,
        getExperimentPkl,
        cleanOnlyGraphData,
        cleanGraphData,
        setLoadingGraph,
        setUpdateGraph,
        setVisData,
        setVisNetwork,
        updateSelection,
        cleanPklData,
        searchJobInGraph,
        cleanNavData,
        setAutoUpdatePkl,
        navigateToGroup,
        navigateTo,
        navToLatest,
        navigateAfterLoadGraph,
        updateGraphSelectedNodes,
        setCurrentCommandGraph,
        setCurrentTextCommandGraph,
        setNotificationTitleGraph,
        setJobInfoPanelVisibility,
        setWarningActive,
      }}
    >
      {props.children}
    </GraphContext.Provider>
  );
};

export default GraphState;
