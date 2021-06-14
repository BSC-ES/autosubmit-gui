import {
  SEARCH_EXPERIMENTS,
  SEARCH_BY_OWNER,
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
  GET_JOB_LOG,
  SET_CURRENT_UPDATE_DESCRIP_COMMAND,
  VERIFY_TOKEN_DATA,
  SET_LOGGED_USER,
  UPDATE_DESCRIPTION_OWN_EXP,
  GET_LOG_RUNNING_DATA,
  SET_PAGINATED_RESULT,
  SET_CURRENT_PAGE,
  ORDER_EXPERIMENTS_RESULT
} from "../types";

import {
  approximateLoadingTreeTime,
  approximateLoadingQuickView,
  normalizeString,
  normalizeInt
} from "../utils";

import { pageSize, orderByType } from "../vars";

/* eslint import/no-anonymous-default-export: ["error", {"allowArrowFunction": true}] */
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
        joblog: null,
        currentUpdateDescripCommand: null,
        logTimeDiff: 0,
        currentLog: null,
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
      {
        const experiments = action.payload;
        if (experiments) {
          experiments.sort((a, b) => (a.status > b.status ? -1 : 1));
        }
        return {
          ...state,
          experiments: experiments,
          loading: false,
        };
      }
    case SEARCH_BY_OWNER:
      {
        const experiments = action.payload;
        if (experiments) {
          experiments.sort((a, b) => (a.status > b.status ? -1 : 1));
        }
        return {
          ...state,
          experiments: experiments,
          loading: false,
        }
      }
    case CURRENT_RUNNING:
      {
        const experiments = action.payload;
        if (experiments){
          experiments.sort((a, b) => (a.status > b.status ? -1 : 1));
        }
        return {
          ...state,
          experiments: experiments,
          loading: false,
        };
      }
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
        experimentsInPage: [],
        summaries: [],
        loading: false,
        currentPage: 1,
        numberPages: 0,
      };
    case ORDER_EXPERIMENTS_RESULT:
      {
        const orderType = action.payload;
        let currentResult = state.experiments;
        if (currentResult && currentResult.length > 0){
          switch(orderType) {
            case orderByType.wrapper:              
              currentResult.sort((a,b) => normalizeString(a.wrapper) < normalizeString(b.wrapper) ? 1 : -1);
              break;
            case orderByType.total:
              currentResult.sort((a,b) => { return normalizeInt(b.total) - normalizeInt(a.total) })
              break;
            case orderByType.completed: 
              currentResult.sort((a,b) => { return normalizeInt(b.completed) - normalizeInt(a.completed) })
              break;
            case orderByType.running:
              currentResult.sort((a,b) => { return normalizeInt(b.running) - normalizeInt(a.running) })
              break;
            case orderByType.queuing:
              currentResult.sort((a,b) => { return normalizeInt(b.queuing) - normalizeInt(a.queuing) })
              break;
            case orderByType.failed:
              currentResult.sort((a,b) => { return normalizeInt(b.failed) - normalizeInt(a.failed) })
              break;
            default:
              break;
          }
        }        
        // console.log(currentResult);
        return {
          ...state,
          experiments: currentResult,
          pageSetup: true,
        }
      }      
    case GET_EXPERIMENT:      
      const { total_jobs, owner } = action.payload;
      const whichAnimal = owner === "molid" ? 1 : Math.floor(Math.random()*3)+1; 
      return {
        ...state,
        experiment: action.payload,
        loading: false,
        totalJobs: total_jobs,
        expectedLoadingTreeTime: approximateLoadingTreeTime(total_jobs),
        expectedLoadingQuickView: approximateLoadingQuickView(total_jobs),
        data: null,
        canSelect: false,
        animal: whichAnimal,
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
      //console.log(action.payload);
      const { running } = action.payload;
      return {
        ...state,
        experimentRunning: running,
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
        currentTextCommand: null,
        joblog: null,
      };
    case SET_CURRENT_COMMAND:
      return {
        ...state,
        currentCommand: action.payload,        
      };
    case SET_CURRENT_UPDATE_DESCRIP_COMMAND:
      return {
        ...state,
        currentUpdateDescripCommand: action.payload,
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
        currentTextCommand: null,
      };
    case GET_JOB_LOG:
      return {
        ...state,
        joblog: action.payload,
      }
    case GET_LOG_RUNNING_DATA:
      const { timediff, log_path } = action.payload;
      return {
        ...state,
        logTimeDiff: timediff,
        currentLog: log_path,
      }
    case VERIFY_TOKEN_DATA:
      {
        const { authenticated, user, token } = action.payload;
        if (authenticated === true){
          localStorage.setItem('user', user);
          localStorage.setItem('token', token);
        }  else {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }    
        return {
          ...state,
          loggedUser: authenticated ? user : 'Failed', 
          currentToken: authenticated ? token : null,    
        }
      }
    case SET_LOGGED_USER:
      {
        const { user, token } = action.payload;
        return {
          ...state,
          loggedUser: user,
          currentToken: token,
        }
      }
    case UPDATE_DESCRIPTION_OWN_EXP:
      {
        const { error, auth, description, expid } = action.payload;
        const loggedUser = auth ? state.loggedUser : null;
        const currentToken = auth ? state.currentToken : null;
        const experiment = state.experiment;
        if (error === false && description){
          experiment.description = description;
        }
        if (auth === false) {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
        if (state.experiments){
          state.experiments.find((exp) => {
            if (exp.name === expid){
              exp.description = description;
              //console.log(exp);
              return exp;
            }
            return false;            
          })          
        }
        return {
          ...state,
          loggedUser: loggedUser,
          experiment: experiment,
          currentToken: currentToken,
        }
      }
    case SET_PAGINATED_RESULT:
      {
        const experiments = state.experiments;
        const currentPage = state.currentPage;
        const numberPages = experiments ? Math.ceil(experiments.length/pageSize) : 0;
        const experimentsInPage = [];
        let resultCount = 0;
        experiments.map((item, index) => {        
          resultCount += 1;
          if ((index >= (currentPage - 1)*pageSize) && (index < (currentPage*pageSize))){
            experimentsInPage.push(item);
          };
          return null;
        });
        return {
          ...state,
          experimentsInPage: experimentsInPage,
          pageResultCount: resultCount,
          numberPages: numberPages,
          pageSetup: false,
        }
      }
    case SET_CURRENT_PAGE:
      return {
        ...state,
        currentPage: action.payload,
      }
    default:
      return null;
  }
};
