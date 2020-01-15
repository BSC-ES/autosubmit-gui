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
  SET_FANCYTREE,
  SET_FOUND_NODES,
  SET_LOADING_SEARCH_JOB,
  SET_LOADING_STATE,
  GET_RUNNING_STATE,
  CLEAN_TREE_DATA,  
  FILTER_TREEVIEW_FAILED,
  SET_LOADING_FILTER,
  UPDATE_SELECTION_TREE,
  CLEAR_FILTER_TREE,
  CURRENT_RUNNING,
  SET_LOADING_JOB_MONITOR,
  SET_LOADING_TREE_REFRESH,
  PKL_TREE_LOADED,
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
        loadingFilterTree: false,
        loadingJobMonitor: false,
        loadingTreeRefresh: false,
        selection: null,
        selectedTreeNode: null,
        enabledGraphSearch: true,  
        startAutoUpdateRun: false,  
        startAutoUpdatePkl: false,
        shouldUpdateGraph: false,   
        visNodes: null, 
        visNetwork: null,
        fancyTree: null,
        foundNodes: null,
        current_grouped: 'none',
        current_layout: 'standard',
        allowJobMonitor: false,
        returnFilter: 0,
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
    
    const getCurrentRunning = async () => {
      setLoading();
      const res = await axios.get(`${localserver}/running/`);
      console.log(res.data);
      dispatch({
        type: CURRENT_RUNNING,
        payload: res.data.experiment,
      });
    }

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
    const getExperimentGraph = async (expid, grouped = 'none', layout = 'standard') => {
        setLoadingGraph();
        
        const res = await axios.get(`${localserver}/graph/${expid}/${layout}/${grouped}`);
        console.log(res.data);
        const resdata = res.data;
        dispatch({
            type: GET_GRAPH,
            payload: { resdata, grouped, layout } ,
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

    // Get experiment pkl data for tree
    const getExperimentTreePkl = async (expid, timeStamp) => {
      setLoadingTreeRefresh();
      const res = await axios.get(`${localserver}/pkltreeinfo/${expid}/${timeStamp}`);
      const retrievedPklTree = res.data;
      console.log(retrievedPklTree);
      var jobs = {};
      if (state.treedata !== null && retrievedPklTree.has_changed === true && retrievedPklTree.pkl_content.length > 0){
        var currentJobs = state.treedata.jobs;          
        var referenceHeaders = state.treedata.reference;    
        var currentPackages = referenceHeaders['packages'];
        const completed_tag = referenceHeaders['completed_tag'];
        const running_tag = referenceHeaders['running_tag'];
        const queuing_tag = referenceHeaders['queuing_tag'];
        const failed_tag = referenceHeaders['failed_tag'];
        const check_mark = referenceHeaders['check_mark'];

        for(var j = 0, job; j < retrievedPklTree.pkl_content.length; j++){          
          job = retrievedPklTree.pkl_content[j];
          jobs[ job.name ] = job;
        }        

        for (var i = 0, cjob, ijob; i < currentJobs.length; i++){
          cjob = currentJobs[i];  
          // Name is id in treedata
          ijob = jobs[ cjob.id ];          
          if (cjob.status_code !== ijob.status_code || cjob.minutes !== ijob.minutes){
            var is_change_status = false;
            var new_status = cjob.status;
            var old_status = ijob.status;
            if (cjob.status_code !== ijob.status_code){
              is_change_status = true;
              new_status = ijob.status;
              old_status = cjob.status;
            } 
            cjob.status_code = ijob.status_code;
            cjob.status = ijob.status;
            cjob.status_color = ijob.status_color;
            cjob.minutes = ijob.minutes;
            cjob.wrapper = ijob.wrapper;
            cjob.out = ijob.out;
            cjob.err = ijob.err;
            var tree_parent_wrapper = "Wrapper: " + ijob.wrapper
            if (!(cjob.tree_parents.includes(tree_parent_wrapper))){
              cjob.tree_parents.push(tree_parent_wrapper);
            }
            cjob.wrapper_code = ijob.wrapper_id;
            var newTitle = ijob.title + " " + ((cjob.parents === 0 ? retrievedPklTree.source_tag : "" )) + ((cjob.children === 0 ? retrievedPklTree.target_tag : "" ))
            + ((cjob.sync === true ? retrievedPklTree.sync_tag : "")) + ((ijob.wrapper_id !== 0 ? ijob.wrapper_tag : "" ));
            cjob.title = newTitle;
            var thenode = state.fancyTree.getNodesByRef(cjob.id);
            if (thenode){
              for (var thenode_i in thenode){
                thenode[thenode_i].setTitle(newTitle);              
              }              
              const parents = cjob.tree_parents
              //console.log(parents)

              //console.log(check_mark)
              //console.log(check_mark);
              //console.log(referenceHeaders);
              for (var parent in parents){
                // console.log(parents[parent])
                var header_data = referenceHeaders[parents[parent]]
                // console.log(header_data)
                if (header_data){
                  if (is_change_status === true){
                    if (new_status === "COMPLETED"){
                      header_data.completed += 1
                    }
                    if (new_status === "RUNNING"){
                      header_data.running += 1
                    }
                    if (new_status === "QUEUING"){
                      header_data.queuing += 1
                    }
                    if (new_status === "FAILED"){
                      header_data.failed += 1
                    }
                    if (old_status === "RUNNING"){
                      header_data.running -= 1
                    }
                    if (old_status === "QUEUING"){
                      header_data.queuing -= 1
                    }
                    if (old_status === "FAILED"){
                      header_data.failed -= 1
                    }
                  }
                  // Setting new title
                  const new_completed_tag = completed_tag.replace('%C', header_data.completed).replace('%T', header_data.total);
                  const new_check_mark = (header_data.completed === header_data.total ? check_mark : "" );
                  const new_running_tag = (header_data.running > 0 ? running_tag.replace('%R', header_data.running): "");
                  const new_queuing_tag = (header_data.queuing > 0 ? queuing_tag.replace('%Q', header_data.queuing): "");
                  const new_failed_tag = (header_data.failed > 0 ? failed_tag.replace('%F', header_data.failed): "");
                  var theparent = state.fancyTree.getNodesByRef(parents[parent]);
                  //console.log(parent);
                  if (theparent){
                    //Sets new title
                    var new_title = parents[parent] + new_completed_tag + new_failed_tag + new_running_tag + new_queuing_tag + new_check_mark
                    theparent[0].setTitle(new_title);
                    
                  }                   
                }                             
              }
            }
           
          }
        }
        const packages_from_pkl = retrievedPklTree['packages'];
        //console.log(packages_from_pkl);
        //console.log(currentPackages);
        for (var package_pkl of packages_from_pkl){
          //console.log(package_pkl);
          //console.log(packages_from_pkl[package_pkl]);
          //console.log(currentPackages);
          if (!(currentPackages.includes(package_pkl))){
            console.log("New wrapper found: " + package_pkl);
            currentPackages.push(package_pkl);
            //console.log(currentPackages);
            var wrapper_pre_title = 'Wrapper: ' + package_pkl;
            referenceHeaders[wrapper_pre_title] = {'completed': 0, 'failed': 0, 'queuing': 0, 'running': 0, 'total': 0}
            var header_wrapper = referenceHeaders[wrapper_pre_title]
            // eslint-disable-next-line no-loop-func
            var children_jobs = currentJobs.filter(function (x){
              return x.wrapper === package_pkl;
            });
            var children_list = [];
            for(var k = 0; k < children_jobs.length; k++){
              if (children_jobs[k].status === "COMPLETED"){
                header_wrapper.completed += 1;
              }else if (children_jobs[k].status === "FAILED"){
                header_wrapper.failed += 1;
              }else if (children_jobs[k].status === "QUEUING"){
                header_wrapper.queuing += 1;
              }else if (children_jobs[k].status === "RUNNING"){
                header_wrapper.running += 1;
              }
              children_list.push({'title': children_jobs[k].title, 'refKey': children_jobs[k].id, 'data': 'Empty', 'children': []})
            }
            header_wrapper.total = children_jobs.length;
            
            const new_completed_tag = completed_tag.replace('%C', header_wrapper.completed).replace('%T', header_wrapper.total);
            const new_check_mark = (header_wrapper.completed === header_wrapper.total ? check_mark : "" );
            const new_running_tag = (header_wrapper.running > 0 ? running_tag.replace('%R', header_wrapper.running): "");
            const new_queuing_tag = (header_wrapper.queuing > 0 ? queuing_tag.replace('%Q', header_wrapper.queuing): "");
            const new_failed_tag = (header_wrapper.failed > 0 ? failed_tag.replace('%F', header_wrapper.failed): "");
            const wrapper_title = wrapper_pre_title + new_completed_tag + new_failed_tag + new_running_tag + new_queuing_tag + new_check_mark
            var rootNode = state.fancyTree.getRootNode();
            //console.log(children_list);
            //console.log()
            // eslint-disable-next-line no-unused-vars
            var wrapper_branch_root = rootNode.addChildren({'title': wrapper_title, 'folder': true, 'refKey': wrapper_pre_title, 'expanded': false, 'children': children_list});
          }
        }                 
      }
      dispatch({
        type: PKL_TREE_LOADED,
      });
      //console.log(res.data);      
    }


    // Get Experiment Pkl Data for Graph changes update
    const getExperimentPkl = async (expid, timeStamp) => {
      // if (state.isGrouped === false){
        setLoadingPkl();
        setLoadingJobMonitor();
        //timeStamp = 1000;
        const res = await axios.get(`${localserver}/pklinfo/${expid}/${timeStamp}`);
        console.log(res.data);
        // const actualPkl = res.data;
        
        let retrievedPkl = null;
        var current_jobs = {};
        var jobs = {};
        var colorChanges = {};
        var shapeChanges = {};
        var edgeUpdates = {};
        var new_fakeEdges = {};
        var changes = ""
        var newData = state.data;
        var expData = state.experiment;
        retrievedPkl = res.data;

        if (state.data !== null && retrievedPkl.has_changed === true && retrievedPkl.pkl_content.length > 0){
          let pkl_packages = retrievedPkl["packages"];
          let current_packages = state.data["packages"];
          
          //console.log(retrievedPkl.pkl_content.length);
          for(var k = 0, kjob; k < newData.nodes.length; k++){
            kjob = newData.nodes[k];
            current_jobs[ kjob.id ] = kjob;
          }

          for(var j = 0, job; j < retrievedPkl.pkl_content.length; j++){
            job = retrievedPkl.pkl_content[j];
            jobs[ job.name ] = job;
          }

          // Updating list of packages and adding to shape change
          // Shape change currently not working
          for(var pkl_package in pkl_packages){
            if (!(Object.keys(current_packages).includes(pkl_package))){
              current_packages[pkl_package] = pkl_packages[pkl_package];
              //console.log(pkl_packages[pkl_package]);
              for(var index in pkl_packages[pkl_package]){
                let index_i = parseInt(index);
                var job_name = pkl_packages[pkl_package][index_i]
                //console.log(job_name);
                shapeChanges[job_name] = "hexagon";
                //console.log(index_i);
                //console.log(pkl_packages[pkl_package].length);
                var next = (index_i + 1);
                //console.log(next);
                if (next < pkl_packages[pkl_package].length){                  
                  //console.log(pkl_packages[pkl_package][index_i]);
                  //console.log(pkl_packages[pkl_package][next]);
                  if(current_jobs[pkl_packages[pkl_package][index_i]].level === current_jobs[pkl_packages[pkl_package][next]].level){
                    new_fakeEdges[pkl_packages[pkl_package][index_i]] = pkl_packages[pkl_package][next];
                  }
                }
              }
            }
          }




          let requireUpdate = false;
          console.log('Current ts: '+ state.experiment.pkl_timestamp);        
          
          if (newData.nodes){
            for(var i = 0; i < newData.nodes.length; i++){
              // console.log(newNodes[i].id);
              //console.log(newData.nodes[i]);
              // console.log(jobs[ newNodes[i].id ]);

              if (newData.nodes[i].status_code !== jobs[ newData.nodes[i].id ].status_code || newData.nodes[i].package !== jobs[ newData.nodes[i].id ].package){
                // changes += newData.nodes[i].id + " from " + newData.nodes[i].status + " to " + jobs[ newData.nodes[i].id ].status + " || ";
                changes += timeStampToDate(retrievedPkl.pkl_timestamp) + ": "+ newData.nodes[i].id + " to " + jobs[ newData.nodes[i].id ].status + "\n";
                if (newData.nodes[i].package !== jobs[ newData.nodes[i].id ].package){
                  changes += timeStampToDate(retrievedPkl.pkl_timestamp) + ": "+ newData.nodes[i].id + " added to " + jobs[ newData.nodes[i].id ].package + "\n";
                  var current_job = current_jobs[newData.nodes[i].id];
                  var children_current = current_job.children_list;
                  for(var child in children_current){
                    if (jobs[children_current[child]].package === jobs[ newData.nodes[i].id ].package){
                      edgeUpdates[ newData.nodes[i].id ] = children_current[child];
                    }
                  } 
                }                
                newData.nodes[i].status_code = jobs[ newData.nodes[i].id ].status_code;
                newData.nodes[i].status_color = jobs[ newData.nodes[i].id ].status_color;
                newData.nodes[i].status = jobs[ newData.nodes[i].id ].status;
                newData.nodes[i].package = jobs[ newData.nodes[i].id ].package;
                newData.nodes[i].dashed = jobs[ newData.nodes[i].id ].dashed;
                newData.nodes[i].shape = jobs[ newData.nodes[i].id ].shape;
                newData.nodes[i].out = jobs[ newData.nodes[i].id ].out;
                newData.nodes[i].err = jobs[ newData.nodes[i].id ].err;
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

              for(var key_shape in shapeChanges){
                updateGraphShape(key_shape, shapeChanges[key_shape]);
                updateGraphBorder(key_shape);               
              }

              for(var key_edge in edgeUpdates){
                updateEdgeStyle(key_edge + "-" + edgeUpdates[key_edge]);
              }

              for(var key_added in new_fakeEdges){
                addFakeEdge(key_added, new_fakeEdges[key_added]);
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

    const updateGraphBorder = (idChange) => {    
      //console.log("Upate graph border of " + idChange);
      state.visNetwork.body.nodes[idChange].options.shapeProperties.borderDashes = true;
      state.visNetwork.selectNodes([idChange]);
    }

    const updateGraphShape = (idChange, shape) => {
      //console.log("Upate graph shape of " + idChange + " to " + shape);
      state.visNetwork.body.nodes[idChange].options.shape = shape;
      state.visNetwork.selectNodes([idChange]);
    }

    const updateEdgeStyle = (idEdge) => {            
      if (Object.keys(state.visNetwork.body.edges).includes(idEdge)){
        //console.log("Update style of edge " + idEdge);
        state.visNetwork.body.edges[idEdge].options.dashes = false;
        state.visNetwork.body.edges[idEdge].options.background.enabled = true;
        state.visNetwork.body.edges[idEdge].options.background.color = 'rgba(63, 191, 63, 0.5)';
      }
    }

    const addFakeEdge = (source, target) => {
      let id_edge = source + "-" + target;
      //console.log("Adding fake edge from " + source + " to " + target);
      state.visNetwork.body.data.edges.add([{id: id_edge, from: source, to: target, dashes: true, background : { enabled: true, color: 'rgba(63, 191, 63, 0.5)'}, arrows: { to: { enabled : false }}}]);
    }


    const navigateGraph = (posx, posy, cScale = 0.9) => {
      // console.log(posx);
      // console.log(posy);
      // console.log(state.visNetwork);
      // console.log(state.visNodes);
      if (cScale <= 0.05)  cScale = 0.05;
      state.visNetwork.moveTo(
        {
          position: {x: posx, y: posy },
          scale: cScale,
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

    const navigateToGroup = IdList => {
      if (state.visNetwork) {
        state.visNetwork.unselectAll();
        const currentLength = IdList.length;
        const Id = IdList[parseInt(Math.floor(IdList.length/2))]
        const rescale = Math.sqrt(currentLength)*0.065
        var currentPosition = state.visNetwork.getPositions(Id);
        if (currentPosition[Id]){
          navigateGraph(currentPosition[Id].x, currentPosition[Id].y, 0.6 - rescale);
          state.visNetwork.selectNodes(IdList);
        }        
      }
    }

    const searchJobInGraph = async string => {
      setLoadingSearchJob();
      if (state.data.nodes) {
        const foundNodes = await state.data.nodes.filter(node => node.id.toUpperCase().indexOf(string.toUpperCase()) >= 0);
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

    const filterTreeView = async string => {
      setLoadingFilter();
      if (state.treedata && state.fancyTree) {
        const count = await state.fancyTree.filterBranches(string);
        console.log(count);
        dispatch({
          type: FILTER_TREEVIEW_FAILED,
          payload: count,
        });
      } else {
        dispatch({
          type: FILTER_TREEVIEW_FAILED,
          payload: 0,
        });
      }
      
    }

    const clearFilterTreeView = () => {
      if (state.treedata && state.fancyTree) {
        state.fancyTree.clearFilter();
        dispatch({
          type: CLEAR_FILTER_TREE        
        });
      }      
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
    const setLoadingFilter = () => dispatch({ type: SET_LOADING_FILTER});
    const setLoadingJobMonitor = () => dispatch({ type: SET_LOADING_JOB_MONITOR });
    const setLoadingTreeRefresh = () => dispatch({ type: SET_LOADING_TREE_REFRESH });


    // Action Things
    const updateSelection = (currentSelection) => dispatch({ type: UPDATE_SELECTION, payload: currentSelection });
    const updateSelectionTree = (currentSelected) => dispatch({ type: UPDATE_SELECTION_TREE, payload: currentSelected });
    const updateNodes = (newdata) => dispatch({ type: UPDATE_NODES, payload: newdata });
    const updateExperimentTimeStamp = (newExperiment) => dispatch({ type: UPDATE_EXPERIMENT_TS, payload: newExperiment});
    const setAutoUpdateRun = (value) => dispatch({ type: SET_AUTOUPDATE_RUN, payload: value });
    const setAutoUpdatePkl = (value) => dispatch({ type: SET_AUTOUPDATE_PKL, payload: value });
    const setUpdateGraph = (value) => dispatch({ type: SHOULD_UPDATE_GRAPH, payload: value });
    const setPklChanges = (value) => dispatch({ type: SET_PKL_CHANGES, payload: value });
    const setVisData = (value) => dispatch({ type: SET_VIS_DATA, payload: value});
    const setVisNetwork = (value) => dispatch({ type: SET_VIS_NETWORK, payload: value });
    const setFancyTree = (value) => dispatch({ type: SET_FANCYTREE, payload: value });


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
            loadingFilterTree: state.loadingFilterTree,
            loadingState: state.loadingState,
            returnFilter: state.returnFilter,
            loadingJobMonitor: state.loadingJobMonitor,
            loadingTreeRefresh: state.loadingTreeRefresh,
            data: state.data,
            treedata: state.treedata,
            rundata: state.rundata,
            pklchanges: state.pklchanges,
            selection: state.selection,
            selectedTreeNode: state.selectedTreeNode,
            enabledGraphSearch: state.enabledGraphSearch,
            startAutoUpdateRun: state.startAutoUpdateRun,
            startAutoUpdatePkl: state.startAutoUpdatePkl,
            shouldUpdateGraph: state.shouldUpdateGraph,
            visNodes: state.visNodes,
            visNetwork: state.visNetwork,
            foundNodes: state.foundNodes,            
            experimentRunning: state.experimentRunning,
            current_grouped: state.current_grouped,
            current_layout: state.current_layout,
            allowJobMonitor: state.allowJobMonitor,
            setAutoUpdateRun,
            setAutoUpdatePkl,
            searchExperiments,
            getCurrentRunning,
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
            updateSelectionTree,
            getExperimentRun, 
            getExperimentPkl,           
            hashCode,       
            timeStampToDate,
            setVisData,
            setVisNetwork,
            setFancyTree,
            updateGraphColor,
            updateGraphBorder,
            updateGraphShape,
            navigateGraph,
            setUpdateGraph,
            navToLatest,
            searchJobInGraph,
            navigateTo,
            getRunningState,     
            getExperimentGraphGrouped,    
            filterTreeView,
            clearFilterTreeView,
            navigateToGroup,
            getExperimentTreePkl      
        }}>
            {props.children}
        </ExperimentContext.Provider>
    );
};

export default ExperimentState;