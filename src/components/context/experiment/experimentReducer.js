import {
    SEARCH_EXPERIMENTS,
    SET_LOADING,
    CLEAR_EXPERIMENTS,
    GET_EXPERIMENT,
    GET_GRAPH,
    SET_LOADING_GRAPH,
    CLEAN_GRAPH_DATA,
    CLEAN_RUN_DATA,
    UPDATE_SELECTION,
    SET_LOADING_RUN,
    GET_EXPERIMENT_RUN,
    SET_AUTOUPDATE_RUN,
    GET_PKL_DATA,
    SET_LOADING_PKL,
    UPDATE_NODES,
    SHOULD_UPDATE_GRAPH,
    SET_AUTOUPDATE_PKL,
    CLEAN_PKL_DATA,
    SET_PKL_CHANGES,
    UPDATE_EXPERIMENT_TS,
    SET_VIS_DATA,
    SET_VIS_NETWORK,
    SET_FOUND_NODES,
    SET_LOADING_SEARCH_JOB,
    CLEAN_NAV_DATA,
} from '../types';

export default (state, action) => {
    switch (action.type) {
        case CLEAN_GRAPH_DATA:
            return {
                ...state,
                data: null,
                selection: null,
                enabledGraphSearch: true,
                loadingGraph: false,
                loadingPkl: false,
                visNodes: null,
                visNetwork: null,
                foundNodes: null,
            };
        case CLEAN_RUN_DATA:
            return {
              ...state,
              rundata: null,  
              startAutoUpdateRun: false,
            };
        case CLEAN_PKL_DATA:
            return {
              ...state,
              shouldUpdateGraph: false,  
              startAutoUpdatePkl: false,
              pklchanges: null,
            };
        case CLEAN_NAV_DATA:
            return {
                ...state,
                foundNodes: null,
            };
        case UPDATE_SELECTION:
            return {
                ...state,
                selection: action.payload,
            };
        case SEARCH_EXPERIMENTS:
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
        case SET_AUTOUPDATE_PKL:
            return {
                ...state,
                startAutoUpdatePkl: action.payload,
            }
        case SET_LOADING:
            return {
                ...state,
                loading: true,
            };
        case SET_LOADING_PKL:
            return {
                ...state,
                loadingPkl: true,
            };
        case SET_LOADING_GRAPH:
            return {
                ...state,
                loadingGraph: true,
                enabledGraphSearch: false,
            };
        case SET_LOADING_RUN:
            return {
                ...state,
                loadingRun: true,                
            };
        case SHOULD_UPDATE_GRAPH:
            return {
                ...state,
                shouldUpdateGraph: action.payload,
            };
        case CLEAR_EXPERIMENTS:
            return {
                ...state,
                experiments: [],
                loading: false,
            };
        case GET_EXPERIMENT:
            return {
                ...state,                
                experiment: action.payload,
                loading: false,
                data: null,
            };
        case GET_GRAPH:
            return {
                ...state,
                data: action.payload,
                loadingGraph: false,
                enabledGraphSearch: true,
            };
        case GET_EXPERIMENT_RUN:
            return {
                ...state,
                rundata: action.payload,
                loadingRun: false,
            };
        case GET_PKL_DATA:
            return {
                ...state,
                pkldata: action.payload,
                loadingPkl: false,
            };
        case UPDATE_NODES:
            return {
                ...state,
                data: action.payload,
            };
        case UPDATE_EXPERIMENT_TS:
            return {
                ...state,
                experiment: action.payload,
            }
        case SET_PKL_CHANGES:
            return {
                ...state,
                pklchanges: action.payload,
            };
        case SET_VIS_DATA:
            return {
                ...state,
                visNodes: action.payload,
            };
        case SET_VIS_NETWORK:
            return {
                ...state,
                visNetwork: action.payload,
            };
        case SET_FOUND_NODES:
            return {
                ...state,
                loadingSearchJob: false,
                foundNodes: action.payload,
            };
        case SET_LOADING_SEARCH_JOB:
            return {
                ...state,
                loadingSearchJob: true,
            };
        default:
            return null;
    };
};

  