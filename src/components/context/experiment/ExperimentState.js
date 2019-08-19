import React, { useReducer } from 'react';
import axios from 'axios';
import ExperimentContext from './experimentContext';
import ExperimentReducer from './experimentReducer';
import {
  SEARCH_EXPERIMENTS,
  SET_LOADING,
  CLEAR_EXPERIMENTS,
  GET_EXPERIMENT,
  GET_GRAPH,
  SET_LOADING_GRAPH,
  CLEAN_GRAPH_DATA,
  UPDATE_SELECTION,
  GET_EXPERIMENT_RUN,
  SET_LOADING_RUN,
  CLEAN_RUN_DATA,
  SET_AUTOUPDATE_RUN,
} from '../types';

const ExperimentState = props => {
    const initialState = {
        experiments: [],
        experiment: {},
        loading: false,
        data: null,
        rundata: null,
        loadingGraph: false,
        loadingRun: false,
        selection: null,
        enabledGraphSearch: true,  
        startAutoUpdateRun: false,      
    }

    const [state, dispatch] = useReducer(ExperimentReducer, initialState);

    // Search Experiments
    const searchExperiments = async text => {
        setLoading();
        const res = await axios.get(`http://84.88.185.94:8888/search/${text}`);
        dispatch({
            type: SEARCH_EXPERIMENTS,
            payload: res.data.experiment,
        });
      };

    // Get Experiment
    const getExperiment = async expid => {
        setLoading();
        //cleanGraphData();
        const res = await axios.get(`http://84.88.185.94:8888/expinfo/${expid}`);        
        dispatch({
            type: GET_EXPERIMENT,
            payload: res.data,
        });
      };
    
    // Get Experiment Graph
    const getExperimentGraph = async expid => {
        setLoadingGraph();
        
        const res = await axios.get(`http://84.88.185.94:8888/graph/${expid}`);
        console.log(res.data);
        dispatch({
            type: GET_GRAPH,
            payload: res.data,
        });
        //this.setState({ data: res.data, loading: false, showGraph: !res.data.error });
      };

    // Get Experiment Run
    const getExperimentRun = async expid => {
        setLoadingRun();
        const res = await axios.get(`http://84.88.185.94:8888/exprun/${expid}`);
        console.log(res.data);
        dispatch({
            type: GET_EXPERIMENT_RUN,
            payload: res.data,
        });
    }

    // Cleaning
    const clearExperiments = () => dispatch({ type: CLEAR_EXPERIMENTS });
    const cleanGraphData = () => dispatch({ type: CLEAN_GRAPH_DATA });
    const cleanRunData = () => dispatch({ type: CLEAN_RUN_DATA });

    // Set Loading
    const setLoading = () => dispatch({ type: SET_LOADING });
    const setLoadingGraph = () => dispatch({ type: SET_LOADING_GRAPH });
    const setLoadingRun = () => dispatch({ type: SET_LOADING_RUN });



    // Action Things
    const updateSelection = (currentSelection) => dispatch({ type: UPDATE_SELECTION, payload: currentSelection });
    const setAutoUpdateRun = () => dispatch({ type: SET_AUTOUPDATE_RUN });

    // Other Utils
    const hashCode = (value) => {
        var hash = 0, i, chr;
        if (value.length === 0) return hash;
        for (i = 0; i < value.length; i++) {
          chr   = value.charCodeAt(i);
          hash  = ((hash << 5) - hash) + chr;
          hash |= 0; // Convert to 32bit integer
        }
        console.log(hash);
        return hash;
      };

    return (
        <ExperimentContext.Provider
        value ={{
            experiments: state.experiments,
            experiment: state.experiment,
            loading: state.loading,
            loadingGraph: state.loadingGraph,
            loadingRun: state.loadingRun,
            data: state.data,
            rundata: state.rundata,
            selection: state.selection,
            enabledGraphSearch: state.enabledGraphSearch,
            startAutoUpdateRun: state.startAutoUpdateRun,
            setAutoUpdateRun,
            searchExperiments,
            clearExperiments,
            getExperiment,
            getExperimentGraph,
            cleanGraphData, 
            cleanRunData,
            updateSelection,
            getExperimentRun,            
            hashCode       
        }}>
            {props.children}
        </ExperimentContext.Provider>
    );
};

export default ExperimentState;