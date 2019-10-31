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
  GET_TREE,
  GET_GRAPH_GROUPED,
  SET_LOADING_GRAPH,
  SET_LOADING_TREE,
  CLEAN_GRAPH_DATA,
  CLEAN_NAV_DATA,
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
  SET_VIS_DATA,
  SET_VIS_NETWORK,
  SET_FOUND_NODES,
  SET_LOADING_SEARCH_JOB,
  SET_LOADING_STATE,
  GET_RUNNING_STATE,
  CLEAN_TREE_DATA,  
} from '../types';

const ExperimentState = props => {
    const initialState = {
        experiments: [],
        experiment: {},
        loading: false,
        experimentRunning: false,
        data: null,
        treedata: null,
        rundata: null,
        pkldata: null,
        pklchanges: null,
        loadingTree: false,
        loadingGraph: false,
        loadingRun: false,
        loadingState: false,
        loadingPkl: false,
        loadingSearchJob: false,
        selection: null,
        enabledGraphSearch: true,  
        startAutoUpdateRun: false,  
        startAutoUpdatePkl: false,
        shouldUpdateGraph: false,   
        visNodes: null, 
        visNetwork: null,
        foundNodes: null,
        isGrouped: false,
        allowJobMonitor: false,
    }

    const [state, dispatch] = useReducer(ExperimentReducer, initialState);
    const localserver = 'http://192.168.11.91:8081'
    //const localserver= 'http://84.88.185.94:8081'

    // Search Experiments
    const searchExperiments = async text => {
        setLoading();
        const res = await axios.get(`${localserver}/search/${text}`);
        dispatch({
            type: SEARCH_EXPERIMENTS,
            payload: res.data.experiment,
        });
      };

    // Get Experiment
    const getExperiment = async expid => {
        setLoading();
        //cleanGraphData();
        const res = await axios.get(`${localserver}/expinfo/${expid}`); 
        //console.log(res.data);
        dispatch({
            type: GET_EXPERIMENT,
            payload: res.data,
        });
      };
    

    // Get Experiment Graph Grouped
    const getExperimentGraphGrouped = async (expid, group) => {
      setLoadingGraph();
      const res = await axios.get(`${localserver}/group/${expid}/${group}`);
      console.log(res.data);
      dispatch({
        type: GET_GRAPH_GROUPED,
        payload: res.data,
      });
    }

    // Get Experiment Graph
    const getExperimentGraph = async expid => {
        setLoadingGraph();
        
        const res = await axios.get(`${localserver}/graph/${expid}`);
        console.log(res.data);
        dispatch({
            type: GET_GRAPH,
            payload: res.data,
        });
        //this.setState({ data: res.data, loading: false, showGraph: !res.data.error });
      };
    
    const getExperimentTree = async expid => {
      setLoadingTree();

      const res = await axios.get(`${localserver}/tree/${expid}`);
      console.log(res.data);
      dispatch({
        type: GET_TREE,
        payload: res.data,
      });
    }

    // Get Experiment Run
    const getExperimentRun = async expid => {
        setLoadingRun();
        const res = await axios.get(`${localserver}/exprun/${expid}`);
        //console.log(res.data);
        dispatch({
            type: GET_EXPERIMENT_RUN,
            payload: res.data,
        });
    }

    // Get Running State
    const getRunningState = async expid => {
      setLoadingState();
      const res = await axios.get(`${localserver}/ifrun/${expid}`);
      //console.log(res.data);      
      dispatch({
        type: GET_RUNNING_STATE,
        payload: res.data.running,
      });

    }

    // Get Experiment Pkl Data
    const getExperimentPkl = async (expid, timeStamp) => {
      if (state.isGrouped === false){
        setLoadingPkl();
        //timeStamp = 1000;
        const res = await axios.get(`${localserver}/pklinfo/${expid}/${timeStamp}`);
        console.log(res.data);
        // const actualPkl = res.data;
        
        let retrievedPkl = null;
        var jobs = {};
        var colorChanges = {};
        var changes = ""
        retrievedPkl = res.data;
        if (state.data !== null && retrievedPkl.has_changed === true && retrievedPkl.pkl_content.length > 0){
          //console.log(retrievedPkl.pkl_content.length);
          for(var j = 0, job; j < retrievedPkl.pkl_content.length; j++){
            job = retrievedPkl.pkl_content[j];
            //console.log(job);
            jobs[ job.name ] = job;
            //console.log(jobs[job.name]);git pu
          }
          let requireUpdate = false;
          console.log('Current ts: '+ state.experiment.pkl_timestamp);        
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
                colorChanges[ newData.nodes[i].id  ] = jobs[ newData.nodes[i].id ].status_color;
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
              
              updateNodes(newData);

              
              updateExperimentTimeStamp(expData);
              // setUpdateGraph(true);
              // setUpdateGraph(false);
              if (state.pklchanges){
                setPklChanges(changes + state.pklchanges);
              } else {
                setPklChanges(changes);
              }

              for(var key in colorChanges) {
                //console.log( key, colorChanges[key] );
                updateGraphColor(key, colorChanges[key]);
              }
              
    
            } else { 
              console.log('No changes but updating pkl anyway.')
              expData.pkl_timestamp = retrievedPkl.pkl_timestamp;
              updateExperimentTimeStamp(expData);
            }
          }
        }
        dispatch({
          type: GET_PKL_DATA,
          payload: res.data,
        });
        
      } else {
        if (state.pklchanges) {
          setPklChanges("Can't update grouped graph\n" + state.pklchanges);
        } else {
          setPklChanges("Can't update grouped graph\n");
        }
        
      } 
    }

    // Graph manipulation
    const updateGraphColor = (idChange, newColor) => {
      
      //console.log("Updateing graph color")
      // var node = state.visNetwork.selectNodes([idChange]);
      // if (node){
      //   node.color = newColor;
      // }
      // var node = state.visNodes.get(idChange);
      // node.color = {background: newColor}

      // //console.log(node)
      
      //state.visNetwork.unselectAll();
      state.visNetwork.body.nodes[idChange].options.color.background = newColor;
      state.visNetwork.selectNodes([idChange]);
      //console.log(cont)
      
      //state.visNodes.update({id:idChange, color: { background: newColor }});
    };

    const navigateGraph = (posx, posy) => {
      // console.log(posx);
      // console.log(posy);
      // console.log(state.visNetwork);
      // console.log(state.visNodes);
      state.visNetwork.moveTo(
        {
          position: {x: posx, y: posy },
          scale: 0.9,
          //offset: {x: 30, y: 30},
          animation: false,
        }
      );      
    };

    const navToLatest = (statusCode) => {
      //const statusCode = 5; // Completed
      var currentLevel = 0;
      //var currentNode = null;
      var latestId = "not found";
      //console.log(state.data.nodes);
      if (state.data.nodes) {
        //console.log("Iterate")
        for (const node of state.data.nodes){
          if (node.status_code === statusCode){
            if (node.level >= currentLevel){
              currentLevel = node.level;
              //currentNode = node;
              latestId = node.id;
            }
          }
        }
      }      
      var currentPosition = state.visNetwork.getPositions([latestId]);
      //console.log(currentPosition);
      if (currentPosition[latestId]){
        navigateGraph(currentPosition[latestId].x, currentPosition[latestId].y);
        // setMessageNavigator(latestId, true);
        state.visNetwork.selectNodes([latestId]);
        updateSelection([latestId]);
        //updateSelection(currentNode);
      } else {
        updateSelection(null);
        //setMessageNavigator("There are no nodes with that status.", false)
      }      
    }

    const navigateTo = Id => {
      if (state.visNetwork){
        var currentPosition = state.visNetwork.getPositions([Id]);
        if (currentPosition[Id]){
          navigateGraph(currentPosition[Id].x, currentPosition[Id].y);
          state.visNetwork.selectNodes([Id]);    
          updateSelection([Id]);         
        } 
      }
      
    }

    const searchJobInGraph = async string => {
      setLoadingSearchJob();
      if (state.data.nodes) {
        const foundNodes = await state.data.nodes.filter(node => node.id.indexOf(string) >= 0);
       // console.log(foundNodes);
        // console.log(foundNodes.length);
        if (foundNodes && foundNodes.length > 0) {
          dispatch({
            type: SET_FOUND_NODES,
            payload: foundNodes,
          });

          //console.log(foundNodes[0].id);
          navigateTo(foundNodes[0].id);
          updateSelection([foundNodes[0].id]);
      
          //console.log('Life after dispatch')
          return;
        }
      }

      dispatch({
        type: SET_FOUND_NODES,
        payload: null,
      });

    }



    // Cleaning
    const clearExperiments = () => dispatch({ type: CLEAR_EXPERIMENTS });
    const cleanGraphData = () => dispatch({ type: CLEAN_GRAPH_DATA });
    const cleanTreeData = () => dispatch({ type: CLEAN_TREE_DATA });
    const cleanRunData = () => dispatch({ type: CLEAN_RUN_DATA });
    const cleanPklData = () => dispatch({ type: CLEAN_PKL_DATA });
    const cleanNavData = () => dispatch({ type: CLEAN_NAV_DATA });

    // Set Loading
    const setLoading = () => dispatch({ type: SET_LOADING });
    const setLoadingGraph = () => dispatch({ type: SET_LOADING_GRAPH });
    const setLoadingTree = () => dispatch({ type: SET_LOADING_TREE });
    const setLoadingRun = () => dispatch({ type: SET_LOADING_RUN });
    const setLoadingPkl = () => dispatch({ type: SET_LOADING_PKL });
    const setLoadingSearchJob = () => dispatch({ type: SET_LOADING_SEARCH_JOB});
    const setLoadingState = () => dispatch({ type: SET_LOADING_STATE});


    // Action Things
    const updateSelection = (currentSelection) => dispatch({ type: UPDATE_SELECTION, payload: currentSelection });
    const updateNodes = (newdata) => dispatch({ type: UPDATE_NODES, payload: newdata });
    const updateExperimentTimeStamp = (newExperiment) => dispatch({ type: UPDATE_EXPERIMENT_TS, payload: newExperiment});
    const setAutoUpdateRun = (value) => dispatch({ type: SET_AUTOUPDATE_RUN, payload: value });
    const setAutoUpdatePkl = (value) => dispatch({ type: SET_AUTOUPDATE_PKL, payload: value });
    const setUpdateGraph = (value) => dispatch({ type: SHOULD_UPDATE_GRAPH, payload: value });
    const setPklChanges = (value) => dispatch({ type: SET_PKL_CHANGES, payload: value });
    const setVisData = (value) => dispatch({ type: SET_VIS_DATA, payload: value});
    const setVisNetwork = (value) => dispatch({ type: SET_VIS_NETWORK, payload: value });


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
            loadingTree: state.loadingTree,
            loadingRun: state.loadingRun,
            loadingPkl: state.loadingPkl,
            loadingSearchJob: state.loadingSearchJob,
            loadingState: state.loadingState,
            data: state.data,
            treedata: state.treedata,
            rundata: state.rundata,
            pklchanges: state.pklchanges,
            selection: state.selection,
            enabledGraphSearch: state.enabledGraphSearch,
            startAutoUpdateRun: state.startAutoUpdateRun,
            startAutoUpdatePkl: state.startAutoUpdatePkl,
            shouldUpdateGraph: state.shouldUpdateGraph,
            visNodes: state.visNodes,
            visNetwork: state.visNetwork,
            foundNodes: state.foundNodes,            
            experimentRunning: state.experimentRunning,
            isGrouped: state.isGrouped,
            allowJobMonitor: state.allowJobMonitor,
            setAutoUpdateRun,
            setAutoUpdatePkl,
            searchExperiments,
            clearExperiments,
            getExperiment,
            getExperimentGraph,
            getExperimentTree,
            cleanGraphData, 
            cleanTreeData,
            cleanRunData,
            cleanPklData,
            cleanNavData,
            setPklChanges,
            updateSelection,
            getExperimentRun, 
            getExperimentPkl,           
            hashCode,       
            timeStampToDate,
            setVisData,
            setVisNetwork,
            updateGraphColor,
            navigateGraph,
            setUpdateGraph,
            navToLatest,
            searchJobInGraph,
            navigateTo,
            getRunningState,     
            getExperimentGraphGrouped,       
        }}>
            {props.children}
        </ExperimentContext.Provider>
    );
};

export default ExperimentState;