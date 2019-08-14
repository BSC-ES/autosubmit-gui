import {
    SEARCH_EXPERIMENTS,
    SET_LOADING,
    CLEAR_EXPERIMENTS,
    GET_EXPERIMENT,
    GET_GRAPH,
    SET_LOADING_GRAPH,
    CLEAN_GRAPH_DATA,
    UPDATE_SELECTION,
} from '../types';

export default (state, action) => {
    switch (action.type) {
        case CLEAN_GRAPH_DATA:
            return {
                ...state,
                data: null,
                selection: null,
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
        case SET_LOADING:
            return {
                ...state,
                loading: true,
            };
        case SET_LOADING_GRAPH:
            return {
                ...state,
                loadingGraph: true,
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
            };
        default:
            return null;
    };
};

  