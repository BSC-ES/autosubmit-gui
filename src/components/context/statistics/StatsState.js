import React, { useReducer } from 'react';
import axios from 'axios';
import StatsContext from './statsContext';
import StatsReducer from './statsReducer';
import {
    SET_LOADING,
    GET_EXPERIMENT_STATS,
    CLEAR_STATS,
    SET_ERROR_STATS,
} from '../types';


const StatsState = props => {
    const initialState = {
        loading: false,
        statdata: null,
        isError: false,
        errorMessage: "",
    }

    const [state, dispatch] = useReducer(StatsReducer, initialState);

    // Get Experiment Stats
    const getExperimentStats = async (expid,hours,type)  => {
        if (hours.length === 0){
            hours = 0;
        }
        if (type.length === 0){
            type = 'Any';
        }

        setLoading();
        //cleanGraphData();
        const res = await axios.get(`http://84.88.185.30:8888/stats/${expid}/${hours}/${type}`);        
        let result = [];
        console.log(res.data);
        if (res.data) {
            if (res.data.error === true){
                setIsError(true, res.data.error_message);
            }
            else {
                setIsError(false, "");
            }
            
            result.push(["name","Queued","Run","Failed Jobs","Failed Queued","Fail Run"])
            
            for (var i = 0; i < res.data.jobs.length; i++){
                result.push([
                    res.data.jobs[i], 
                    res.data.stats.queued[i],
                    res.data.stats.run[i],
                    res.data.stats.failed_jobs[i],
                    res.data.stats.fail_queued[i],
                    res.data.stats.fail_run[i]
                ]);
            }            
        }
        console.log(result);
        dispatch({
            type: GET_EXPERIMENT_STATS,
            payload: result,
        });
    };

    // Clear stats data
    const clearStats = () => dispatch({ type: CLEAR_STATS })

    const setLoading = () => dispatch({ type: SET_LOADING });

    const setIsError = ( error, msg ) => {
        dispatch({
            type: SET_ERROR_STATS,
            payload: { error, msg }
        });
    };



    return (
        <StatsContext.Provider
            value={{
                loading: state.loading,
                statdata: state.statdata,
                isError: state.isError,
                errorMessage: state.errorMessage,
                getExperimentStats,
                clearStats,
            }}>
            {props.children}
        </StatsContext.Provider>
    );
};

export default StatsState;