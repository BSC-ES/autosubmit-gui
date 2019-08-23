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
  GET_PKL_DATA,
  SET_LOADING_PKL,
  UPDATE_NODES,
  SHOULD_UPDATE_GRAPH,
  SET_AUTOUPDATE_PKL,
  CLEAN_PKL_DATA,
  SET_PKL_CHANGES,
  UPDATE_EXPERIMENT_TS,
} from '../types';

const ExperimentState = props => {
    const initialState = {
        experiments: [],
        experiment: {},
        loading: false,
        data: null,
        rundata: null,
        pkldata: null,
        pklchanges: null,
        loadingGraph: false,
        loadingRun: false,
        loadingPkl: false,
        selection: null,
        enabledGraphSearch: true,  
        startAutoUpdateRun: false,  
        startAutoUpdatePkl: false,
        shouldUpdateGraph: false,    
    }

    const [state, dispatch] = useReducer(ExperimentReducer, initialState);

    // Search Experiments
    const searchExperiments = async text => {
        setLoading();
        const res = await axios.get(`http://84.88.185.30:8888/search/${text}`);
        dispatch({
            type: SEARCH_EXPERIMENTS,
            payload: res.data.experiment,
        });
      };

    // Get Experiment
    const getExperiment = async expid => {
        setLoading();
        //cleanGraphData();
        const res = await axios.get(`http://84.88.185.30:8888/expinfo/${expid}`);        
        dispatch({
            type: GET_EXPERIMENT,
            payload: res.data,
        });
      };
    
    // Get Experiment Graph
    const getExperimentGraph = async expid => {
        setLoadingGraph();
        
        const res = await axios.get(`http://84.88.185.30:8888/graph/${expid}`);
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
        const res = await axios.get(`http://84.88.185.30:8888/exprun/${expid}`);
        console.log(res.data);
        dispatch({
            type: GET_EXPERIMENT_RUN,
            payload: res.data,
        });
    }

    // Get Experiment Pkl Data
    const getExperimentPkl = async (expid, timeStamp) => {
      setLoadingPkl();
      //timeStamp = 1000;
      const res = await axios.get(`http://84.88.185.30:8888/pklinfo/${expid}/${timeStamp}`);
      console.log(res.data);
      // const actualPkl = res.data;
      
      let retrievedPkl = null;
      var jobs = {}
      var changes = ""
      retrievedPkl = res.data;
      if (state.data !== null && retrievedPkl.has_changed === true && retrievedPkl.pkl_content.length > 0){
        //console.log(retrievedPkl.pkl_content.length);
        for(var j = 0, job; j < retrievedPkl.pkl_content.length; j++){
          job = retrievedPkl.pkl_content[j];
          //console.log(job);
          jobs[ job.name ] = job;
          //console.log(jobs[job.name]);
        }
        let requireUpdate = false;
        console.log('Current ts: '+ state.data.pkl_timestamp);        
        var newData = state.data;
        //console.log(newData.nodes);
        var expData = state.experiment;
        if (newData.nodes){
          for(var i = 0; i < newData.nodes.length; i++){
            // console.log(newNodes[i].id);
            //console.log(newData.nodes[i]);
            // console.log(jobs[ newNodes[i].id ]);

            if (newData.nodes[i].status_code !== jobs[ newData.nodes[i].id ].status_code){
              // changes += newData.nodes[i].id + " from " + newData.nodes[i].status + " to " + jobs[ newData.nodes[i].id ].status + " || ";
              changes += timeStampToDate(retrievedPkl.pkl_timestamp) + ": "+ newData.nodes[i].id + " to " + jobs[ newData.nodes[i].id ].status + "\n";
              newData.nodes[i].status_code = jobs[ newData.nodes[i].id ].status_code;
              newData.nodes[i].status_color = jobs[ newData.nodes[i].id ].status_color;
              newData.nodes[i].status = jobs[ newData.nodes[i].id ].status;
              //console.log(newData.nodes[i].status_color)
              requireUpdate = true;
            }
          }
          if (requireUpdate){            
            // console.log(newData.pkl_timestamp);
            // console.log(expData.pkl_timestamp);
            console.log("New ts: " + retrievedPkl.pkl_timestamp)
            newData.pkl_timestamp = retrievedPkl.pkl_timestamp;
            expData.pkl_timestamp = retrievedPkl.pkl_timestamp;
            // console.log(newData.pkl_timestamp);
            // console.log(expData.pkl_timestamp);
            
            // console.log('Call Update');
            updateNodes(newData);
            updateExperimentTimeStamp(expData);
            setUpdateGraph(true);
            setUpdateGraph(false);
            if (state.pklchanges){
              setPklChanges(changes + state.pklchanges);
            } else {
              setPklChanges(changes);
            }
            
  
          } else { 
            console.log('No changes but updating pkl anyway.')
            expData.pkl_timestamp = retrievedPkl.pkl_timestamp;
            updateExperimentTimeStamp(expData);
          }
        }
      }
      // } else {
      //   var t = new Date( retrievedPkl.pkl_timestamp );
      //   var formatted = t.toISOString();
      //   setPklChanges("No news yet... " + formatted)
      // }


      dispatch({
        type: GET_PKL_DATA,
        payload: res.data,
      });
    }

    // Cleaning
    const clearExperiments = () => dispatch({ type: CLEAR_EXPERIMENTS });
    const cleanGraphData = () => dispatch({ type: CLEAN_GRAPH_DATA });
    const cleanRunData = () => dispatch({ type: CLEAN_RUN_DATA });
    const cleanPklData = () => dispatch({ type: CLEAN_PKL_DATA });

    // Set Loading
    const setLoading = () => dispatch({ type: SET_LOADING });
    const setLoadingGraph = () => dispatch({ type: SET_LOADING_GRAPH });
    const setLoadingRun = () => dispatch({ type: SET_LOADING_RUN });
    const setLoadingPkl = () => dispatch({ type: SET_LOADING_PKL });


    // Action Things
    const updateSelection = (currentSelection) => dispatch({ type: UPDATE_SELECTION, payload: currentSelection });
    const updateNodes = (newdata) => dispatch({ type: UPDATE_NODES, payload: newdata });
    const updateExperimentTimeStamp = (newExperiment) => dispatch({ type: UPDATE_EXPERIMENT_TS, payload: newExperiment});
    const setAutoUpdateRun = (value) => dispatch({ type: SET_AUTOUPDATE_RUN, payload: value });
    const setAutoUpdatePkl = (value) => dispatch({ type: SET_AUTOUPDATE_PKL, payload: value });
    const setUpdateGraph = (value) => dispatch({ type: SHOULD_UPDATE_GRAPH, payload: value });
    const setPklChanges = (value) => dispatch({ type: SET_PKL_CHANGES, payload: value });

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
      
    const timeStampToDate = (value) => {
      //console.log('Setting new format: ' + value);
      let formattedDate = "";
      var date = new Date( value * 1000);
      var hours = date.getHours();
      var minutes = "0" + date.getMinutes();
      var seconds = "0" + date.getSeconds();
      formattedDate = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
      // formattedDate = date.toISOString();
      return formattedDate;
    }

    return (
        <ExperimentContext.Provider
        value ={{
            experiments: state.experiments,
            experiment: state.experiment,
            loading: state.loading,
            loadingGraph: state.loadingGraph,
            loadingRun: state.loadingRun,
            loadingPkl: state.loadingPkl,
            data: state.data,
            rundata: state.rundata,
            pklchanges: state.pklchanges,
            selection: state.selection,
            enabledGraphSearch: state.enabledGraphSearch,
            startAutoUpdateRun: state.startAutoUpdateRun,
            startAutoUpdatePkl: state.startAutoUpdatePkl,
            shouldUpdateGraph: state.shouldUpdateGraph,
            setAutoUpdateRun,
            setAutoUpdatePkl,
            searchExperiments,
            clearExperiments,
            getExperiment,
            getExperimentGraph,
            cleanGraphData, 
            cleanRunData,
            cleanPklData,
            setPklChanges,
            updateSelection,
            getExperimentRun, 
            getExperimentPkl,           
            hashCode,       
            timeStampToDate,
        }}>
            {props.children}
        </ExperimentContext.Provider>
    );
};

export default ExperimentState;