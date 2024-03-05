import { timeStampToDate } from "../../utils";

export default class TreeContentHandler {
  constructor(currentJobs, referenceHeaders, pklInfo, replaceJobsInPlace = true) {
    if(replaceJobsInPlace){
      this.currentJobs = currentJobs;
      this.referenceHeaders = referenceHeaders;
    } else {
      this.currentJobs = JSON.parse(JSON.stringify(currentJobs));
      this.referenceHeaders = JSON.parse(JSON.stringify(referenceHeaders));
    }
    this.pklInfo = pklInfo;
  }

  validate() {
    if (!this.currentJobs || !this.referenceHeaders || !this.pklInfo) {
      return false;
    }
    return true;
  }

  processChanges(fancyTree) {
    const { has_changed, pkl_timestamp, pkl_content } = this.pklInfo;
    let changes = "";
    let changesSummarized = "";
    const nameToIncomingJob = new Map();
    pkl_content.forEach((job) => nameToIncomingJob.set(job.name, job));
    for (let currentJob of this.currentJobs) {
      const incomingJob = nameToIncomingJob.get(currentJob.id);
      if (has_changed && this.hasJobDataChanged(currentJob, incomingJob)) {
        const hasStatusChanged = this.hasJobDataStatusChanged(
          currentJob,
          incomingJob
        );
        if (hasStatusChanged.hasChanged) {
          const jobChanges = this.getStatusChangeMessages(
            currentJob,
            incomingJob,
            pkl_timestamp
          );
          changes += jobChanges.change;
          changesSummarized += jobChanges.changeShort;
        }
        this.assignNewJobData(currentJob, incomingJob);
        const wrapperFolderName =
          this.ifWrapperReceivedAddTreeParentAndReturnWrapperParentName(
            currentJob,
            incomingJob
          );
        this.updateTitleOfAllFancyTreeNodesOf(
          currentJob,
          incomingJob,
          fancyTree
        );
        if (wrapperFolderName) {
          const wrapperFolder = fancyTree.getNodesByRef(wrapperFolderName);
          if (wrapperFolder) {
            if (
              !wrapperFolder[0].children
                .map((node) => node.refKey)
                .includes(currentJob.id)
            ) {
              this.addChildNodeToFancyTreeWrapperFolder(
                currentJob,
                wrapperFolder[0]
              );
            }
          } else {
            // Add Wrapper Folder
            this.createHeaderInfo(wrapperFolderName);
            const rootNode = fancyTree.getRootNode();
            let newWrapperFolder = this.addNewWrapperFolderFor(
              wrapperFolderName,
              rootNode
            );
            this.addChildNodeToFancyTreeWrapperFolder(
              currentJob,
              newWrapperFolder
            );
            const wrapperChanges = this.getNewWrapperMessages(
              currentJob.wrapper_code,
              pkl_timestamp
            );
            changes += wrapperChanges.change;
            changesSummarized += wrapperChanges.changeShort;
          }
        }

        for (let folderName of currentJob.tree_parents) {
          let headerInfo = this.referenceHeaders[folderName];
          const parentFolder = fancyTree.getNodesByRef(folderName)[0];
          if (folderName.startsWith("Wrapper")) {
            headerInfo.total = parentFolder.getChildren().length;
          }
          this.updateHeaderInfoStatusCounters(headerInfo, hasStatusChanged);
          parentFolder.setTitle(this.getNewFolderTitle(folderName, headerInfo));
        }
      }
    }

    return {
      changes,
      changesSummarized,
      currentJobs: this.currentJobs,
      currentReference: this.referenceHeaders,
      treeRep: this.fancyTree,
    };
  }

  createHeaderInfo(parentFolderName) {
    this.referenceHeaders[parentFolderName] = {
      completed: 0,
      failed: 0,
      queuing: 0,
      running: 0,
      held: 0,
      total: 1,
    };
  }

  updateHeaderInfoStatusCounters(headerInfo, hasStatusChanged) {
    if (hasStatusChanged.hasChanged) {
      switch (hasStatusChanged.newStatus) {
        case "COMPLETED":
          headerInfo.completed += 1;
          break;
        case "RUNNING":
          headerInfo.running += 1;
          break;
        case "QUEUING":
          headerInfo.queuing += 1;
          break;
        case "FAILED":
          headerInfo.failed += 1;
          break;
        case "HELD":
          headerInfo.held += 1;
          break;
        default:
          break;
      }
      switch (hasStatusChanged.oldStatus) {
        case "COMPLETED":
          headerInfo.completed -= 1;
          break;
        case "RUNNING":
          headerInfo.running -= 1;
          break;
        case "QUEUING":
          headerInfo.queuing -= 1;
          break;
        case "FAILED":
          headerInfo.failed -= 1;
          break;
        case "HELD":
          headerInfo.held -= 1;
          break;
        default:
          break;
      }
    }
  }

  getNewFolderTitle(folderName, headerInfo) {
    const {
      completed_tag,
      running_tag,
      queuing_tag,
      failed_tag,
      held_tag,
      checkmark,
    } = this.referenceHeaders;
    const newCompletedTag = completed_tag
      .replace("%C", headerInfo.completed)
      .replace("%T", headerInfo.total)
      .replace(
        "%B",
        headerInfo.completed === headerInfo.total ? "yellow" : "#ffffb3"
      );
    const newCheckMark =
      headerInfo.completed === headerInfo.total ? checkmark : "";
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

  updateTitleOfAllFancyTreeNodesOf(currentJob, sameJobFromPkl, fancyTree) {
    const foundFancyTreeNodes = fancyTree.getNodesByRef(currentJob.id);
    if (foundFancyTreeNodes) {
      for (let i in foundFancyTreeNodes) {
        foundFancyTreeNodes[i].setTitle(sameJobFromPkl.title);
      }
    } else {
      /* 
        The job doesn't exist in the tree and we should add it, but where?
        This sceneario implies that the structure of the experiment has changed.
        Therefore, the whole tree should be reloaded.
        TODO: Trigger some warning.
      */
      throw new Error("Sorry but you must refresh the page.");
    }
  }

  addChildNodeToFancyTreeWrapperFolder(currentJob, wrapperFolder) {
    wrapperFolder.addChildren({
      title: currentJob.title,
      refKey: currentJob.id,
      data: "Empty",
      children: [],
    });
  }

  addNewWrapperFolderFor(parentFolderName, rootNode) {
    return rootNode.addChildren({
      title: this.getNewFolderTitle(
        parentFolderName,
        this.referenceHeaders[parentFolderName]
      ),
      folder: true,
      refKey: parentFolderName,
      expanded: true,
      children: [],
    });
  }

  ifWrapperReceivedAddTreeParentAndReturnWrapperParentName(
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

  getStatusChangeMessages(currentJob, sameJobFromPkl, pklTimeStamp) {
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

  getNewWrapperMessages(packageName, pklTimeStamp) {
    let change =
      timeStampToDate(pklTimeStamp) + ": " + packageName + " has been added.\n";
    let changeShort = "Wrapper " + packageName + " added.\n";
    return { change, changeShort };
  }

  hasJobDataChanged(currentJob, sameJobFromPkl) {
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

  hasJobDataStatusChanged(currentJob, sameJobFromPkl) {
    if (currentJob.status_code !== sameJobFromPkl.status_code) {
      return {
        hasChanged: true,
        oldStatus: currentJob.status,
        newStatus: sameJobFromPkl.status,
      };
    }
    return { hasChanged: false };
  }

  assignNewJobData(currentJob, sameJobWithNewData) {
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
