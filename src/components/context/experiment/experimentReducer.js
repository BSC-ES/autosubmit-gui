import {
  SEARCH_EXPERIMENTS,
  SET_LOADING,
  CLEAR_EXPERIMENTS,
  GET_EXPERIMENT,
  CLEAN_RUN_DATA,
  SET_LOADING_RUN,
  GET_EXPERIMENT_RUN,
  SET_AUTOUPDATE_RUN,
  GET_RUNNING_STATE,
  SET_LOADING_STATE,
  UPDATE_EXPERIMENT_TS,
  CURRENT_RUNNING,
  GET_EXPERIMENT_SUMMARY,
  CLEAR_SUMMARY_EXP,
  GET_EXPERIMENT_PERFORMANCE,
  CLEAN_PERFORMANCE_METRICS,
  ACTIVATE_SELECTION_MODE,
  DEACTIVATE_SELECTION_MODE,
  UPDATE_SELECTED_JOBS,
  REMOVE_SELECTED_JOB,
  SET_CURRENT_COMMAND,
  SET_LOADING_SUMMARY,
  CLEAN_EXPERIMENT_DATA,
  LOADING_PERFORMANCE_METRICS,
  GET_JOB_HISTORY,
  LOADING_JOB_HISTORY,
  LOADING_EXPERIMENT_RUNS,
  GET_EXPERIMENT_RUNS,
  GET_FILE_STATUS,
  CLEAN_FILE_STATUS_DATA,
  SET_CURRENT_TEXT_COMMAND,
} from "../types";

import {
  approximateLoadingTreeTime,
  approximateLoadingQuickView,
} from "../utils";

export default (state, action) => {
  switch (action.type) {
    case ACTIVATE_SELECTION_MODE:
      return {
        ...state,
        canSelect: true,
        currentSelected: [],
        currentCommand: null,
        currentTextCommand: null,
      };
    case DEACTIVATE_SELECTION_MODE:
      return {
        ...state,
        canSelect: false,
        currentSelected: [],
        currentCommand: null,
        currentTextCommand: null,
      };
    case CLEAN_RUN_DATA:
      return {
        ...state,
        rundata: null,
        startAutoUpdateRun: false,
      };
    case CLEAN_EXPERIMENT_DATA: {
      return {
        ...state,
        experiment: null,
        loading: false,
        totalJobs: 0,
        expectedLoadingTreeTime: 0,
        expectedLoadingQuickView: 0,
        data: null,
        canSelect: false,
      };
    }
    case CLEAN_FILE_STATUS_DATA:
      return {
        ...state,
        esarchiveStatus: null,
      };
    case LOADING_JOB_HISTORY:
      return {
        ...state,
        jobHistory: null,
      };
    case GET_JOB_HISTORY:
      return {
        ...state,
        jobHistory: action.payload,
      };
    case GET_FILE_STATUS:
      return {
        ...state,
        esarchiveStatus: action.payload,
      };
    case LOADING_EXPERIMENT_RUNS:
      return {
        ...state,
        experimentRuns: null,
        loadingExperimentRuns: true,
      }
    case GET_EXPERIMENT_RUNS:
      return {
        ...state,
        experimentRuns: action.payload,
        loadingExperimentRuns: false,
      }
    case UPDATE_EXPERIMENT_TS:
      //const { experiment } = state;
      const pkl_timestamp = action.payload;
      state.experiment.pkl_timestamp = pkl_timestamp;
      return {
        ...state,
      };
    case SEARCH_EXPERIMENTS:
      return {
        ...state,
        experiments: action.payload,
        loading: false,
      };
    case CURRENT_RUNNING:
      return {
        ...state,
        experiments: action.payload,
        loading: false,
      };
    case SET_AUTOUPDATE_RUN:
      return {
        ...state,
        startAutoUpdateRun: action.payload,
      };
    case SET_LOADING:
      return {
        ...state,
        loading: true,
      };
    case SET_LOADING_STATE:
      return {
        ...state,
        loadingState: true,
      };
    case SET_LOADING_RUN:
      return {
        ...state,
        loadingRun: true,
      };
    case CLEAR_EXPERIMENTS:
      return {
        ...state,
        experiments: [],
        summaries: [],
        loading: false,
      };

    case GET_EXPERIMENT:
      const { total_jobs } = action.payload;
      return {
        ...state,
        experiment: action.payload,
        loading: false,
        totalJobs: total_jobs,
        expectedLoadingTreeTime: approximateLoadingTreeTime(total_jobs),
        expectedLoadingQuickView: approximateLoadingQuickView(total_jobs),
        data: null,
        canSelect: false,
      };
    case SET_LOADING_SUMMARY: {
      const expid = action.payload;
      state.loadingSummary.set(expid, { loading: true });
      return {
        ...state,
      };
    }
    case GET_EXPERIMENT_SUMMARY: {
      // const { summaries, summary, expid } = action.payload;
      // summaries.push({ key: expid, value: summary });
      const { expid, summary } = action.payload;
      state.summaries[expid] = summary;
      state.loadingSummary.delete(expid);
      return {
        ...state,
      };
    }
    case CLEAR_SUMMARY_EXP: {
      const expid = action.payload;
      if (state.summaries[expid]) {
        state.summaries[expid] = null;
      }
      return {
        ...state,
      };
    }
    case GET_EXPERIMENT_PERFORMANCE:
      return {
        ...state,
        performancedata: action.payload,
        loadingPerformance: false,
      };
    case CLEAN_PERFORMANCE_METRICS:
      return {
        ...state,
        performancedata: null,
      };

    case GET_EXPERIMENT_RUN:
      return {
        ...state,
        rundata: action.payload,
        loadingRun: false,
      };

    case GET_RUNNING_STATE:
      return {
        ...state,
        experimentRunning: action.payload,
        loadingState: false,
      };
    case UPDATE_SELECTED_JOBS:
      const currentNode = action.payload;
      const existingJob = state.currentSelected.find(
        (job) => job.name === currentNode.name
      );
      if (state.canSelect === false || existingJob) {
        return {
          ...state,
        };
      }
      return {
        ...state,
        currentSelected: [...state.currentSelected, currentNode],
        currentCommand: null,
      };
    case SET_CURRENT_COMMAND:
      return {
        ...state,
        currentCommand: action.payload,
      };
    case SET_CURRENT_TEXT_COMMAND:
      return {
        ...state,
        currentTextCommand: action.payload,
      };
    case LOADING_PERFORMANCE_METRICS:
      return {
        ...state,
        loadingPerformance: true,
      };
    case REMOVE_SELECTED_JOB:
      const name = action.payload;
      let current = [];
      for (var i = 0; i < state.currentSelected.length; i++) {
        if (state.currentSelected[i].name !== name) {
          current.push(state.currentSelected[i]);
        }
      }
      state.currentSelected.find((job) => job.name === name);
      return {
        ...state,
        currentSelected: current,
        currentCommand: null,
      };
    default:
      return null;
  }
};
