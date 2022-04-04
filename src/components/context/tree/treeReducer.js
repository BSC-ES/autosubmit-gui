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
  GET_EXPERIMENT_RUN_JOBDATA,
  LOADING_PREVIOUS_RUN,
  SET_CURRENT_COMMAND,
  SET_CURRENT_TEXT_COMMAND,
  SET_WARNING_ACTIVE,
} from "../types";

// updateTreeData
import { buildRunTitle } from "../treeutils";

import { timeStampToDate, getReadyJobs } from "../utils";

import { DEBUG } from "../vars";

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
      const retrievedPklTree = action.payload;
      const nameToIncomingJob = new Map();
      if (
        state.treedata !== null &&
        retrievedPklTree.has_changed === true &&
        retrievedPklTree.pkl_content.length > 0
      ) {
        // Jobs currently on state
        let changes = "";
        let changesSummarized = "";
        const currentJobs = state.treedata.jobs;
        const referenceHeaders = state.treedata.reference;
        const currentPackages = Object.keys(referenceHeaders["packages"]);
        const completed_tag = referenceHeaders["completed_tag"];
        const running_tag = referenceHeaders["running_tag"];
        const queuing_tag = referenceHeaders["queuing_tag"];
        const failed_tag = referenceHeaders["failed_tag"];
        const held_tag = referenceHeaders["held_tag"];
        const check_mark = referenceHeaders["checkmark"];
        // Building dictionary of retrieved jobs
        retrievedPklTree.pkl_content.forEach((job) =>
          nameToIncomingJob.set(job.name, job)
        );

        // Updating current jobs
        for (let currentJob of currentJobs) {
          const incomingJob = nameToIncomingJob.get(currentJob.id);
          // If there is a difference
          if (
            incomingJob &&
            (currentJob.status_code !== incomingJob.status_code ||
              currentJob.minutes !== incomingJob.minutes ||
              currentJob.minutes_queue !== incomingJob.minutes_queue)
          ) {
            let isStatusChanged = false;
            let newStatus = currentJob.status;
            let old_status = incomingJob.status;
            // Detecting status change
            if (currentJob.status_code !== incomingJob.status_code) {
              isStatusChanged = true;
              newStatus = incomingJob.status;
              old_status = currentJob.status;
              changes +=
                timeStampToDate(retrievedPklTree.pkl_timestamp) +
                ": " +
                currentJob.id +
                " to " +
                newStatus +
                "\n";
              changesSummarized += newStatus + " : " + currentJob.id + "\n";
            }
            currentJob.status_code = incomingJob.status_code;
            currentJob.status = incomingJob.status;
            currentJob.status_color = incomingJob.status_color;
            currentJob.minutes = incomingJob.minutes; // The right meaning is TIME RUNNING IN SECONDS
            currentJob.minutes_queue = incomingJob.minutes_queue; // The right meaning is TIME QUEUEING IN SECONDS
            currentJob.wrapper = incomingJob.wrapper;
            currentJob.out = incomingJob.out;
            currentJob.err = incomingJob.err;
            currentJob.submit = incomingJob.submit;
            currentJob.start = incomingJob.start;
            currentJob.finish = incomingJob.finish;
            currentJob.rm_id = incomingJob.rm_id; // Id in the remote machine
            currentJob.SYPD = incomingJob.SYPD;

            // Parents are those groups to which a job belongs in the tree
            let tree_parent_wrapper = "Wrapper: " + incomingJob.wrapper;
            if (!currentJob.tree_parents.includes(tree_parent_wrapper)) {
              currentJob.tree_parents.push(tree_parent_wrapper);
            }
            currentJob.wrapper_code = incomingJob.wrapper_id;
            currentJob.title = incomingJob.title;
            // Find the corresponding node in the existing tree
            let existentNode = state.fancyTree.getNodesByRef(currentJob.id);
            if (existentNode) {
              // Update title of all node ocurrences
              for (let thenode_i in existentNode) {
                existentNode[thenode_i].setTitle(incomingJob.title);
              }

              // Make sure wrapper parent contains the children
              let wrapper_parent =
                state.fancyTree.getNodesByRef(tree_parent_wrapper);
              if (wrapper_parent && wrapper_parent.length > 0) {
                let children = wrapper_parent[0].children;
                if (children) {
                  let found_child = false;
                  for (let index_j in children) {
                    let current_name = children[index_j].refKey;
                    //console.log(current_name);
                    if (current_name === currentJob.id) {
                      found_child = true;
                    }
                  }
                  // If the job is not present in the wrapper folder, add it.
                  if (found_child === false) {
                    wrapper_parent[0].children.push({
                      title: currentJob.title,
                      refKey: currentJob.id,
                      data: "Empty",
                      children: [],
                    });
                  }
                }
              }
              // Find all parents of node
              const parents = currentJob.tree_parents;
              // Traverse parents to update title
              for (let parent in parents) {
                let header_data = referenceHeaders[parents[parent]];
                if (header_data) {
                  if (isStatusChanged === true) {
                    if (newStatus === "COMPLETED") {
                      header_data.completed += 1;
                    }
                    if (newStatus === "RUNNING") {
                      header_data.running += 1;
                    }
                    if (newStatus === "QUEUING") {
                      header_data.queuing += 1;
                    }
                    if (newStatus === "FAILED") {
                      header_data.failed += 1;
                    }
                    if (newStatus === "HELD") {
                      header_data.held += 1;
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
                    if (old_status === "COMPLETED") {
                      header_data.completed -= 1;
                    }
                    if (old_status === "HELD") {
                      header_data.held -= 1;
                    }
                  }
                  // Setting new title
                  const newCompletedTag = completed_tag
                    .replace("%C", header_data.completed)
                    .replace("%T", header_data.total)
                    .replace(
                      "%B",
                      header_data.completed === header_data.total
                        ? "yellow"
                        : "#ffffb3"
                    );
                  const newCheckMark =
                    header_data.completed === header_data.total
                      ? check_mark
                      : "";
                  const newRunningTag =
                    header_data.running > 0
                      ? running_tag.replace("%R", header_data.running)
                      : "";
                  const newQueuingTag =
                    header_data.queuing > 0
                      ? queuing_tag.replace("%Q", header_data.queuing)
                      : "";
                  const newFailedTag =
                    header_data.failed > 0
                      ? failed_tag.replace("%F", header_data.failed)
                      : "";
                  const newHeldTag =
                    header_data.held > 0
                      ? held_tag.replace("%H", header_data.held)
                      : "";
                  let theparent = state.fancyTree.getNodesByRef(
                    parents[parent]
                  );
                  if (theparent) {
                    //Sets new title
                    let new_title =
                      parents[parent] +
                      newCompletedTag +
                      newFailedTag +
                      newRunningTag +
                      newQueuingTag +
                      newHeldTag +
                      newCheckMark;
                    theparent[0].setTitle(new_title);
                  }
                }
              }
            }
          }
        }

        const packages_from_pkl = Object.keys(retrievedPklTree["packages"]);
        for (let package_pkl of packages_from_pkl) {
          const wrapper_pre_title = "Wrapper: " + package_pkl;
          const packagesInTree =
            state.fancyTree.getNodesByRef(wrapper_pre_title);
          if (
            !currentPackages.includes(package_pkl) &&
            packagesInTree === null
          ) {
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

            referenceHeaders[wrapper_pre_title] = {
              completed: 0,
              failed: 0,
              queuing: 0,
              running: 0,
              held: 0,
              total: 0,
            };
            let header_wrapper = referenceHeaders[wrapper_pre_title];
            // eslint-disable-next-line no-loop-func
            let children_jobs = currentJobs.filter(function (x) {
              return x.wrapper === package_pkl;
            });
            let children_list = [];
            for (let wrappedJob in children_jobs) {
              if (wrappedJob.status === "COMPLETED") {
                header_wrapper.completed += 1;
              } else if (wrappedJob.status === "FAILED") {
                header_wrapper.failed += 1;
              } else if (wrappedJob.status === "QUEUING") {
                header_wrapper.queuing += 1;
              } else if (wrappedJob.status === "RUNNING") {
                header_wrapper.running += 1;
              } else if (wrappedJob.status === "HELD") {
                header_wrapper.held += 1;
              }
              children_list.push({
                title: wrappedJob.title,
                refKey: wrappedJob.id,
                data: "Empty",
                children: [],
              });
            }
            header_wrapper.total = children_jobs.length;

            const newCompletedTag = completed_tag
              .replace("%C", header_wrapper.completed)
              .replace("%T", header_wrapper.total)
              .replace(
                "%B",
                header_wrapper.completed === header_wrapper.total
                  ? "yellow"
                  : "#ffffb3"
              );
            const newCheckMark =
              header_wrapper.completed === header_wrapper.total
                ? check_mark
                : "";
            const newRunningTag =
              header_wrapper.running > 0
                ? running_tag.replace("%R", header_wrapper.running)
                : "";
            const newQueuingTag =
              header_wrapper.queuing > 0
                ? queuing_tag.replace("%Q", header_wrapper.queuing)
                : "";
            const newFailedTag =
              header_wrapper.failed > 0
                ? failed_tag.replace("%F", header_wrapper.failed)
                : "";
            const newHeldTag =
              header_wrapper.held > 0
                ? held_tag.replace("%H", header_wrapper.held)
                : "";

            const wrapperTitle =
              wrapper_pre_title +
              newCompletedTag +
              newFailedTag +
              newRunningTag +
              newQueuingTag +
              newHeldTag +
              newCheckMark;
            let rootNode = state.fancyTree.getRootNode();
            // eslint-disable-next-line no-unused-vars
            let wrapper_branch_root = rootNode.addChildren({
              title: wrapperTitle,
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
