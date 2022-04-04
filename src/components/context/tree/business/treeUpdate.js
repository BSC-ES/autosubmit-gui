import { timeStampToDate } from "../../utils";

class TreeContentHandler {
  #currentJobs;
  #referenceHeaders;
  #pklInfo;
  #fancyTree;
  constructor(currentJobs, referenceHeaders, pklInfo, fancyTree) {
    this.#currentJobs = currentJobs;
    this.#referenceHeaders = referenceHeaders;
    this.#pklInfo = pklInfo;
    this.#fancyTree = fancyTree;
  }

  validate() {
    if (
      !this.#currentJobs ||
      !this.#referenceHeaders ||
      !this.#pklInfo ||
      !this.#fancyTree
    ) {
      return false;
    }
    return true;
  }

  processChanges() {
    const { packages } = this.#referenceHeaders;
    const { has_changed, pkl_timestamp } = this.#pklInfo;
    const packageNames = Object.keys(packages);
    let changes = "";
    let changesSummarized = "";

    for (let currentJob of this.#currentJobs) {
      const incomingJob = nameToIncomingJob.get(currentJob.id);
      if (this.#hasChanged(currentJob, incomingJob)) {
        const hasStatusChanged = this.#hasStatusChanged(
          currentJob,
          incomingJob
        );
        if (hasStatusChanged.hasChanged) {
          let jobChanges = this.#getStatusChangeMessages(
            currentJob,
            incomingJob,
            pkl_timestamp
          );
          changes += jobChanges.change;
          changesSummarized += jobChanges.changeShort;
        }
        this.#assignNewJobData(currentJob, incomingJob);
        const parentFolderName =
          this.#ifWrapperReceivedAddTreeParentAndReturnParentName(
            currentJob,
            incomingJob
          );
        this.#updateTitleOfAllFancyTreeNodesOf(currentJob, incomingJob);
        this.#addChildNodeToFancyTreeWrapperFolderIfNecessary(
          currentJob,
          parentFolderName
        );
        for (let folderName in currentJob.tree_parents) {
          let headerInfo = this.#referenceHeaders.hasOwnProperty(folderName)
            ? this.#referenceHeaders[folderName]
            : null;
          if (headerInfo) {
            this.#updateParentInformation(headerInfo, hasStatusChanged);
          } else {
            this.#createHeaderInfo(currentJob, folderName);
          }
          let newFolderName = this.#getNewNodeTitle(folderName, headerInfo);
          let parentFolder = this.#fancyTree.getNodesByRef(folderName);
          if (parentFolder) {
            parentFolder[0].setTitle(newFolderName);
          }
        }
      }
    }
  }

  #updateParentInformation(headerInfo, hasStatusChanged) {
    if (headerInfo) {
      this.#updateHeaderInfo(headerInfo, hasStatusChanged);
    }
  }

  #createHeaderInfo(currentJob, folderName) {
    this.#referenceHeaders[folderName] = {
      completed: 0,
      failed: 0,
      queuing: 0,
      running: 0,
      held: 0,
      total: 1,
    };

    switch (currentJob.status) {
      case "COMPLETED":
        this.#referenceHeaders[folderName].completed += 1;
      case "FAILED":
        this.#referenceHeaders[folderName].failed += 1;
      case "QUEUING":
        this.#referenceHeaders[folderName].queuing += 1;
      case "RUNNING":
        this.#referenceHeaders[folderName].running += 1;
      case "HELD":
        this.#referenceHeaders[folderName].held += 1;
    }
  }

  #updateHeaderInfo(headerInfo, hasStatusChanged) {
    if (hasStatusChanged.hasChanged) {
      switch (hasStatusChanged.newStatus) {
        case "COMPLETED":
          headerInfo.completed += 1;
        case "RUNNING":
          headerInfo.running += 1;
        case "QUEUING":
          headerInfo.queuing += 1;
        case "FAILED":
          headerInfo.failed += 1;
        case "HELD":
          headerInfo.held += 1;
        default:
          null;
      }
      switch (hasStatusChanged.oldStatus) {
        case "COMPLETED":
          headerInfo.completed -= 1;
        case "RUNNING":
          headerInfo.running -= 1;
        case "QUEUING":
          headerInfo.queuing -= 1;
        case "FAILED":
          headerInfo.failed -= 1;
        case "HELD":
          headerInfo.held -= 1;
        default:
          null;
      }
    }
  }

  #getNewNodeTitle(folderName, headerInfo) {
    const {
      completed_tag,
      running_tag,
      queuing_tag,
      failed_tag,
      held_tag,
      check_mark,
    } = this.#referenceHeaders;
    const newCompletedTag = completed_tag
      .replace("%C", headerInfo.completed)
      .replace("%T", headerInfo.total)
      .replace(
        "%B",
        headerInfo.completed === headerInfo.total ? "yellow" : "#ffffb3"
      );
    const newCheckMark =
      headerInfo.completed === headerInfo.total ? check_mark : "";
    const newRunningTag =
      headerInfo.running > 0
        ? running_tag.replace("%R", headerInfo.running)
        : "";
    const newQueuingTag =
      headerInfo.queuing > 0
        ? queuing_tag.replace("%Q", headerInfo.queuing)
        : "";
    const newFailedTag =
      headerInfo.failed > 0 ? failed_tag.replace("%F", headerInfo.failed) : "";
    const newHeldTag =
      headerInfo.held > 0 ? held_tag.replace("%H", headerInfo.held) : "";

    const newTitle =
      folderName +
      newCompletedTag +
      newFailedTag +
      newRunningTag +
      newQueuingTag +
      newHeldTag +
      newCheckMark;

    return newTitle;
  }

  #updateTitleOfAllFancyTreeNodesOf(currentJob, sameJobFromPkl) {
    let foundFancyTreeNodes = this.#fancyTree.getNodesByRef(currentJob.id);
    if (foundFancyTreeNodes) {
      for (let node of foundFancyTreeNodes) {
        node.setTitle(sameJobFromPkl.title);
      }
    } else {
      /* 
        The job doesn't exist in the tree and we should add it, but where?
        This sceneario implies that the structure of the experiment has changed.
        Therefore, the whole tree should be reloaded.
        TODO: Trigger some warning.
      */
    }
  }

  #addChildNodeToFancyTreeWrapperFolderIfNecessary(
    currentJob,
    parentFolderName
  ) {
    if (parentFolderName) {
      let wrapperFolder = this.#fancyTree.getNodesByRef(parentFolderName);
      if (wrapperFolder && wrapperFolder.length > 0) {
        const childrenNames = wrapperFolder[0].children.map((x) => x.refKey);
        if (!childrenNames.includes(currentJob.id)) {
          wrapperFolder.children.push({
            title: currentJob.title,
            refKey: currentJob.id,
            data: "Empty",
            children: [],
          });
          wrapperFolder.expanded = true;
        }
      } else {
        /* Wrapper Folder doesn't exist*/
      }
    }
  }

  #ifWrapperReceivedAddTreeParentAndReturnParentName(
    currentJob,
    sameJobFromPkl
  ) {
    let jobParentWrapperFolder = null;
    if (sameJobFromPkl.wrapper) {
      jobParentWrapperFolder = "Wrapper: " + sameJobFromPkl.wrapper;
      if (!currentJob.tree_parents.includes(jobParentWrapperFolder)) {
        currentJob.tree_parents.push(jobParentWrapperFolder);
      }
    }
    return jobParentWrapperFolder;
  }

  #getStatusChangeMessages(currentJob, sameJobFromPkl, pklTimeStamp) {
    let change =
      timeStampToDate(pklTimeStamp) +
      ": " +
      currentJob.id +
      " to " +
      sameJobFromPkl.status +
      "\n";
    let changeShort = sameJobFromPkl.status + " : " + currentJob.id + "\n";
    return { change, changeShort };
  }

  #hasChanged(currentJob, sameJobFromPkl) {
    if (
      sameJobFromPkl &&
      (currentJob.status_code !== sameJobFromPkl.status_code ||
        currentJob.minutes !== sameJobFromPkl.minutes ||
        currentJob.minutes_queue !== sameJobFromPkl.minutes_queue ||
        currentJob.wrapper !== sameJobFromPkl.wrapper)
    ) {
      return true;
    }
    return false;
  }

  #hasStatusChanged(currentJob, sameJobFromPkl) {
    let hasChanged = false;
    if (currentJob.status_code !== sameJobFromPkl.status_code) {
      return {
        hasChanged,
        oldStatus: currentJob.status,
        newStatus: sameJobFromPkl.status,
      };
    }
    return { hasChanged };
  }

  #assignNewJobData(currentJob, sameJobWithNewData) {
    currentJob.status_code = sameJobWithNewData.status_code;
    currentJob.status = sameJobWithNewData.status;
    currentJob.status_color = sameJobWithNewData.status_color;
    currentJob.minutes = sameJobWithNewData.minutes;
    currentJob.minutes_queue = sameJobWithNewData.minutes_queue;
    currentJob.wrapper = sameJobWithNewData.wrapper;
    currentJob.out = sameJobWithNewData.out;
    currentJob.err = sameJobWithNewData.err;
    currentJob.submit = sameJobWithNewData.submit;
    currentJob.start = sameJobWithNewData.start;
    currentJob.finish = sameJobWithNewData.finish;
    currentJob.rm_id = sameJobWithNewData.rm_id;
    currentJob.SYPD = sameJobWithNewData.SYPD;
    currentJob.wrapper_code = sameJobWithNewData.wrapper_id;
    currentJob.title = sameJobWithNewData.title;
  }
}

function processChanges(currentJobs, referenceHeaders, pklInfo) {
  result = { changes: "", changesSummarized: "", jobs: currentJobs };
  if (!currentJobs || !referenceHeaders || !pklInfo) {
    return result;
  }

  const { has_changed, pkl_content, pkl_timestamp } = pklInfo;

  const nameToIncomingJob = new Map();

  packageNames = Object.keys(currentPackages);

  pklContent.forEach((job) => nameToIncomingJob.set(job.name, job));

  for (let currentJob of currentJobs) {
    const incomingJob = nameToIncomingJob.get(currentJob.id);
  }
}
