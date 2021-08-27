import React, { useReducer } from "react";
import axios from "axios";
import TreeContext from "./treeContext";
import TreeReducer from "./treeReducer";

import {
  GET_TREE,
  SET_LOADING_TREE_REFRESH,
  SET_LOADING_TREE_PKL,
  PKL_TREE_LOADED,
  SET_FANCYTREE,
  SET_LOADING_FILTER,
  CLEAN_TREE_DATA,
  CLEAN_TREE_PKL_DATA,
  SET_AUTOUPDATE_TREE_PKL,
  UPDATE_SELECTION_TREE,
  CLEAR_FILTER_TREE,
  FILTER_TREEVIEW,
  SET_LOADING_TREE,
  SET_START_TREE_SELECTION,
  SET_NOTIFICATION_TITLE_TREE,
  SET_OFF_LOADING_TREE,
  INCREASE_LOADING_TREE,
  UPDATE_RUNDETAIL_ON_TREE,
  GET_EXPERIMENT_RUN_JOBDATA,  
  LOADING_PREVIOUS_RUN,
  UPDATE_TREE_SELECTED_NODES,
  SET_CURRENT_COMMAND,
  SET_CURRENT_TEXT_COMMAND,
} from "../types";

// import { start, end } from "../utils";

import { AUTOSUBMIT_API_SOURCE, DEBUG, NOAPI } from "../vars";

const TreeState = (props) => {
  const initialState = {
    treedata: null,
    loadingTree: false,
    enabledTreeSearch: true,
    loadingTreePkl: false,
    loadingTreeRefresh: false,
    loadingFilterTree: false,
    loadingPreviousRun: false,
    fancyTree: null,
    experimentRunDetailForTree: null,
    currentRunIdOnTree: null,
    elapsedLoadingTree: 1,
    startAutoUpdateTreePkl: false,
    currentCommandTree: null,
    currentTextCommandTree: null,
    pkltreechanges: null,
    selectedTreeNode: null,
    //selection: null,
    notificationTitleTree: null,
    treeSelectedNodes: null,
    treeReady: null,
    warningActive: null,
  };

  const [state, dispatch] = useReducer(TreeReducer, initialState);
  const localserver = AUTOSUBMIT_API_SOURCE;
  const debug = DEBUG;
  
  const getExperimentTree = async (expid, warningMessage = null) => {
    setLoadingTree();
    let result = null;
    //start();
    if (NOAPI) {
      result = require("../data/tree_"+String(expid)+".json");
    } else {
      const res = await axios
      .get(`${localserver}/tree/${expid}`)
      .catch((error) => {
        alert(error.message);
        setOffLoadingTree();
      });
      result = res ? res.data : null;
    }
  
    if (result) {
      debug && console.log(result);
      result.warningMessage = warningMessage;
      dispatch({
        type: GET_TREE,
        payload: result,
      });
    }

    //end();
  };

  // Get experiment pkl data for tree
  const getExperimentTreePkl = async (expid, timeStamp) => {
    //console.log(expid, timeStamp);
    setLoadingTreePkl();
    setLoadingTreeRefresh();
    let retrievedPklTree = null;
    if (NOAPI) {
      retrievedPklTree = require("../data/pkltreeinfo_"+String(expid)+".json");
    } else {
      const res = await axios.get(
        `${localserver}/pkltreeinfo/${expid}/${timeStamp}`
      );
      retrievedPklTree = res.data;
      debug && console.log(retrievedPklTree);
    }
    
    dispatch({
      type: PKL_TREE_LOADED,
      payload: retrievedPklTree,
    });
  };

  const getExperimentRunJobData = async (expid, run_id, meta) => {
    setLoadingPreviousRun();
    let result = null;
    if (NOAPI) {
      result = require("../data/rundetail_"+String(expid)+"_"+String(run_id)+".json");
      // console.log(result);
    } else {
      const res = await axios.get(`${localserver}/rundetail/${expid}/${run_id}`).catch((error) => { alert(error.message);});
      debug && console.log(res.data);
      // console.log(res.data);
      result = res ? res.data : null;
    }
    
    // console.log(result);

    dispatch({
      type: GET_EXPERIMENT_RUN_JOBDATA,
      payload: {result: result, runId: run_id, meta: meta},
    });    
    // setAutoUpdateTreePkl(false);
  }

  const updateTreeContent = async (runDetail, run_id) => {
    // setLoadingTreePkl();
    // setLoadingTreeRefresh();
    // setLoadingTree();
    dispatch({
      type: UPDATE_RUNDETAIL_ON_TREE,
      payload: {runDetail: runDetail, runId: run_id},
    })
  }

  const filterTreeView = (string) => {
    setLoadingFilter();
    dispatch({
      type: FILTER_TREEVIEW,
      payload: string,
    });
  };

  const setCurrentCommandTree = async (command) => {
    dispatch({
      type: SET_CURRENT_COMMAND,
      payload: command,
    });
  };

  const setCurrentTextCommandTree = async (command) => {
    dispatch({
      type: SET_CURRENT_TEXT_COMMAND,
      payload: command,
    });
  }

  const setFancyTree = (value) =>
    dispatch({ type: SET_FANCYTREE, payload: value });

  const updateSelectionTree = (currentSelected) => {
    dispatch({ type: UPDATE_SELECTION_TREE, payload: currentSelected });
  };

  const cleanTreeData = () => dispatch({ type: CLEAN_TREE_DATA });
  const cleanPklTreeData = () => dispatch({ type: CLEAN_TREE_PKL_DATA });
  const clearFilterTreeView = () =>
    dispatch({
      type: CLEAR_FILTER_TREE,
    });
  const increaseElapsedLoadingTree = () => {
    dispatch({ type: INCREASE_LOADING_TREE });
  };

  const setLoadingTree = () => dispatch({ type: SET_LOADING_TREE }); //here
  const setLoadingPreviousRun = () => dispatch({ type: LOADING_PREVIOUS_RUN });
  const setOffLoadingTree = () => dispatch({ type: SET_OFF_LOADING_TREE });
  const setLoadingFilter = () => dispatch({ type: SET_LOADING_FILTER });
  const setLoadingTreeRefresh = () =>
    dispatch({ type: SET_LOADING_TREE_REFRESH });
  const setLoadingTreePkl = () => dispatch({ type: SET_LOADING_TREE_PKL });
  const setAutoUpdateTreePkl = (value) =>
    dispatch({ type: SET_AUTOUPDATE_TREE_PKL, payload: value });
  // const setWarningActive = (warning) => {      
  //     dispatch({ type: SET_WARNING_ACTIVE, payload: warning });
  //  }
  const setStartSelection = () => dispatch({ type: SET_START_TREE_SELECTION });
  const setNotificationTitleTree = (notification) =>
    dispatch({ type: SET_NOTIFICATION_TITLE_TREE, payload: notification });
  const updateTreeSelectedNodes = () =>
    dispatch({ type: UPDATE_TREE_SELECTED_NODES });

  return (
    <TreeContext.Provider
      value={{
        treedata: state.treedata,
        loadingTree: state.loadingTree,
        loadingTreePkl: state.loadingTreePkl,
        loadingFilterTree: state.loadingFilterTree,
        enabledTreeSearch: state.enabledTreeSearch,
        returnFilter: state.returnFilter,
        fancyTree: state.fancyTree,
        notificationTitleTree: state.notificationTitleTree,
        loadingPreviousRun: state.loadingPreviousRun,
        startAutoUpdateTreePkl: state.startAutoUpdateTreePkl,
        pkltreechanges: state.pkltreechanges,
        selectedTreeNode: state.selectedTreeNode,
        expectedLoadingTreeTime: state.expectedLoadingTreeTime,
        elapsedLoadingTree: state.elapsedLoadingTree,
        currentRunIdOnTree: state.currentRunIdOnTree,
        //selection: state.selection,
        treeSelectedNodes: state.treeSelectedNodes,
        currentCommandTree: state.currentCommandTree,
        currentTextCommandTree: state.currentTextCommandTree,
        treeReady: state.treeReady,
        warningActive: state.warningActive,
        getExperimentTree,
        getExperimentTreePkl,
        filterTreeView,
        setFancyTree,
        cleanTreeData,
        cleanPklTreeData,
        updateSelectionTree,
        setAutoUpdateTreePkl,
        clearFilterTreeView,
        setStartSelection,
        setNotificationTitleTree,
        increaseElapsedLoadingTree,
        updateTreeContent,
        getExperimentRunJobData,
        updateTreeSelectedNodes,
        setCurrentCommandTree,
        setCurrentTextCommandTree,        
      }}
    >
      {props.children}
    </TreeContext.Provider>
  );
};

export default TreeState;
