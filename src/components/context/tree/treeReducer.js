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
  //UPDATE_RUNDETAIL_ON_TREE,
  UPDATE_TREE_SELECTED_NODES,
  GET_EXPERIMENT_RUN_JOBDATA,
  LOADING_PREVIOUS_RUN,
  SET_CURRENT_COMMAND,
  SET_CURRENT_TEXT_COMMAND,
  SET_WARNING_ACTIVE,
  //CLEAR_RUNDETAIL_ON_TREE,
} from "../types";

// updateTreeData
import { buildRunTitle } from "../treeutils";

import { timeStampToDate, getReadyJobs } from "../utils";

import { DEBUG } from "../vars";

/* eslint import/no-anonymous-default-export: ["error", {"allowArrowFunction": true}] */
export default (state, action) => {
  switch (action.type) {
    case GET_TREE:      
      const { jobs } = action.payload;
      return {
        ...state,
        treedata: action.payload,
        loadingTree: false,
        enabledTreeSearch: true,
        elapsedLoadingTree: 1,
        currentRunIdOnTree: null,
        treeReady: getReadyJobs(jobs),
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
      const retrievedPklTree = action.payload;
      //console.log(retrievedPklTree);
      //console.log(state.treedata);
      let jobs = {};
      if (
        state.treedata !== null &&
        retrievedPklTree.has_changed === true &&
        retrievedPklTree.pkl_content.length > 0
      ) {
        // Jobs currently on state
        let changes = "";
        let changesSummarized = "";
        let currentJobs = state.treedata.jobs;
        //console.log(currentJobs);
        let referenceHeaders = state.treedata.reference;
        let currentPackages = referenceHeaders["packages"];
        const completed_tag = referenceHeaders["completed_tag"];
        const running_tag = referenceHeaders["running_tag"];
        const queuing_tag = referenceHeaders["queuing_tag"];
        const failed_tag = referenceHeaders["failed_tag"];
        const check_mark = referenceHeaders["check_mark"];

        // Building dictionary of retrieved jobs
        for (let j = 0, job; j < retrievedPklTree.pkl_content.length; j++) {
          job = retrievedPklTree.pkl_content[j];
          jobs[job.name] = job;
          //console.log(job.name);
        }
        // Updating current jobs
        for (let i = 0, cjob, ijob; i < currentJobs.length; i++) {
          // Job from current jobs
          cjob = currentJobs[i];
          // Job from pkl. Name is id in treedata.
          ijob = jobs[cjob.id];
          //console.log(ijob);
          // If there is a difference
          if (
            ijob &&
            (cjob.status_code !== ijob.status_code ||
              cjob.minutes !== ijob.minutes ||
              cjob.minutes_queue !== ijob.minutes_queue)
          ) {
            let is_change_status = false;
            let new_status = cjob.status;
            let old_status = ijob.status;
            // Detecting status change
            if (cjob.status_code !== ijob.status_code) {
              is_change_status = true;
              new_status = ijob.status;
              old_status = cjob.status;
              changes +=
                timeStampToDate(retrievedPklTree.pkl_timestamp) +
                ": " +
                cjob.id +
                " to " +
                new_status +
                "\n";
              changesSummarized += new_status + " : " + cjob.id + "\n";
            }
            cjob.status_code = ijob.status_code;
            cjob.status = ijob.status;
            cjob.status_color = ijob.status_color;
            cjob.minutes = ijob.minutes;
            cjob.minutes_queue = ijob.minutes_queue;
            cjob.wrapper = ijob.wrapper;
            cjob.out = ijob.out;
            cjob.err = ijob.err;
            cjob.submit = ijob.submit;
            cjob.start = ijob.start;
            cjob.finish = ijob.finish;
            cjob.rm_id = ijob.rm_id;
            // Update SYPD is exists
            if (cjob.SYPD !== undefined) {
              cjob.SYPD = ijob.SYPD;
            }
            // Parents are those groups to which a job belongs in the tree
            let tree_parent_wrapper = "Wrapper: " + ijob.wrapper;
            if (!cjob.tree_parents.includes(tree_parent_wrapper)) {
              cjob.tree_parents.push(tree_parent_wrapper);
            }
            // Assign wrapper code to current job
            cjob.wrapper_code = ijob.wrapper_id;
            // Building title according to retrieved data
            let newTitle =
              ijob.title +
              " " +
              (cjob.parents === 0 ? retrievedPklTree.source_tag : "") +
              (cjob.children === 0 ? retrievedPklTree.target_tag : "") +
              (cjob.sync === true ? retrievedPklTree.sync_tag : "") +
              (ijob.wrapper_id !== 0 ? ijob.wrapper_tag : "");
            cjob.title = newTitle;
            // Find the corresponding node in the existing tree
            let thenode = state.fancyTree.getNodesByRef(cjob.id);
            if (thenode) {
              // Update title of all node ocurrences
              for (let thenode_i in thenode) {
                thenode[thenode_i].setTitle(newTitle);
              }
              // Find all parents of node
              const parents = cjob.tree_parents;
              // Make sure parents contain the children
              let wrapper_parent = state.fancyTree.getNodesByRef(
                tree_parent_wrapper
              );
              //console.log(wrapper_parent);
              if (wrapper_parent && wrapper_parent.length > 0) {
                let children = wrapper_parent[0].children;
                //console.log(children);
                let found_child = false;
                for (let index_j in children) {
                  let current_name = children[index_j].refKey;
                  //console.log(current_name);
                  if (current_name === cjob.id) {
                    found_child = true;
                  }
                }
                // If the job is not present in the wrapper folder, add it.
                if (found_child === false) {
                  wrapper_parent[0].children.push({
                    title: cjob.title,
                    refKey: cjob.id,
                    data: "Empty",
                    children: [],
                  });
                }
              }
              // Traverse parents to update title
              for (let parent in parents) {
                let header_data = referenceHeaders[parents[parent]];
                if (header_data) {
                  if (is_change_status === true) {
                    if (new_status === "COMPLETED") {
                      header_data.completed += 1;
                    }
                    if (new_status === "RUNNING") {
                      header_data.running += 1;
                    }
                    if (new_status === "QUEUING") {
                      header_data.queuing += 1;
                    }
                    if (new_status === "FAILED") {
                      header_data.failed += 1;
                    }
                    if (old_status === "RUNNING") {
                      header_data.running -= 1;
                    }
                    if (old_status === "QUEUING") {
                      header_data.queuing -= 1;
                    }
                    if (old_status === "FAILED") {
                      header_data.failed -= 1;
                    }
                    if (old_status === "COMPLETED"){
                      header_data.completed -= 1;
                    }
                  }
                  // Setting new title
                  const new_completed_tag = completed_tag
                    .replace("%C", header_data.completed)
                    .replace("%T", header_data.total)
                    .replace(
                      "%B",
                      header_data.completed === header_data.total
                        ? "yellow"
                        : "#ffffb3"
                    );
                  const new_check_mark =
                    header_data.completed === header_data.total
                      ? check_mark
                      : "";
                  const new_running_tag =
                    header_data.running > 0
                      ? running_tag.replace("%R", header_data.running)
                      : "";
                  const new_queuing_tag =
                    header_data.queuing > 0
                      ? queuing_tag.replace("%Q", header_data.queuing)
                      : "";
                  const new_failed_tag =
                    header_data.failed > 0
                      ? failed_tag.replace("%F", header_data.failed)
                      : "";
                  let theparent = state.fancyTree.getNodesByRef(
                    parents[parent]
                  );
                  //console.log(parent);
                  if (theparent) {
                    //Sets new title
                    let new_title =
                      parents[parent] +
                      new_completed_tag +
                      new_failed_tag +
                      new_running_tag +
                      new_queuing_tag +
                      new_check_mark;
                    theparent[0].setTitle(new_title);
                  }
                }
              }
            }
          }
        }
        const packages_from_pkl = retrievedPklTree["packages"];
        for (let package_pkl of packages_from_pkl) {
          if (!currentPackages.includes(package_pkl)) {
            changes +=
              timeStampToDate(retrievedPklTree.pkl_timestamp) +
              ": " +
              package_pkl +
              " has been added." +
              "\n";
            changesSummarized += "Wrapper " + package_pkl + " added.\n";
            // If a new wrapper has been found in the pkl
            // debug && console.log("New wrapper found: " + package_pkl);
            currentPackages.push(package_pkl);
            //console.log(currentPackages);
            let wrapper_pre_title = "Wrapper: " + package_pkl;
            referenceHeaders[wrapper_pre_title] = {
              completed: 0,
              failed: 0,
              queuing: 0,
              running: 0,
              total: 0,
            };
            let header_wrapper = referenceHeaders[wrapper_pre_title];
            // eslint-disable-next-line no-loop-func
            let children_jobs = currentJobs.filter(function (x) {
              return x.wrapper === package_pkl;
            });
            let children_list = [];
            for (let k = 0; k < children_jobs.length; k++) {
              if (children_jobs[k].status === "COMPLETED") {
                header_wrapper.completed += 1;
              } else if (children_jobs[k].status === "FAILED") {
                header_wrapper.failed += 1;
              } else if (children_jobs[k].status === "QUEUING") {
                header_wrapper.queuing += 1;
              } else if (children_jobs[k].status === "RUNNING") {
                header_wrapper.running += 1;
              }
              children_list.push({
                title: children_jobs[k].title,
                refKey: children_jobs[k].id,
                data: "Empty",
                children: [],
              });
            }
            header_wrapper.total = children_jobs.length;

            const new_completed_tag = completed_tag
              .replace("%C", header_wrapper.completed)
              .replace("%T", header_wrapper.total)
              .replace(
                "%B",
                header_wrapper.completed === header_wrapper.total
                  ? "yellow"
                  : "#ffffb3"
              );
            const new_check_mark =
              header_wrapper.completed === header_wrapper.total
                ? check_mark
                : "";
            const new_running_tag =
              header_wrapper.running > 0
                ? running_tag.replace("%R", header_wrapper.running)
                : "";
            const new_queuing_tag =
              header_wrapper.queuing > 0
                ? queuing_tag.replace("%Q", header_wrapper.queuing)
                : "";
            const new_failed_tag =
              header_wrapper.failed > 0
                ? failed_tag.replace("%F", header_wrapper.failed)
                : "";
            const wrapper_title =
              wrapper_pre_title +
              new_completed_tag +
              new_failed_tag +
              new_running_tag +
              new_queuing_tag +
              new_check_mark;
            let rootNode = state.fancyTree.getRootNode();
            // eslint-disable-next-line no-unused-vars
            let wrapper_branch_root = rootNode.addChildren({
              title: wrapper_title,
              folder: true,
              refKey: wrapper_pre_title,
              expanded: false,
              children: children_list,
            });
          }
        }
        // if require update
        if (retrievedPklTree.has_changed === true) {
          if (state.pkltreechanges) {
            state.pkltreechanges = changes + state.pkltreechanges;
            state.notificationTitleTree = changesSummarized;
            state.treeReady = getReadyJobs(currentJobs);
            //setPklTreeChanges(changes + state.pkltreechanges);
          } else {
            state.pkltreechanges = changes;
            //setPklTreeChanges(changes);
          }
        }
      }
      return {
        ...state,
        loadingTreeRefresh: false,
        loadingTreePkl: false,
      };
    }
    case GET_EXPERIMENT_RUN_JOBDATA:
      {
        const { result, runId, meta } = action.payload;
        const { jobs } = result;
        const completed_jobs = jobs !== null && jobs !== undefined ? jobs.filter(x => x.status === "COMPLETED") : [];

        if (state.treedata && state.fancyTree){
          //updateTreeData(result, state.treedata, state.fancyTree);
          //updateFancyTree(runDetail, state.fancyTree);

        }
        return {
          ...state,
          currentRunIdOnTree : {runId: runId, message: buildRunTitle(runId, meta, completed_jobs.length)},
          treedata: result,
          loadingTree: false,
          enabledTreeSearch: true,
          elapsedLoadingTree: 1,        
          startAutoUpdateTreePkl: false,
          loadingPreviousRun: false,
          treeReady: getReadyJobs(jobs),
        }
      }
    case FILTER_TREEVIEW:
      const string = String(action.payload).toUpperCase();
      if (state.treedata && state.fancyTree) {
        let count = 0;
        const isNegation = string.indexOf('!') === 0;
        if (string.indexOf("*") > -1) {
          const fields = isNegation === true ? string.substring(1).split('*') : string.split("*");          
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
                  if (isNegation){
                    result = false;
                    break;
                  } else {
                    result = true;
                  }
                  
                } else {
                  // debug &&
                  //   console.log(fields[i] + " Not found in " + string_test);
                  if (isNegation){
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
          const searchString = isNegation === true ? string.substring(1) : string;
          count = state.fancyTree.filterNodes(function (node) {
            let result = false;
            let stringTest = String(node.title).toUpperCase();
            if (stringTest.indexOf(searchString) > -1){
              if (isNegation){
                result = false;
              } else {
                result = true;
              }
            } else {
              if (isNegation){
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
    case SET_WARNING_ACTIVE:
      return {
        ...state,
        warningActive: action.payload,
      }
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
      if (action.payload && action.payload.node && action.payload.node.folder){        
        DEBUG && console.log("Folder")
        return {
          ...state,
          selectedTreeNode: null,
          currentCommandTree: null,
          currentTextCommandTree: null,
        }
      } else {
        DEBUG && console.log("Node Child")
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
        if (currentSelectedNodes.length > 0){
          currentSelectedNodes.map((job) => arrayNames.push(job.refKey));
        }
        state.treeSelectedNodes = arrayNames;
        DEBUG && console.log(arrayNames);
      }
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
    default:
      return null;
  }
};
