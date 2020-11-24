// runData: array of jobs from previous run
// treedata: current experiment data (visualized in tree view)
// fancyTree: fancyTree object from states
export const updateTreeData = (runData, treedata, fancyTree) => {
  //const updatedData = {};
  // console.log(fancyTree);
  if(!runData) {
    return;
  }
  let currentJobNames = new Map();
  let parentCompletedMap = new Map();
  let parentFailedMap = new Map();
  runData.forEach((item) => currentJobNames[String(item.job_name)] = item);
  // console.log(currentJobNames);
  // console.log(treedata);
  treedata.jobs.forEach((item) => {
    item.status = "WAITING"; 
    item.status_code = 0; 
    item.status_color = "gray"; 
    item.minutes = 0; 
    item.minutes_queue = 0;
    item.submit = null;
    item.start = null;
    item.finish = null;
    item.rm_id = null;
    // item.id is job_name
    if (currentJobNames[String(item.id)]){
      // console.log("Found " + item.id);
      const sourceInfoJob = currentJobNames[String(item.id)];
      item.status = sourceInfoJob.status; 
      item.status_code = sourceInfoJob.status_code; 
      item.status_color = sourceInfoJob.status_color; 
      item.minutes = sourceInfoJob.running_time_s; 
      item.minutes_queue = sourceInfoJob.queue_time_s;
      item.submit = sourceInfoJob.submit;
      item.start = sourceInfoJob.start;
      item.finish = sourceInfoJob.finish;
      item.rm_id = sourceInfoJob.job_id;
    }
  });
  
  //console.log(treedata.tree);
  for (const key of Object.keys(treedata.tree)) {
    // console.log(treedata.tree[key].title);
    traverseUpdate(treedata.tree[key], currentJobNames, fancyTree, parentCompletedMap, parentFailedMap);
    // fancyTreeObject.keyMap[key].title = fancyTreeObject.keyMap[key].refKey;
    // console.log(value);
  }
  // console.log(Object.keys(parentCompletedMap));
  // console.log(parentFailedMap);
  for (let key in parentCompletedMap){    
    let nodes = fancyTree.getNodesByRef(key);    
    if (nodes) {
      nodes.forEach(item => {
        let currentTitle = item.title + " <span class='badge' style='background-color:yellow'> %C COMPLETED</span>";
        currentTitle = currentTitle.replace('%C', parentCompletedMap[key]);
        item.setTitle(currentTitle);
      });
    }    
  }

  for (let key in parentFailedMap){    
    let nodes = fancyTree.getNodesByRef(key);    
    if (nodes) {
      nodes.forEach(item => {
        let currentTitle = item.title + " <span class='badge' style='background-color:red'>%F FAILED</span>";
        currentTitle = currentTitle.replace("%F", parentFailedMap[key]);
        item.setTitle(currentTitle);
      });
    }    
  }
  
}

const traverseUpdate = (treeNode, currentMap, fancyTree, parentCompletedMap, parentFailedMap) => {
  //fancyTreeNode.title = treeNode.refKey;
  // const underscores = (treeNode.title.match(/_/g) || []).length;
  //if (underscores >= 1 && treeNode.folder === false) {
  //treeNode.title = treeNode.refKey;
  let nodes = fancyTree.getNodesByRef(treeNode.refKey);
  // node = node ? node[0] : null;
  if (nodes){
    nodes.forEach(node => {
      const newNodeInfo = currentMap[node.refKey];
      let currentTitle = node.title;
      //let newTitle = currentTitle;
      // Setting status string        
      if (!node.folder){
        const statusIndexStart = currentTitle.indexOf("#");
        const statusIndexEnd = currentTitle.indexOf("<", statusIndexStart);
        const statusText = currentTitle.substring(statusIndexStart, statusIndexEnd);
        const newStatusText = (currentMap[node.refKey] ? String(newNodeInfo.status) : "WAITING");
        currentTitle = currentTitle.replace(statusText, '#'+ newStatusText);
        const bgIndexStart = currentTitle.indexOf("background-color:");
        const bgIndexEnd =  currentTitle.indexOf("'>");
        const bgColor = currentTitle.substring(bgIndexStart, bgIndexEnd);
        currentTitle = currentTitle.replace(bgColor, "background-color:"+(currentMap[node.refKey] ? String(newNodeInfo.status_color) : "gray"));
        const timeTagIndexStart = currentTitle.indexOf("~", statusIndexEnd);
        if (timeTagIndexStart > 0){
          const timeTagIndexEnd = currentTitle.indexOf("<", timeTagIndexStart);
          let timeTag = "";
          if (timeTagIndexEnd > 0){
            timeTag = currentTitle.substring(timeTagIndexStart, timeTagIndexEnd);            
          } else {
            timeTag = currentTitle.substring(timeTagIndexStart);           
          }          
          currentTitle = currentTitle.replace(timeTag, currentMap[node.refKey] ? "~ " + String(newNodeInfo.titletag) + " " : " ")
        } else {
          currentTitle = currentTitle + (currentMap[node.refKey] ? "~ " + String(newNodeInfo.titletag) + " " : "");
        }
        node.setTitle(currentTitle);
        let parent = node.parent;
        parent.setTitle(parent.refKey); 
        // console.log(statusText);
        if (newStatusText === "COMPLETED") {          
          parentCompletedMap[parent.refKey] = parentCompletedMap[parent.refKey] ? parentCompletedMap[parent.refKey] + 1 : 1;
        }     
        if (newStatusText === "FAILED") {          
          parentFailedMap[parent.refKey] = parentFailedMap[parent.refKey] ? parentFailedMap[parent.refKey] + 1 : 1;
        }
      }                    
    });
  }

  if (treeNode.children){
    treeNode.children.forEach(item => {
      //console.log(item);
      traverseUpdate(item, currentMap, fancyTree, parentCompletedMap, parentFailedMap);
    });
  }
}

export const buildRunTitle = (runId, meta) => {
  let runTitle = "Run " + runId;
  // console.log(meta);
  if (meta){
    const { created, finished, completed, total } = meta;
    runTitle = runTitle + " created on " + String(created) + (finished ? " finished on " + finished : " ") + " | " + String(completed) + " of " + String(total) + " jobs completed.";
  }  
  // console.log(runTitle);
  return runTitle;
}