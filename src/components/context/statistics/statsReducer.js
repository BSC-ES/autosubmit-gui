import { 
    SET_LOADING,
    GET_EXPERIMENT_STATS,
    CLEAR_STATS,
    SET_ERROR_STATS,
    SET_FILTER_CHART,
    APPLY_FILTER,
 } from '../types';

/* eslint import/no-anonymous-default-export: ["error", {"allowArrowFunction": true}] */
export default (state, action) => {
    switch (action.type) {
        case SET_LOADING:
            return {
                ...state,
                loading: true,
            };
        case GET_EXPERIMENT_STATS:
            const { statistics } = action.payload;
            const { JobStatistics, Period } = statistics;
            let displayJobStatistics = [];
            JobStatistics.map(job => displayJobStatistics.push(job));
            // console.log(result);
            return {
                ...state,
                statdata: JobStatistics,
                displayStatdata: displayJobStatistics,
                timeframe: Period,
                loading: false,
            };
        case CLEAR_STATS:
            return {
                ...state,
                statdata: null,
                displayStatdata: null,
                loading: false,
                isError: false,
                timeframe: null,
                errorMessage: "",
            };
        case APPLY_FILTER:
            {
                const { regularExpression } = action.payload;
                if (state.statdata && state.backupdata) {                    
                    const re = RegExp(regularExpression);                    
                    const filteredDataSet = state.backupdata.filter(job => {                    
                        return re.test(job.name);
                    });                    
                    return {
                        ...state,
                        statdata: filteredDataSet,
                    }
                }
                return {
                    ...state,
                }
            }
        case SET_ERROR_STATS:
            const { error, msg } = action.payload;
            return {
                ...state,
                isError: error,
                errorMessage: msg,
            }
        case SET_FILTER_CHART:
            const { currentChecked, target } = action.payload;
            let newStatData = null;
            // console.log(currentChecked);
            // console.log(target);
            if ( currentChecked === true) {
                switch (target) {
                    case "queue":
                        newStatData = state.backupdata;
                        break;
                    default:
                        newStatData = null;
                }            
            } else {
                switch (target) {
                    case "queue":
                        //let backup = state.backupdata;
                        // console.log(state.backupdata);
                        newStatData = state.backupdata;
                        newStatData.forEach(element => {
                            element.queue = 0;
                        });
                        break;
                    default:
                        newStatData = null;
                }
            }
            // console.log(newStatData);
            return {
                ...state,
                statdata: newStatData,
            }
        default:
            return state;
    }
  };