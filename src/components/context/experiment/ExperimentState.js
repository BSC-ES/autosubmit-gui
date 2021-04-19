import React, { useReducer } from "react";
import axios from "axios";
import ExperimentContext from "./experimentContext";
import ExperimentReducer from "./experimentReducer";
import {
  SEARCH_EXPERIMENTS,
  SET_LOADING,
  CLEAR_EXPERIMENTS,
  GET_EXPERIMENT,
  //GET_TREE,
  //SET_LOADING_TREE,
  GET_EXPERIMENT_RUN,
  SET_LOADING_RUN,
  CLEAN_RUN_DATA,
  SET_AUTOUPDATE_RUN,
  SET_LOADING_STATE,
  GET_RUNNING_STATE,
  UPDATE_EXPERIMENT_TS,
  CURRENT_RUNNING,
  GET_EXPERIMENT_SUMMARY,
  CLEAR_SUMMARY_EXP,
  GET_EXPERIMENT_PERFORMANCE,
  CLEAN_PERFORMANCE_METRICS,
  ACTIVATE_SELECTION_MODE,
  DEACTIVATE_SELECTION_MODE,
  REMOVE_SELECTED_JOB,
  SET_CURRENT_COMMAND,
  SET_CURRENT_TEXT_COMMAND,
  UPDATE_SELECTED_JOBS,
  SET_LOADING_SUMMARY,
  CLEAN_EXPERIMENT_DATA,
  LOADING_PERFORMANCE_METRICS,
  GET_JOB_HISTORY,
  LOADING_JOB_HISTORY,
  LOADING_EXPERIMENT_RUNS,
  GET_EXPERIMENT_RUNS,
  GET_FILE_STATUS,
  CLEAN_FILE_STATUS_DATA,
  GET_JOB_LOG,
} from "../types";

import { AUTOSUBMIT_API_SOURCE, DEBUG, ERROR_MESSAGE, NOAPI } from "../vars";

import { timeStampToDate, errorEsarchiveStatus } from "../utils";

const ExperimentState = (props) => {
  const initialState = {
    experiments: [],
    summaries: [],
    experiment: {},
    totalJobs: 0,
    animal: 1,
    jobHistory: null,
    experimentRuns: null,        
    expectedLoadingTreeTime: 0,
    expectedLoadingQuickView: 0,
    loadingSummary: new Map(),
    loading: false,
    loadingPerformance: false,
    experimentRunning: false,
    joblog: null,
    rundata: null,
    performancedata: null,
    loadingRun: false,
    loadingState: false,
    loadingFilterTree: false,
    loadingExperimentRuns: false,
    currentCommand: null,
    currentTextCommand: null,
    currentSelected: [],
    startAutoUpdateRun: false,
    startAutoUpdateTreePkl: false,
    fancyTree: null,
    allowJobMonitor: false,
    canSelect: false,
    esarchiveStatus: null,
  };

  const [state, dispatch] = useReducer(ExperimentReducer, initialState);

  const localserver = AUTOSUBMIT_API_SOURCE;
  //const localserver = "http://84.88.185.94:8081";
  const debug = DEBUG;

  // Search Experiments
  const searchExperiments = async (text) => {
    setLoading();
    let result = null;
    if (NOAPI) {      
      result = require("../data/search.json").experiment;
    } else {
      const res = await axios.get(`${localserver}/search/${text}`).catch(error => alert(ERROR_MESSAGE + "\n" + error.message));
      debug && console.log(res.data);
      result = res ? res.data.experiment : [];
    }  
    dispatch({
      type: SEARCH_EXPERIMENTS,
      payload: result,
    });
  };

  const getSummaries = () => {
    const experiments = state.experiments;
    for (var exp in experiments) {
      var exp_name = experiments[exp].name;
      getExperimentSummary(exp_name);
    }
  };

  const getJobHistory = async (expid, job_name) => {
    setLoadingJobHistory();
    let result = null;
    if (NOAPI) {
      // Only one job for NO-API mode
      result = require("../data/history_"+String(expid)+".json");
    } else {
      const res = await axios
      .get(`${localserver}/history/${expid}/${job_name}`)
      .catch((error) => {
        alert(error.message);
      });
      debug && console.log(res.data);
      result = res ? res.data : null;
    }    
    dispatch({
      type: GET_JOB_HISTORY,
      payload: result,
    });
  };

  const getExperimentRuns = async (expid) => {
    setLoadingExperimentRuns();
    let result = null;
    if (NOAPI) {
      result = require("../data/runs_"+String(expid)+".json");
    } else {
      const res = await axios.get(`${localserver}/runs/${expid}`).catch((error) => {alert(error.message);});    
      result = res ? res.data : null;
      debug && console.log(result);
    }    
    // console.log(result);
    dispatch({
      type: GET_EXPERIMENT_RUNS,
      payload: result,
    })
  }

  const getJobLog = async (logfile) => {
    let result = null;
    const logcontent = logfile && logfile.length > 0 ? logfile.split('/') : [''];
    const last = logcontent.pop()
    if (NOAPI) {
      result = require("../data/joblog.json");
    } else {
      const res = await axios.get(`${localserver}/joblog/${last}`).catch((error) => {alert(error.message);});    
      result = res ? res.data : null;
      debug && console.log(result);
    }
    dispatch({
      type: GET_JOB_LOG,
      payload: result,
    })
  }

  // Get Summary for Search item
  const getExperimentSummary = async (expid) => {
    clearSummary(expid);
    setLoadingSummary(expid);
    let summary = null;
    if (NOAPI){
      summary = require("../data/summary_"+String(expid)+".json");
    } else {
      const res = await axios.get(`${localserver}/summary/${expid}`).catch((error) => {alert(ERROR_MESSAGE + "\n" + error.message);});
      summary = res ? res.data : null;
      debug && console.log(summary);
    }    
    // console.log(summary);
    // console.log(state.summaries);
    //state.summaries.push({ key: expid, value: summary });
    dispatch({
      type: GET_EXPERIMENT_SUMMARY,
      payload: { expid: expid, summary: summary },
      //payload: { currentSummaries, summary, expid }
    });
  };

  const getExperimentPerformanceMetrics = async (expid) => {
    cleanPerformanceMetrics();
    setLoadingPerformanceMetrics();
    let metrics = null;
    if (NOAPI) {
      metrics = require("../data/performance_"+String(expid)+".json");
    } else {
      const res = await axios.get(`${localserver}/performance/${expid}`).catch(error => alert(ERROR_MESSAGE + "\n" + error.message));
      metrics = res ? res.data : null ;
      debug && console.log(metrics);
    }    
    dispatch({
      type: GET_EXPERIMENT_PERFORMANCE,
      payload: metrics,
    });
  };

  const clearSummary = (expid) => {
    dispatch({
      type: CLEAR_SUMMARY_EXP,
      payload: expid,
    });
  };

  const getCurrentRunning = async () => {
    setLoading();
    let result = null;
    if (NOAPI){
      result = require("../data/search.json").experiment;      
    } else {
      const res = await axios.get(`${localserver}/running/`).catch(error => alert(ERROR_MESSAGE + "\n" + error.message));
      result = res ? res.data.experiment : null;
      debug && console.log(result);
    }
    
    dispatch({
      type: CURRENT_RUNNING,
      payload: result,
    });
  };

  //const updateSelection = async () => {};

  // Get Experiment
  const getExperiment = async (expid) => {
    setLoading();
    let result = null;
    //cleanGraphData();
    if (NOAPI) {
      result = require("../data/expinfo_"+String(expid)+".json"); 
    } else {
      const res = await axios.get(`${localserver}/expinfo/${expid}`).catch(error => alert(ERROR_MESSAGE + "\n" + error.message));
      result = res ? res.data : null;
      debug && console.log(result);
    }   
    
    dispatch({
      type: GET_EXPERIMENT,
      payload: result,
    });
  };

  // Get Experiment Log Run
  const getExperimentRun = async (expid) => {
    setLoadingRun();
    let result = null;
    if (NOAPI) {
      result = require("../data/exprun_"+String(expid)+".json");
    } else {
      const res = await axios.get(`${localserver}/exprun/${expid}`).catch(error => alert(ERROR_MESSAGE + "\n" + error.message));
      result = res ? res.data : null;
      debug && console.log(result);
    }
    
    dispatch({
      type: GET_EXPERIMENT_RUN,
      payload: result,
    });
  };

  // Get current esarchive status
  const getFileStatus = async () => {
    let result = null;
    let res = null;
    let iserror = false;
    if (NOAPI) {
      result = require("../data/filestatus.json");
    } else {
      res = await axios.get(`${localserver}/filestatus/`).catch(error => {
        // alert(ERROR_MESSAGE + "\n" + error.message);
        // ;
        iserror = true;
      });
      if (iserror === true){
        res = errorEsarchiveStatus;
      }
      result = res ? res.data : null;
      debug && console.log(result);
      //console.log(result);
    }
    dispatch({
      type: GET_FILE_STATUS,
      payload: result,
    });
  }

  // Get Running State
  const getRunningState = async (expid) => {
    setLoadingState();
    let result = null;
    if (NOAPI) {
      result = require("../data/ifrun_"+String(expid)+".json");
    } else {
      const res = await axios.get(`${localserver}/ifrun/${expid}`).catch(error => alert(ERROR_MESSAGE + "\n" + error.message));
      result = res ? res.data : null;
      debug && console.log(result);
    }
    
    dispatch({
      type: GET_RUNNING_STATE,
      payload: result,
    });
  };

  const setCurrentCommand = async (command) => {
    // for change status
    dispatch({
      type: SET_CURRENT_COMMAND,
      payload: command,
    });
    //return command;
  };

  const setCurrentTextCommand = async (command) => {
    dispatch({
      type: SET_CURRENT_TEXT_COMMAND,
      payload: command,
    });
  }

  // Cleaning
  const clearExperiments = () => dispatch({ type: CLEAR_EXPERIMENTS });
  //const cleanGraphData = () => dispatch({ type: CLEAN_GRAPH_DATA });

  const cleanFileStatusData = () => dispatch({ type: CLEAN_FILE_STATUS_DATA })

  const cleanRunData = () => dispatch({ type: CLEAN_RUN_DATA });

  const cleanPerformanceMetrics = () =>
    dispatch({ type: CLEAN_PERFORMANCE_METRICS });

  const cleanExperimentData = () => dispatch({ type: CLEAN_EXPERIMENT_DATA });

  // Set Loading
  const setLoading = () => dispatch({ type: SET_LOADING });
  const setLoadingRun = () => dispatch({ type: SET_LOADING_RUN });
  const setLoadingState = () => dispatch({ type: SET_LOADING_STATE });
  const setLoadingSummary = (summExpid) =>
    dispatch({ type: SET_LOADING_SUMMARY, payload: summExpid });
  const setLoadingPerformanceMetrics = () =>
    dispatch({ type: LOADING_PERFORMANCE_METRICS });
  const setLoadingJobHistory = () => dispatch({ type: LOADING_JOB_HISTORY });
  const setLoadingExperimentRuns = () => dispatch({ type: LOADING_EXPERIMENT_RUNS });
  // Action Things
  const updateExperimentTimeStamp = (timeStamp) => {
    //console.log(timeStamp);
    dispatch({ type: UPDATE_EXPERIMENT_TS, payload: timeStamp });
  };

  // Updates for the Selection Tool
  // source: Tree, Graph
  const updateCurrentSelectedTree = (selectedJob, treedata) => {
    debug && console.log(treedata);
    if (treedata) {
      let currentNode = { name: selectedJob, color: "yellow", source: "Tree" };
      const selectedNode = treedata.jobs.find(
        (job) => job.id === currentNode.name
      );
      currentNode.color = selectedNode.status_color;
      dispatch({
        type: UPDATE_SELECTED_JOBS,
        payload: currentNode,
      });
    }
  };

  const updateCurrentSelectedGraph = (selectedJob, data) => {
    // console.log(data);
    // console.log(selectedJob);
    if (data) {
      let currentNode = { name: selectedJob, color: "yellow" };
      const selectedNode = data.nodes.find((node) => {
        return node.id === currentNode.name;
      });
      currentNode.color = selectedNode.status_color;
      dispatch({ type: UPDATE_SELECTED_JOBS, payload: currentNode });
    }
  };

  const setAutoUpdateRun = (value) =>
    dispatch({ type: SET_AUTOUPDATE_RUN, payload: value });

  const activateSelectionMode = () =>
    dispatch({ type: ACTIVATE_SELECTION_MODE });
  const deactivateSelectionMode = () =>
    dispatch({ type: DEACTIVATE_SELECTION_MODE });
  const removeSelectedJob = (name) =>
    dispatch({ type: REMOVE_SELECTED_JOB, payload: name });

  return (
    <ExperimentContext.Provider
      value={{
        experiments: state.experiments,
        experiment: state.experiment,
        summaries: state.summaries,
        loadingSummary: state.loadingSummary,
        loading: state.loading,
        loadingRun: state.loadingRun,
        loadingState: state.loadingState,
        loadingPerformance: state.loadingPerformance,
        jobHistory: state.jobHistory,
        joblog: state.joblog,
        performancedata: state.performancedata,
        experimentRuns: state.experimentRuns,
        rundata: state.rundata,
        currentSelected: state.currentSelected,
        startAutoUpdateRun: state.startAutoUpdateRun,
        experimentRunning: state.experimentRunning,
        currentCommand: state.currentCommand,
        currentTextCommand: state.currentTextCommand,
        canSelect: state.canSelect,
        totalJobs: state.totalJobs,
        animal: state.animal,
        expectedLoadingTreeTime: state.expectedLoadingTreeTime,
        expectedLoadingQuickView: state.expectedLoadingQuickView,
        experimentRunDetailForTree: state.experimentRunDetailForTree,   
        esarchiveStatus: state.esarchiveStatus,     
        setAutoUpdateRun,
        searchExperiments,
        getCurrentRunning,
        clearExperiments,
        getExperiment,
        cleanPerformanceMetrics,
        cleanRunData,
        getExperimentRun,
        timeStampToDate,
        getRunningState,
        getExperimentPerformanceMetrics,
        getExperimentSummary,
        clearSummary,
        getSummaries,
        activateSelectionMode,
        deactivateSelectionMode,
        removeSelectedJob,
        setCurrentCommand,
        setCurrentTextCommand,
        updateCurrentSelectedGraph,
        updateCurrentSelectedTree,
        updateExperimentTimeStamp,
        cleanExperimentData,
        getJobHistory,
        getExperimentRuns,
        getFileStatus,
        getJobLog,
        cleanFileStatusData,
      }}
    >
      {props.children}
    </ExperimentContext.Provider>
  );
};

export default ExperimentState;
