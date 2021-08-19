import React, { useReducer } from "react";
import axios from "axios";
import StatsContext from "./statsContext";
import StatsReducer from "./statsReducer";
import {
  SET_LOADING,
  GET_EXPERIMENT_STATS,
  CLEAR_STATS,
  SET_ERROR_STATS,
} from "../types";
import { sleep } from "../utils";

import { AUTOSUBMIT_API_SOURCE, DEBUG, NOAPI } from "../vars";

const StatsState = (props) => {
  const initialState = {
    loading: false,
    statdata: null,
    ticksdata: null,
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
    
    // let resultQueued = [["Jobs", "Queue Time"]];
    // let resultRun = [["Jobs", "Run Time"]];
    // let resultNumberFailedJobs = [["Jobs", "# Failed Attempts"]];
    // let resultFailedQueued = [["Jobs", "Failed Queue Time"]];
    // let resultFailedRun = [["Jobs", "Failed Run Time"]];

    // let requestResult = [];
    let jobStatData = [];
    // let ticks = [];
    debug && console.log(res.data);
    if (res.data) {
      if (res.data.error === true) {
        setIsError(true, res.data.error_message);
      } else {
        setIsError(false, "");
      }

      // resultQueued.push([
      //   "Jobs",
      //   "Queued",
      //   "Run",
      //   "Failed Jobs",
      //   "Failed Queued",
      //   "Fail Run",
      // ]);

      for (let i = 0; i < res.data.jobs.length; i++) {
        
        jobStatData.push(
          {
            name: res.data.jobs[i],
            queue: Number.parseFloat(res.data.stats.queued[i]).toFixed(2),
            run: Number.parseFloat(res.data.stats.run[i]).toFixed(2),
            failedAttempts: res.data.stats.failed_jobs[i],
            failedQueue: Number.parseFloat(res.data.stats.fail_queued[i]).toFixed(2),
            failedRun: Number.parseFloat(res.data.stats.fail_run[i]).toFixed(2)  
          });
        // if (res.data.stats.queued[i] > 0) {
        //   resultQueued.push([
        //     res.data.jobs[i],
        //     res.data.stats.queued[i]
        //   ]);
        // }
        // if (res.data.stats.run[i] > 0) {
        //   resultRun.push([
        //     res.data.jobs[i],
        //     res.data.stats.run[i]]);
        // }
        // if (res.data.stats.failed_jobs[i] > 0) {
        //   resultNumberFailedJobs.push([
        //     res.data.jobs[i],
        //     res.data.stats.failed_jobs[i]]);
        // }
        // if (res.data.stats.fail_queued[i] > 0) {
        //   resultFailedQueued.push([
        //     res.data.jobs[i],
        //     res.data.stats.fail_queued[i]]);
        // }
        // if (res.data.stats.fail_run[i] > 0) {
        //   resultFailedRun.push([
        //     res.data.jobs[i],
        //     res.data.stats.fail_run[i]]);
        // }
        // ticks.push({ v: i + 1, f: res.data.jobs[i] });
      }
      // requestResult = res.data;
    }
    // console.log(resultQueued);
    // console.log(ticks);
    // console.log(result);
    // console.log(requestResult);
    // console.log(ticks);
    // console.log(requestResult);
    // console.log(result);
    dispatch({
      type: GET_EXPERIMENT_STATS,
      payload: { result: jobStatData, totalData: res.data },
      // payload: { result: { resultQueued, resultRun, resultNumberFailedJobs, resultFailedQueued, resultFailedRun }, requestResult, ticks },
    });
  };

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
        ticksdata: state.ticksdata,
        getExperimentStats,
        clearStats,
      }}
    >
      {props.children}
    </StatsContext.Provider>
  );
};

export default StatsState;
