import React, { useReducer } from "react";
import axios from "axios";
import LighterContext from "./lighterContext";
import LighterReducer from "./lighterReducer";

import {
  GET_LIGHTER_VIEW,
  SET_LOADING_LIGHTER_VIEW,
  CLEAN_LIGHTER_VIEW_DATA,
  SET_LIGHTER_FANCY_TREE,
  FILTER_LIGHTER_TREE_VIEW,
  SET_LOADING_FILTER_LIGHTER_TREE_VIEW,
  CLEAR_LIGHTER_FILTER,
  INCREASE_LOADING_QUICK_VIEW,
} from "../types";

import { AUTOSUBMIT_API_SOURCE, DEBUG, NOAPI } from "../vars";

const LighterState = (props) => {
  const initialState = {
    baseData: null,    
    currentData: null,
    firstCurrentData: null,
    currentCount: 0,
    lightFancyTree: null,
    loadingView: false,
    queueCount: 0,
    runCount: 0,
    totalCount: 0,
    failedCount: 0,
    completedCount: 0,
    isValid: false,
    error: false,
    errorMessage: null,
    loadingFilterTreeView: false,
    filterCount: -1,
    elapsedLoadingQuickView: 1,
  };

  const [state, dispatch] = useReducer(LighterReducer, initialState);
  const localserver = AUTOSUBMIT_API_SOURCE;
  const debug = DEBUG;

  const getLighterView = async (expid) => {
    cleanLoadingLighterView();
    setLoadingLighterView();
    let result = null;
    if (NOAPI) {
      result = require("../data/quick_"+String(expid)+".json"); 
    } else {
      const res = await axios.get(`${localserver}/quick/${expid}`);
      debug && console.log(res.data);
      result = res ? res.data : null;
    }
    
    if (result){
      dispatch({
        type: GET_LIGHTER_VIEW,
        payload: result,
      });
    }
  };

  const filterLighterTreeView = (string) => {
    setLoadingFilterLighterTreeView();
    dispatch({
      type: FILTER_LIGHTER_TREE_VIEW,
      payload: string,
    });
  };

  const increaseElapsedLoadingQuickView = () => {
    dispatch({ type: INCREASE_LOADING_QUICK_VIEW });
  };

  const setLoadingLighterView = () =>
    dispatch({ type: SET_LOADING_LIGHTER_VIEW });

  const cleanLoadingLighterView = () =>
    dispatch({ type: CLEAN_LIGHTER_VIEW_DATA });

  const setLighterFancyTree = (value) =>
    dispatch({ type: SET_LIGHTER_FANCY_TREE, payload: value });

  const setLoadingFilterLighterTreeView = () =>
    dispatch({ type: SET_LOADING_FILTER_LIGHTER_TREE_VIEW });

  const clearLighterFilterTreeView = () =>
    dispatch({
      type: CLEAR_LIGHTER_FILTER,
    });

  return (
    <LighterContext.Provider
      value={{
        lightFancyTree: state.lightFancyTree,
        baseData: state.baseData,
        currentData: state.currentData,
        firstCurrentData: state.firstCurrentData,
        currentCount: state.currentCount,
        loadingView: state.loadingView,
        loadingFilterTreeView: state.loadingFilterTreeView,
        filterCount: state.filterCount,
        elapsedLoadingQuickView: state.elapsedLoadingQuickView,
        queueCount: state.queueCount,
        isValid: state.isValid,
        runCount: state.runCount,
        totalCount: state.totalCount,
        failedCount: state.failedCount,
        completedCount: state.completedCount,
        error: state.error,
        errorMessage: state.errorMessage,
        getLighterView,
        cleanLoadingLighterView,
        setLighterFancyTree,
        filterLighterTreeView,
        setLoadingFilterLighterTreeView,
        clearLighterFilterTreeView,
        increaseElapsedLoadingQuickView,
      }}
    >
      {props.children}
    </LighterContext.Provider>
  );
};
export default LighterState;
