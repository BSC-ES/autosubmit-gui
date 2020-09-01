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
} from "../types";

import { AUTOSUBMIT_API_SOURCE, DEBUG } from "../vars";

const LighterState = (props) => {
  const initialState = {
    lightData: null,
    lightFancyTree: null,
    loadingView: false,
    loadingFilterTreeView: false,
    filterCount: 0,
  };

  const [state, dispatch] = useReducer(LighterReducer, initialState);
  const localserver = AUTOSUBMIT_API_SOURCE;
  const debug = DEBUG;

  const getLighterView = async (expid) => {
    cleanLoadingLighterView();
    setLoadingLighterView();
    const res = await axios.get(`${localserver}/quick/${expid}`);
    debug && console.log(res.data);
    const result = res.data;
    dispatch({
      type: GET_LIGHTER_VIEW,
      payload: result,
    });
  };

  const filterLighterTreeView = (string) => {
    setLoadingFilterLighterTreeView();
    dispatch({
      type: FILTER_LIGHTER_TREE_VIEW,
      payload: string,
    });
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
        lightData: state.lightData,
        loadingView: state.loadingView,
        loadingFilterTreeView: state.loadingFilterTreeView,
        filterCount: state.filterCount,
        getLighterView,
        cleanLoadingLighterView,
        setLighterFancyTree,
        filterLighterTreeView,
        setLoadingFilterLighterTreeView,
        clearLighterFilterTreeView,
      }}
    >
      {props.children}
    </LighterContext.Provider>
  );
};
export default LighterState;
