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
} from '../types';

const ExperimentState = props => {
    const initialState = {
        experiments: [],
        experiment: {},
        loading: false,
        data: null,
        loadingGraph: false,
        selection: null,
        enabledGraphSearch: true,
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

    // Cleaning
    const clearExperiments = () => dispatch({ type: CLEAR_EXPERIMENTS });
    const cleanGraphData = () => dispatch({ type: CLEAN_GRAPH_DATA });

    // Set Loading
    const setLoading = () => dispatch({ type: SET_LOADING });
    const setLoadingGraph = () => dispatch({ type: SET_LOADING_GRAPH});

    // Action Things
    const updateSelection = (currentSelection) => dispatch({ type: UPDATE_SELECTION, payload: currentSelection });



    return (
        <ExperimentContext.Provider
        value ={{
            experiments: state.experiments,
            experiment: state.experiment,
            loading: state.loading,
            loadingGraph: state.loadingGraph,
            data: state.data,
            selection: state.selection,
            enabledGraphSearch: state.enabledGraphSearch,
            searchExperiments,
            clearExperiments,
            getExperiment,
            getExperimentGraph,
            cleanGraphData, 
            updateSelection,         
        }}>
            {props.children}
        </ExperimentContext.Provider>
    );
};

export default ExperimentState;