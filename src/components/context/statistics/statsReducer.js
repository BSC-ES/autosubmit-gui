import { 
    SET_LOADING,
    GET_EXPERIMENT_STATS,
    CLEAR_STATS,
    SET_ERROR_STATS,
    SET_FILTER_CHART
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
            const { result, totalData } = action.payload;
            // console.log(result);
            return {
                ...state,
                statdata: result,
                totaldata: totalData,
                backupdata: result,
                loading: false,
            };
        case CLEAR_STATS:
            return {
                ...state,
                statdata: null,
                totaldata: null,
                backupdata: null,
                loading: false,
                isError: false,
                errorMessage: "",
            };
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
            console.log(currentChecked);
            console.log(target);
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
                        console.log(state.backupdata);
                        newStatData = state.backupdata;
                        newStatData.forEach(element => {
                            element.queue = 0;
                        });
                        break;
                    default:
                        newStatData = null;
                }
            }
            console.log(newStatData);
            return {
                ...state,
                statdata: newStatData,
            }
        default:
            return state;
    }
  };