import {
    SEARCH_EXPERIMENTS,
    SET_LOADING,
    CLEAR_EXPERIMENTS,
    GET_EXPERIMENT,
    GET_GRAPH,
    GET_TREE,
    GET_GRAPH_GROUPED,
    SET_LOADING_TREE,
    SET_LOADING_GRAPH,
    CLEAN_GRAPH_DATA,
    CLEAN_RUN_DATA,
    CLEAN_TREE_DATA,
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
    GET_RUNNING_STATE,
    SET_LOADING_STATE,
    SET_FANCYTREE,
    SET_LOADING_FILTER,
    FILTER_TREEVIEW_FAILED,
    UPDATE_SELECTION_TREE,
    CLEAR_FILTER_TREE,
    CURRENT_RUNNING,
    SET_LOADING_JOB_MONITOR,
    SET_LOADING_TREE_REFRESH,
    PKL_TREE_LOADED,
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
                experimentRunning: false,
                experiment: null,
                current_grouped: 'none',
                current_layout: 'standard',
                allowJobMonitor: false,
                //startAutoUpdatePkl: false,
            };
        case CLEAN_TREE_DATA:
            return {
                ...state,
                treedata: null,
                enabledGraphSearch: true,
                loadingTree: false, 
                fancyTree: null,    
                returnFiler: 0,           
            }
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
                startAutoUpdatePkl: false,
                selection: null,
            };
        case UPDATE_SELECTION:
            return {
                ...state,
                selection: action.payload,
            };
        case UPDATE_SELECTION_TREE:
            return {
                ...state,
                selectedTreeNode: action.payload,
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
        case SET_LOADING_STATE:
            return {
                ...state,
                loadingState: true,
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
        case SET_LOADING_TREE:
            return {
                ...state,                
                loadingTree: true,                
                enabledGraphSearch: false,
            };
        case SET_LOADING_RUN:
            return {
                ...state,
                loadingRun: true,                
            };
        case SET_LOADING_JOB_MONITOR:
            return {
                ...state,
                loadingJobMonitor: true,
            };
        case SET_LOADING_TREE_REFRESH:
            return {
                ...state,
                loadingTreeRefresh: true,
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
            const { resdata, grouped, layout } = action.payload;
            return {
                ...state,
                data : resdata,
                current_grouped: grouped,
                current_layout: layout,
                loadingGraph: false,
                enabledGraphSearch: true,                
            };
        case GET_TREE:
            return {
                ...state,
                treedata: action.payload,
                loadingTree: false,
                enabledGraphSearch: true,
            };
        case GET_GRAPH_GROUPED:
            return {
                ...state,
                data: action.payload,
                loadingGraph: false,
                enabledGraphSearch: true,
                isGrouped: true,
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
                loadingJobMonitor: false,
            };
        case PKL_TREE_LOADED:
            return {
                ...state,
                loadingTreeRefresh: false,
            };
        case GET_RUNNING_STATE:
            return {
                ...state,
                experimentRunning: action.payload,
                loadingState: false,
            }
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
        case SET_FANCYTREE:
            return {
                ...state,
                fancyTree: action.payload,
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
        case SET_LOADING_FILTER:
            return {
                ...state,
                loadingFilterTree: true,
            };
        case FILTER_TREEVIEW_FAILED:
            return {
                ...state,
                loadingFilterTree: false,
                returnFilter: action.payload,
            }
        case CLEAR_FILTER_TREE:
            return {
                ...state,
                returnFilter: 0,
            }
        default:
            return null;
    };
};

  