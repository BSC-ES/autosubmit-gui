import React, { useReducer } from "react";
import axios from "axios";
import StatsContext from "./statsContext";
import StatsReducer from "./statsReducer";
import {
  SET_LOADING,
  GET_EXPERIMENT_STATS,
  CLEAR_STATS,
  SET_FILTER_CHART,
  APPLY_FILTER,
} from "../types";
import { sleep } from "../utils";

import { AUTOSUBMIT_API_SOURCE, DEBUG, NOAPI } from "../vars";

const StatsState = (props) => {
  const initialState = {
    loading: false,
    statdata: null,
    filteredStatdata: null,
    timeframe: null,
    isError: false,
    filterAppliedCount: 0,
    errorMessage: "",
  };

  const localserver = AUTOSUBMIT_API_SOURCE;

  const debug = DEBUG;
  const [state, dispatch] = useReducer(StatsReducer, initialState);

  // Get Experiment Stats
  const getExperimentStats = async (expid, hours, type) => {
    debug && console.log("Getting...");
    if (hours.length === 0) {
      hours = 0;
    }
    if (type.length === 0) {
      type = "Any";
    }

    setLoading();
    //cleanGraphData();
    let res = null;
    const result = {error: true,
      error_message: "No response",
      Statistics: {
      JobStatistics: [],
      Period: {
        From: null,
        To: null,
      }
    }};
    if (NOAPI) {
      res = {data:null};
      res.data = require("../data/stats_"+String(expid)+".json")
      sleep(1000);
    } else {
      res = await axios.get(
        `${localserver}/stats/${expid}/${hours}/${type}`
      );
    }

    debug && console.log(res.data);
    if (!res.data) {
      dispatch({
        type: GET_EXPERIMENT_STATS,
        payload: {statistics: result }
      });
    } else {
      dispatch({
        type: GET_EXPERIMENT_STATS,
        payload: { statistics: res.data },      
      });
    }    
  };

  const filterBarChart = (currentChecked, target) => {
    dispatch({
      type: SET_FILTER_CHART,
      payload: { currentChecked: currentChecked, target: target },
    })
  }
  
  const clearStats = () => dispatch({ type: CLEAR_STATS });
  const setLoading = () => dispatch({ type: SET_LOADING });
  const applyRegExToJobDataSet = (regularExpression) => {    
    dispatch({
      type: APPLY_FILTER,
      payload : { regularExpression },
    });
  };


  // const setIsError = (error, msg) => {
  //   dispatch({
  //     type: SET_ERROR_STATS,
  //     payload: { error, msg },
  //   });
  // };

  return (
    <StatsContext.Provider
      value={{
        loading: state.loading,
        statdata: state.statdata,
        isError: state.isError,
        errorMessage: state.errorMessage,
        timeframe: state.timeframe,
        filteredStatdata: state.filteredStatdata,
        filterAppliedCount: state.filterAppliedCount,
        getExperimentStats,
        clearStats,
        filterBarChart,
        applyRegExToJobDataSet
      }}
    >
      {props.children}
    </StatsContext.Provider>
  );
};

export default StatsState;
