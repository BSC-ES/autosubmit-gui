import {
  GET_TREE,
  SET_LOADING_TREE_PKL,
  SET_LOADING_TREE,
  SET_LOADING_TREE_REFRESH,
  SET_LOADING_FILTER,
  FILTER_TREEVIEW,
  PKL_TREE_LOADED,
  SET_FANCYTREE,
  CLEAN_TREE_DATA,
  CLEAN_TREE_PKL_DATA,
  SET_AUTOUPDATE_TREE_PKL,
  UPDATE_SELECTION_TREE,
  CLEAR_FILTER_TREE,
  SET_START_TREE_SELECTION,
  SET_NOTIFICATION_TITLE_TREE,
  SET_OFF_LOADING_TREE,
  INCREASE_LOADING_TREE,
  UPDATE_TREE_SELECTED_NODES,
  EXPAND_ALL_TREE_DATA,
  SAVE_TREE_LAYOUT,
  RESET_TREE_LAYOUT,
  COLLAPSE_ALL_TREE_DATA,
  GET_EXPERIMENT_RUN_JOBDATA,
  LOADING_PREVIOUS_RUN,
  SET_CURRENT_COMMAND,
  SET_CURRENT_TEXT_COMMAND,
  SET_WARNING_ACTIVE,
} from "../types";

// updateTreeData
import { buildRunTitle, expandTreeRecurisvely } from "../treeutils";
import { getReadyJobs } from "../utils";
import { DEBUG } from "../vars";
import TreeContentHandler from "./business/treeUpdate";

/* eslint import/no-anonymous-default-export: ["error", {"allowArrowFunction": true}] */
export default (state, action) => {
  switch (action.type) {
    case GET_TREE:
      const { jobs, warningMessage } = action.payload;
      return {
        ...state,
        treedata: action.payload,
        loadingTree: false,
        enabledTreeSearch: true,
        elapsedLoadingTree: 1,
        currentRunIdOnTree: null,
        treeReady: getReadyJobs(jobs),
        warningActive: warningMessage,
      };
    case SET_LOADING_TREE_PKL:
      return {
        ...state,
        loadingTreePkl: true,
      };
    case SET_LOADING_TREE:
      return {
        ...state,
        loadingTree: true,
        enabledTreeSearch: false,
      };
    case SET_OFF_LOADING_TREE:
      return {
        ...state,
        loadingTree: false,
        enabledTreeSearch: false,
        elapsedLoadingTree: 1,
        treedata: null,
      };
    case INCREASE_LOADING_TREE:
      return {
        ...state,
        elapsedLoadingTree: state.elapsedLoadingTree + 1,
      };
    case SET_LOADING_TREE_REFRESH:
      return {
        ...state,
        loadingTreeRefresh: true,
      };
    case SET_LOADING_FILTER:
      return {
        ...state,
        loadingFilterTree: true,
      };
    case PKL_TREE_LOADED: {
      let treeUpdater = new TreeContentHandler(
        state.treedata.jobs,
        state.treedata.reference,
        action.payload
      );

      if (state.fancyTree && treeUpdater.validate()) {
        const processResult = treeUpdater.processChanges(state.fancyTree);
        if (state.pkltreechanges) {
          state.pkltreechanges = processResult.changes + state.pkltreechanges;
          state.notificationTitleTree = processResult.changesSummarized;
          state.treeReady = getReadyJobs(state.treedata.jobs);
        } else {
          state.pkltreechanges = processResult.changes;
        }
      }

      return {
        ...state,
        loadingTreeRefresh: false,
        loadingTreePkl: false,
      };
    }
    case GET_EXPERIMENT_RUN_JOBDATA: {
      const { result, runId, meta } = action.payload;
      const { jobs } = result;
      const completed_jobs =
        jobs !== null && jobs !== undefined
          ? jobs.filter((x) => x.status === "COMPLETED")
          : [];

      if (state.treedata && state.fancyTree) {
        //updateTreeData(result, state.treedata, state.fancyTree);
        //updateFancyTree(runDetail, state.fancyTree);
      }
      state.initialTreeLayout = JSON.parse(JSON.stringify(result));
      return {
        ...state,
        currentRunIdOnTree: {
          runId: runId,
          created: meta.created,
          message: buildRunTitle(runId, meta, completed_jobs.length),
        },
        treedata: result,
        loadingTree: false,
        enabledTreeSearch: true,
        elapsedLoadingTree: 1,
        startAutoUpdateTreePkl: false,
        loadingPreviousRun: false,
        treeReady: getReadyJobs(jobs),
      };
    }
    case FILTER_TREEVIEW:
      const string = String(action.payload).toUpperCase();
      if (state.treedata && state.fancyTree) {
        let count = 0;
        const isNegation = string.indexOf("!") === 0;
        if (string.indexOf("*") > -1) {
          const fields =
            isNegation === true
              ? string.substring(1).split("*")
              : string.split("*");
          count = state.fancyTree.filterNodes(function (node) {
            let result = false;
            let string_test = String(node.title).toUpperCase();
            for (let i = 0; i < fields.length; i++) {
              if (fields[i].length > 0) {
                if (string_test.indexOf(fields[i]) > -1) {
                  //debug && console.log(fields[i] + " found in " + string_test);
                  let found_index =
                    string_test.indexOf(fields[i]) + fields[i].length;
                  string_test = string_test.substring(found_index);
                  //debug && console.log(found_index + " in " + string_test);
                  if (isNegation) {
                    result = false;
                    break;
                  } else {
                    result = true;
                  }
                } else {
                  // debug &&
                  //   console.log(fields[i] + " Not found in " + string_test);
                  if (isNegation) {
                    result = true;
                  } else {
                    result = false;
                    break;
                  }
                }
              }
            }
            return result;
          });
        } else {
          const searchString =
            isNegation === true ? string.substring(1) : string;
          count = state.fancyTree.filterNodes(function (node) {
            let result = false;
            let stringTest = String(node.title).toUpperCase();
            if (stringTest.indexOf(searchString) > -1) {
              if (isNegation) {
                result = false;
              } else {
                result = true;
              }
            } else {
              if (isNegation) {
                result = true;
              } else {
                result = false;
              }
            }
            return result;
          });
        }
        //debug && console.log(count);
        state.returnFilter = count;
      } else {
        state.returnFilter = 0;
      }
      return {
        ...state,
        loadingFilterTree: false,
        returnFilter: action.payload,
      };
    case SET_FANCYTREE:
      return {
        ...state,
        fancyTree: action.payload,
      };
    case SET_AUTOUPDATE_TREE_PKL:
      return {
        ...state,
        startAutoUpdateTreePkl: action.payload,
      };
    case CLEAN_TREE_DATA:
      return {
        ...state,
        treedata: null,
        enabledTreeSearch: true,
        loadingTree: false,
        loadingTreePkl: false,
        fancyTree: null,
        returnFiler: 0,
        elapsedLoadingTree: 1,
        currentRunIdOnTree: null,
        treeReady: null,
        warningActive: null,
        //canSelect: false,
      };
    case CLEAN_TREE_PKL_DATA:
      return {
        ...state,
        startAutoUpdateTreePkl: false,
        pkltreechanges: null,
      };
    case CLEAR_FILTER_TREE:
      if (state.treedata && state.fancyTree) {
        state.fancyTree.clearFilter();
      }
      return {
        ...state,
        returnFilter: 0,
      };
    case UPDATE_SELECTION_TREE:
      DEBUG && console.log("Node");
      DEBUG && console.log(action.payload.node);
      if (action.payload && action.payload.node && action.payload.node.folder) {
        DEBUG && console.log("Folder");
        return {
          ...state,
          selectedTreeNode: null,
          currentCommandTree: null,
          currentTextCommandTree: null,
        };
      } else {
        DEBUG && console.log("Node Child");
        return {
          ...state,
          selectedTreeNode: action.payload,
          currentCommandTree: null,
          currentTextCommandTree: null,
        };
      }
    case UPDATE_TREE_SELECTED_NODES:
      //const selectedNodes = action.payload;
      state.treeSelectedNodes = null;
      state.currentCommandTree = null;
      state.currentTextCommandTree = null;
      if (state.selectedTreeNode) {
        const currentSelectedNodes = state.fancyTree.getSelectedNodes();
        DEBUG && console.log(currentSelectedNodes);
        let arrayNames = [];
        if (currentSelectedNodes.length > 0) {
          currentSelectedNodes.map((job) => arrayNames.push(job.refKey));
        }
        state.treeSelectedNodes = arrayNames;
        DEBUG && console.log(arrayNames);
      }
      return {
        ...state,
      };
    case EXPAND_ALL_TREE_DATA:
      let td_expanded = expandTreeRecurisvely(state.treedata, true)
      state.fancyTree.reload(td_expanded.tree)
      // state.fancyTree.setExpanded(true)
      return {
        ...state,
        treedata: td_expanded
      };
    case COLLAPSE_ALL_TREE_DATA:
      let td_collapsed = expandTreeRecurisvely(state.treedata, false)
      state.fancyTree.reload(td_collapsed.tree)
      // state.fancyTree.setExpanded(true)
      return {
        ...state,
        treedata: td_collapsed
      };
    case SAVE_TREE_LAYOUT:
      state.initialTreeLayout = JSON.parse(JSON.stringify(state.treedata));
      return {
        ...state,
      };
    case RESET_TREE_LAYOUT:
      state.treedata = JSON.parse(JSON.stringify(state.initialTreeLayout));
      state.fancyTree.reload(state.treedata.tree)
      return {
        ...state,
      };
    case SET_START_TREE_SELECTION:
      if (state.fancyTree) {
        state.fancyTree.activeNode = state.fancyTree.rootNode;
      }
      return {
        ...state,
      };
    case SET_NOTIFICATION_TITLE_TREE:
      return {
        ...state,
        notificationTitleTree: action.payload,
      };
    case LOADING_PREVIOUS_RUN:
      return {
        ...state,
        loadingPreviousRun: true,
      };
    case SET_CURRENT_COMMAND:
      return {
        ...state,
        currentCommandTree: action.payload,
        //canCopyToClipboard: true,
      };
    case SET_CURRENT_TEXT_COMMAND:
      return {
        ...state,
        currentTextCommandTree: action.payload,
        //canCopyToClipboard: true,
      };
    case SET_WARNING_ACTIVE:
      return {
        ...state,
        warningActive: action.payload,
      };
    default:
      return null;
  }
};
