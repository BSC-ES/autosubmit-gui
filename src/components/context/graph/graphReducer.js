import {
  GET_GRAPH,
  GET_PKL_DATA,
  SET_LOADING_GRAPH,
  CLEAN_ONLY_GRAH_DATA,
  SET_VIS_DATA,
  SET_VIS_NETWORK,
  SET_FOUND_NODES,
  SET_LOADING_SEARCH_JOB,
  SET_LOADING_JOB_MONITOR,
  SET_LOADING_PKL,
  CLEAN_GRAPH_DATA,
  UPDATE_NODES,
  SET_PKL_CHANGES,
  SHOULD_UPDATE_GRAPH,
  CLEAN_PKL_DATA,
  CLEAN_NAV_DATA,
  UPDATE_SELECTION,
  SET_AUTOUPDATE_PKL,
  NAVIGATE_AFTER_LOADING_GRAPH,
  NAVIGATE_GRAPH_TO,
  NAVIGATE_TO_GROUP_GRAPH,
  NAVIGATE_TO_LATEST,
  UPDATE_GRAPH_SELECTED_NODES,
  SET_CURRENT_COMMAND,
  //DEACTIVATE_COPY_TO,
} from "../types";

import { DEBUG } from "../vars";

import {
  WaitingCode,
  FailedCode,
  CompletedCode,
  RunningCode,
  QueueCode,
  SubmittedCode,
} from "../vars";

import {
  addFakeEdge,
  updateEdgeStyle,
  updateGraphBorder,
  updateGraphColor,
  updateGraphShape,
  navToLatest,
  navigateGraph,
  findIdinGraph,
} from "../graphutils";

import { timeStampToDate } from "../utils";

export default (state, action) => {
  switch (action.type) {
    case GET_GRAPH:
      const { resdata, grouped, layout } = action.payload;
      return {
        ...state,
        data: resdata,
        current_grouped: grouped,
        current_layout: layout,
        loadingGraph: false,
        enabledGraphSearch: true,
        graphSelectedNodes: null,
      };
    case GET_PKL_DATA:
      let retrievedPkl = action.payload;
      if (
        state.data !== null &&
        retrievedPkl.has_changed === true &&
        retrievedPkl.pkl_content.length > 0
      ) {
        let current_jobs = {};
        let jobs = {};
        let colorChanges = {};
        let shapeChanges = {};
        let edgeUpdates = {};
        let new_fakeEdges = {};
        let changes = "";
        let pkl_packages = retrievedPkl["packages"];
        let current_packages = state.data["packages"];

        // Saving current state data into a dictionary
        for (let k = 0, kjob; k < state.data.nodes.length; k++) {
          kjob = state.data.nodes[k];
          current_jobs[kjob.id] = kjob;
        }
        // Saving retrieved jobs into a dictionary
        for (let j = 0, job; j < retrievedPkl.pkl_content.length; j++) {
          job = retrievedPkl.pkl_content[j];
          jobs[job.name] = job;
        }

        // Updating list of packages and adding to shape change
        // Shape change currently not working
        for (let pkl_package in pkl_packages) {
          if (!Object.keys(current_packages).includes(pkl_package)) {
            current_packages[pkl_package] = pkl_packages[pkl_package];
            //console.log(pkl_packages[pkl_package]);
            for (let index in pkl_packages[pkl_package]) {
              let index_i = parseInt(index);
              let job_name = pkl_packages[pkl_package][index_i];
              //console.log(job_name);
              shapeChanges[job_name] = "hexagon";
              //console.log(index_i);
              //console.log(pkl_packages[pkl_package].length);
              let next = index_i + 1;
              //console.log(next);
              if (next < pkl_packages[pkl_package].length) {
                //console.log(pkl_packages[pkl_package][index_i]);
                //console.log(pkl_packages[pkl_package][next]);
                if (
                  current_jobs[pkl_packages[pkl_package][index_i]].level ===
                  current_jobs[pkl_packages[pkl_package][next]].level
                ) {
                  new_fakeEdges[pkl_packages[pkl_package][index_i]] =
                    pkl_packages[pkl_package][next];
                }
              }
            }
          }
        }

        let requireUpdate = false;
        DEBUG && console.log("Current ts: " + retrievedPkl.pkl_timestamp);

        if (state.data.nodes) {
          for (let i = 0; i < state.data.nodes.length; i++) {
            // console.log(newNodes[i].id);
            //console.log(state.data.nodes[i]);
            // console.log(jobs[ newNodes[i].id ]);

            if (
              state.data.nodes[i].status_code !==
                jobs[state.data.nodes[i].id].status_code ||
              state.data.nodes[i].package !==
                jobs[state.data.nodes[i].id].package ||
              state.data.nodes[i].minutes !==
                jobs[state.data.nodes[i].id].minutes ||
              state.data.nodes[i].minutes_queue !==
                jobs[state.data.nodes[i].id].minutes_queue
            ) {
              // changes += state.data.nodes[i].id + " from " + state.data.nodes[i].status + " to " + jobs[ state.data.nodes[i].id ].status + " || ";
              if (
                state.data.nodes[i].status_code !==
                jobs[state.data.nodes[i].id].status_code
              ) {
                changes +=
                  timeStampToDate(retrievedPkl.pkl_timestamp) +
                  ": " +
                  state.data.nodes[i].id +
                  " to " +
                  jobs[state.data.nodes[i].id].status +
                  "\n";
              } else {
                // Not decided.
              }

              if (
                state.data.nodes[i].package !==
                jobs[state.data.nodes[i].id].package
              ) {
                changes +=
                  timeStampToDate(retrievedPkl.pkl_timestamp) +
                  ": " +
                  state.data.nodes[i].id +
                  " added to " +
                  jobs[state.data.nodes[i].id].package +
                  "\n";
                let current_job = current_jobs[state.data.nodes[i].id];
                let children_current = current_job.children_list;
                for (let child in children_current) {
                  if (
                    jobs[children_current[child]].package ===
                    jobs[state.data.nodes[i].id].package
                  ) {
                    edgeUpdates[state.data.nodes[i].id] =
                      children_current[child];
                  }
                }
              }
              state.data.nodes[i].status_code =
                jobs[state.data.nodes[i].id].status_code;
              state.data.nodes[i].status_color =
                jobs[state.data.nodes[i].id].status_color;
              state.data.nodes[i].status = jobs[state.data.nodes[i].id].status;
              state.data.nodes[i].package =
                jobs[state.data.nodes[i].id].package;
              state.data.nodes[i].dashed = jobs[state.data.nodes[i].id].dashed;
              state.data.nodes[i].shape = jobs[state.data.nodes[i].id].shape;
              state.data.nodes[i].out = jobs[state.data.nodes[i].id].out;
              state.data.nodes[i].err = jobs[state.data.nodes[i].id].err;
              state.data.nodes[i].minutes =
                jobs[state.data.nodes[i].id].minutes;
              state.data.nodes[i].minutes_queue =
                jobs[state.data.nodes[i].id].minutes_queue;
              state.data.nodes[i].submit = jobs[state.data.nodes[i].id].submit;
              state.data.nodes[i].start = jobs[state.data.nodes[i].id].start;
              state.data.nodes[i].finish = jobs[state.data.nodes[i].id].finish;
              //console.log(state.data.nodes[i].status_color)
              colorChanges[state.data.nodes[i].id] =
                jobs[state.data.nodes[i].id].status_color;
              requireUpdate = true;
            }
          }

          if (requireUpdate) {
            DEBUG && console.log("New ts: " + retrievedPkl.pkl_timestamp);
            state.data.pkl_timestamp = retrievedPkl.pkl_timestamp;

            if (state.pklchanges) {
              state.pklchanges = changes + state.pklchanges;
            } else {
              state.pklchanges = changes;
            }

            for (var key in colorChanges) {
              //console.log( key, colorChanges[key] );
              updateGraphColor(key, colorChanges[key], state);
            }

            for (var key_shape in shapeChanges) {
              updateGraphShape(key_shape, shapeChanges[key_shape], state);
              updateGraphBorder(key_shape, state);
            }

            for (var key_edge in edgeUpdates) {
              updateEdgeStyle(key_edge + "-" + edgeUpdates[key_edge], state);
            }

            for (var key_added in new_fakeEdges) {
              addFakeEdge(key_added, new_fakeEdges[key_added], state);
            }
          } else {
            DEBUG && console.log("No changes but updating pkl anyway.");
          }
        }
      }
      return {
        ...state,
        pkldata: retrievedPkl,
        loadingPkl: false,
        loadingJobMonitor: false,
      };
    case NAVIGATE_AFTER_LOADING_GRAPH:
      const running = action.payload;
      if (state.visNetwork) {
        var found = false;
        const cScale = 0.5;
        if (running === true) {
          //console.log("Search Running")
          found = navToLatest(
            RunningCode,
            true,
            cScale,
            state.visNetwork,
            state.data,
            state
          );
          if (!found) {
            found = navToLatest(
              QueueCode,
              true,
              cScale,
              state.visNetwork,
              state.data,
              state
            );
            if (!found) {
              found = navToLatest(
                SubmittedCode,
                true,
                cScale,
                state.visNetwork,
                state.data,
                state
              );
              if (!found) {
                found = navToLatest(
                  CompletedCode,
                  true,
                  cScale,
                  state.visNetwork,
                  state.data,
                  state
                );
              }
            }
          }
        } else {
          found = navToLatest(
            FailedCode,
            true,
            cScale,
            state.visNetwork,
            state.data,
            state
          );
          if (!found) {
            found = navToLatest(
              CompletedCode,
              true,
              cScale,
              state.visNetwork,
              state.data,
              state
            );
          }
        }
        if (!found) {
          navToLatest(
            WaitingCode,
            false,
            cScale,
            state.visNetwork,
            state.data,
            state
          );
        }
      }
      return {
        ...state,
      };
    case NAVIGATE_GRAPH_TO:
      const Id = action.payload;
      if (state.visNetwork) {
        const position = findIdinGraph(Id, state);
        //const currentPosition = state.visNetwork.getPositions([Id]);
        if (position.x && position.y) {
          navigateGraph(Id, position.x, position.y, 0.9, state.visNetwork);
          //state.visNetwork.selectNodes([Id]);
          state.selection = [Id];
        }
      }
      return {
        ...state,
      };
    case NAVIGATE_TO_GROUP_GRAPH:
      const IdList = action.payload;
      if (state.visNetwork) {
        state.visNetwork.unselectAll();
        const currentLength = IdList.length;
        const Id = IdList[parseInt(Math.floor(IdList.length / 2))];
        const rescale = Math.sqrt(currentLength) * 0.065;
        var currentPosition = state.visNetwork.getPositions(Id);
        if (currentPosition[Id]) {
          navigateGraph(
            null,
            currentPosition[Id].x,
            currentPosition[Id].y,
            0.6 - rescale,
            state.visNetwork
          );
          state.visNetwork.selectNodes(IdList);
        }
      }
      return {
        ...state,
      };
    case NAVIGATE_TO_LATEST:
      const { status, latest } = action.payload;
      navToLatest(status, latest, 0.9, state.visNetwork, state.data, state);
      return {
        ...state,
      };
    case SET_LOADING_GRAPH:
      return {
        ...state,
        loadingGraph: true,
        enabledGraphSearch: false,
      };
    case SET_VIS_DATA:
      return {
        ...state,
        visNodes: action.payload,
      };
    case SET_VIS_NETWORK:
      return {
        ...state,
        visNetwork: action.payload,
      };
    case SET_FOUND_NODES:
      const string = action.payload;
      if (state.data && state.data.nodes) {
        const foundNodes = state.data.nodes.filter(
          (node) => node.id.toUpperCase().indexOf(string) >= 0
        );
        // console.log(foundNodes);
        // console.log(foundNodes.length);
        if (foundNodes && foundNodes.length > 0) {
          state.foundNodes = foundNodes;
          const position = findIdinGraph(foundNodes[0].id, state);
          if (position.x && position.y) {
            navigateGraph(
              foundNodes[0].id,
              position.x,
              position.y,
              0.9,
              state.visNetwork
            );
            state.selection = [foundNodes[0].id];
          }
        } else {
          state.foundNodes = null;
        }
      }
      return {
        ...state,
        loadingSearchJob: false,
        //foundNodes: action.payload,
      };
    case SET_PKL_CHANGES:
      return {
        ...state,
        pklchanges: action.payload,
      };
    case SET_LOADING_SEARCH_JOB:
      return {
        ...state,
        loadingSearchJob: true,
      };
    case SET_LOADING_JOB_MONITOR:
      return {
        ...state,
        loadingJobMonitor: true,
      };
    case SET_LOADING_PKL:
      return {
        ...state,
        loadingPkl: true,
      };
    case SET_AUTOUPDATE_PKL:
      return {
        ...state,
        startAutoUpdatePkl: action.payload,
      };
    case UPDATE_NODES:
      return {
        ...state,
        data: action.payload,
      };
    case CLEAN_ONLY_GRAH_DATA:
      return {
        ...state,
        data: null,
        selection: null,
        enabledGraphSearch: true,
        visNodes: null,
        visNetwork: null,
        foundNodes: null,
        current_grouped: "none",
        current_layout: "standard",
        graphSelectedNodes: null,
      };
    case SHOULD_UPDATE_GRAPH:
      return {
        ...state,
        shouldUpdateGraph: action.payload,
      };
    case CLEAN_GRAPH_DATA:
      return {
        ...state,
        data: null,
        selection: null,
        enabledGraphSearch: true,
        loadingGraph: false,
        loadingPkl: false,
        visNodes: null,
        visNetwork: null,
        foundNodes: null,
        experimentRunning: false,
        experiment: null,
        current_grouped: "none",
        current_layout: "standard",
        //allowJobMonitor: false,
        performancedata: null,
        canSelect: false,
        currentSelected: [],
        currentCommand: null,
        graphSelectedNodes: null,
        //startAutoUpdatePkl: false,
      };
    case CLEAN_PKL_DATA:
      return {
        ...state,
        shouldUpdateGraph: false,
        startAutoUpdatePkl: false,
        pklchanges: null,
      };
    case CLEAN_NAV_DATA:
      return {
        ...state,
        foundNodes: null,
        startAutoUpdatePkl: false,
        selection: null,
      };
    case UPDATE_SELECTION:
      return {
        ...state,
        selection: action.payload,
      };
    case UPDATE_GRAPH_SELECTED_NODES:
      //const selectedNodes = action.payload;
      state.graphSelectedNodes = null;
      state.currentCommandGraph = null;
      if (state.selection) {
        const currentSelectedNodes = state.visNetwork.getSelectedNodes();
        DEBUG && console.log(currentSelectedNodes);
        state.graphSelectedNodes = currentSelectedNodes;
      }
      return {
        ...state,
      };
    case SET_CURRENT_COMMAND:
      return {
        ...state,
        currentCommandGraph: action.payload,
        canCopyToClipboard: true,
      };
    // case DEACTIVATE_COPY_TO:
    //   return {
    //     ...state,
    //     canCopyToClipboard: false,
    //   };
    default:
      return null;
  }
};
