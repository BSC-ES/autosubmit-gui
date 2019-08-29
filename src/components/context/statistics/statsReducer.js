import { 
    SET_LOADING,
    GET_EXPERIMENT_STATS,
    CLEAR_STATS,
    SET_ERROR_STATS, } from '../types';

export default (state, action) => {
    switch (action.type) {
        case SET_LOADING:
            return {
                ...state,
                loading: true,
            };
        case GET_EXPERIMENT_STATS:
            return {
                ...state,
                statdata: action.payload,
                loading: false,
            };
        case CLEAR_STATS:
            return {
                ...state,
                statdata: null,
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
        default:
            return state;
    }
  };