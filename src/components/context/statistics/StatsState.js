import React, { useReducer } from 'react';
//import axios from 'axios';
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
        ticksdata: null,
        isError: false,
        totaldata: null,
        errorMessage: "",
    }

    //const localserver = 'http://192.168.11.91:8081'
    //const localserver= 'http://84.88.185.94:8081'
    

    const [state, dispatch] = useReducer(StatsReducer, initialState);

    // Get Experiment Stats
    const getExperimentStats = async (expid,hours,type)  => {
        console.log("Getting...")
        if (hours.length === 0){
            hours = 0;
        }
        if (type.length === 0){
            type = 'Any';
        }

        setLoading();
        //cleanGraphData();
        const res = require('../data/statistics_'+expid+'.json');
        //const res = await axios.get(`${localserver}/stats/${expid}/${hours}/${type}`);        
        let result = [];
        var requestResult = null;
        let ticks = [];
        console.log(res);
        if (res) {
            if (res.error === true){
                setIsError(true, res.error_message);
            }
            else {
                setIsError(false, "");
            }
            
            result.push(['Jobs',"Queued","Run","Failed Jobs","Failed Queued","Fail Run"])
            
            for (var i = 0; i < res.jobs.length; i++){
                result.push([
                    {v: i+1, f: res.jobs[i]}, 
                    res.stats.queued[i],
                    res.stats.run[i],
                    res.stats.failed_jobs[i],
                    res.stats.fail_queued[i],
                    res.stats.fail_run[i]
                ]);
                ticks.push({v: i+1, f: res.jobs[i]});
            }            
            requestResult = res;
        }
        //console.log(ticks);
        dispatch({
            type: GET_EXPERIMENT_STATS,
            payload: { result, requestResult, ticks }
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
                totaldata: state.totaldata,
                ticksdata: state.ticksdata,
                getExperimentStats,
                clearStats,
            }}>
            {props.children}
        </StatsContext.Provider>
    );
};

export default StatsState;