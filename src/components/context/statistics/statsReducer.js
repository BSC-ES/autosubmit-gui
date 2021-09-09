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
                filterAppliedCount: 0,
                filteredStatdata: displayJobStatistics,
                timeframe: Period,
                loading: false,
            };
        case CLEAR_STATS:
            return {
                ...state,
                statdata: null,
                filteredStatdata: null,
                loading: false,
                isError: false,
                timeframe: null,
                errorMessage: "",
                filterAppliedCount: 0,
            };
        case APPLY_FILTER:
            {
                const { regularExpression } = action.payload;
                if (state.statdata) {    
                    // console.log(regularExpression);   
                    if (String(regularExpression).trim().length === 0) {                        
                        const totalData = state.statdata;
                        return {
                            ...state,
                            filteredStatdata: totalData,
                            filterAppliedCount: 0,
                        }
                    }            
                    const re = RegExp(regularExpression, 'i');                    
                    const filteredDataSet = state.statdata.filter(job => {                    
                        return re.test(job.name);
                    });                    
                    const filterCount = state.filterAppliedCount + 1;                    
                    return {
                        ...state,
                        filteredStatdata: filteredDataSet,
                        filterAppliedCount: filterCount,
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