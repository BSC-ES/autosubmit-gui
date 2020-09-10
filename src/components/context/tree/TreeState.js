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
} from "../types";

// import { start, end } from "../utils";

import { AUTOSUBMIT_API_SOURCE, DEBUG } from "../vars";

const TreeState = (props) => {
  const initialState = {
    treedata: null,
    loadingTree: false,
    enabledTreeSearch: true,
    loadingTreePkl: false,
    loadingTreeRefresh: false,
    loadingFilterTree: false,
    fancyTree: null,
    //canSelect: false,
    elapsedLoadingTree: 1,
    startAutoUpdateTreePkl: false,
    pkltreechanges: null,
    selectedTreeNode: null,
    notificationTitleTree: null,
  };

  const [state, dispatch] = useReducer(TreeReducer, initialState);
  const localserver = AUTOSUBMIT_API_SOURCE;
  const debug = DEBUG;

  const getExperimentTree = async (expid) => {
    setLoadingTree();
    //start();
    const res = await axios
      .get(`${localserver}/tree/${expid}`)
      .catch((error) => {
        alert(error.message);
        setOffLoadingTree();
      });
    if (res) {
      debug && console.log(res.data);
      dispatch({
        type: GET_TREE,
        payload: res.data,
      });
    }

    //end();
  };

  // Get experiment pkl data for tree
  const getExperimentTreePkl = async (expid, timeStamp) => {
    //console.log(expid, timeStamp);
    setLoadingTreePkl();
    setLoadingTreeRefresh();
    const res = await axios.get(
      `${localserver}/pkltreeinfo/${expid}/${timeStamp}`
    );
    const retrievedPklTree = res.data;
    debug && console.log(retrievedPklTree);
    dispatch({
      type: PKL_TREE_LOADED,
      payload: retrievedPklTree,
    });
  };

  const filterTreeView = (string) => {
    setLoadingFilter();
    dispatch({
      type: FILTER_TREEVIEW,
      payload: string,
    });
  };

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
  const setOffLoadingTree = () => dispatch({ type: SET_OFF_LOADING_TREE });
  const setLoadingFilter = () => dispatch({ type: SET_LOADING_FILTER });
  const setLoadingTreeRefresh = () =>
    dispatch({ type: SET_LOADING_TREE_REFRESH });
  const setLoadingTreePkl = () => dispatch({ type: SET_LOADING_TREE_PKL });
  const setAutoUpdateTreePkl = (value) =>
    dispatch({ type: SET_AUTOUPDATE_TREE_PKL, payload: value });

  const setStartSelection = () => dispatch({ type: SET_START_TREE_SELECTION });
  const setNotificationTitleTree = (notification) =>
    dispatch({ type: SET_NOTIFICATION_TITLE_TREE, payload: notification });

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
        //canSelect: state.canSelect,
        startAutoUpdateTreePkl: state.startAutoUpdateTreePkl,
        pkltreechanges: state.pkltreechanges,
        selectedTreeNode: state.selectedTreeNode,
        expectedLoadingTreeTime: state.expectedLoadingTreeTime,
        elapsedLoadingTree: state.elapsedLoadingTree,
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
      }}
    >
      {props.children}
    </TreeContext.Provider>
  );
};

export default TreeState;
