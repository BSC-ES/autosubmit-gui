import React, { useReducer } from "react";
import axios from "axios";
import StatsContext from "./statsContext";
import StatsReducer from "./statsReducer";
import {
  SET_LOADING,
  GET_EXPERIMENT_STATS,
  CLEAR_STATS,
  SET_ERROR_STATS,
  SET_FILTER_CHART,
} from "../types";
import { sleep } from "../utils";

import { AUTOSUBMIT_API_SOURCE, DEBUG, NOAPI } from "../vars";

const StatsState = (props) => {
  const initialState = {
    loading: false,
    statdata: null,
    backupdata: null,
    isError: false,
    totaldata: null,
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
    if (NOAPI) {
      res = {data:null};
      res.data = require("../data/stats_"+String(expid)+".json")
      sleep(1000);
    } else {
      res = await axios.get(
        `${localserver}/stats/${expid}/${hours}/${type}`
      );
    }

    let jobStatData = [];
    debug && console.log(res.data);
    
    if (res.data) {
      if (res.data.error === true) {
        setIsError(true, res.data.error_message);
      } else {
        setIsError(false, "");
      }

      for (let i = 0; i < res.data.jobs.length; i++) {
        const jobName = res.data.jobs[i];
        const queueTime = Math.max(Number.parseFloat(res.data.stats.queued[i]), 0);
        const runTime = Math.max(Number.parseFloat(res.data.stats.run[i]), 0);
        const numberFailedAttempts = Math.max(Number.parseInt(res.data.stats.failed_jobs[i]), 0);
        const failedQueueTime = Math.max(Number.parseFloat(res.data.stats.fail_queued[i]), 0);
        const failedRunTime = Math.max(Number.parseFloat(res.data.stats.fail_run[i]), 0);
        if (queueTime > 0 || runTime > 0 || numberFailedAttempts > 0 || failedQueueTime > 0 || failedRunTime > 0) {
          jobStatData.push(
            {
              name: jobName,
              queue: queueTime,
              run: runTime,
              failedAttempts: numberFailedAttempts,
              failedQueue: failedQueueTime,
              failedRun: failedRunTime 
            });
        }        
      }
    }

    dispatch({
      type: GET_EXPERIMENT_STATS,
      payload: { result: jobStatData, totalData: res.data },
      // payload: { result: { resultQueued, resultRun, resultNumberFailedJobs, resultFailedQueued, resultFailedRun }, requestResult, ticks },
    });
  };

  const filterBarChart = (currentChecked, target) => {
    // console.log(currentChecked);
    // console.log(target);
    dispatch({
      type: SET_FILTER_CHART,
      payload: { currentChecked: currentChecked, target: target },
    })
  }

  // Clear stats data
  const clearStats = () => dispatch({ type: CLEAR_STATS });

  const setLoading = () => dispatch({ type: SET_LOADING });

  const setIsError = (error, msg) => {
    dispatch({
      type: SET_ERROR_STATS,
      payload: { error, msg },
    });
  };

  return (
    <StatsContext.Provider
      value={{
        loading: state.loading,
        statdata: state.statdata,
        isError: state.isError,
        errorMessage: state.errorMessage,
        totaldata: state.totaldata,
        backupdata: state.backupdata,
        getExperimentStats,
        clearStats,
        filterBarChart
      }}
    >
      {props.children}
    </StatsContext.Provider>
  );
};

export default StatsState;
