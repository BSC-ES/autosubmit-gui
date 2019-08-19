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
} from '../types';

export default (state, action) => {
    switch (action.type) {
        case CLEAN_GRAPH_DATA:
            return {
                ...state,
                data: null,
                selection: null,
            };
        case CLEAN_RUN_DATA:
            return {
              ...state,
              rundata: null,  
              startAutoUpdateRun: false,
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
                startAutoUpdateRun: true,
            };
        case SET_LOADING:
            return {
                ...state,
                loading: true,
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
        default:
            return null;
    };
};

  