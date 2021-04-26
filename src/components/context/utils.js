import React from 'react';
export const timeStampToDate = (value) => {
  //console.log('Setting new format: ' + value);
  let formattedDate = "";
  let date = new Date(value * 1000);
  //const offsetAtBSC = -3600; 
  //const timezoneFixedValue = value + (date.getTimezoneOffset()* 60) - offsetAtBSC;
  // date = new Date(timezoneFixedValue * 1000)
  let hours = date.getHours();
  let minutes = "0" + date.getMinutes();
  let seconds = "0" + date.getSeconds();
  let month = date.getMonth() + 1;
  let day = date.getDate();  
  // console.log(date.toLocaleDateString())
  formattedDate =
    "[" +
    day +
    "/" +
    month +
    "] " +
    hours +
    ":" +
    minutes.substr(-2) +
    ":" +
    seconds.substr(-2);
  // formattedDate = date.toISOString();
  // console.log(formattedDate);
  return formattedDate;
};

export const hashCode = (value) => {
  let hash = 0,
    i,
    chr;
  if (value.length === 0) return hash;
  for (i = 0; i < value.length; i++) {
    chr = value.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  console.log(hash);
  return hash;
};

export const commandGeneratorGraph = (expid, jobs, status) => {
  let command = "Invalid Command: You have to select at least one job.";
  //jobs.map((job) => arrayNames.push(job.name));
  if (jobs.length > 0) {
    command =
      "autosubmit setstatus " +
      expid +
      ' -fl "' +
      jobs.join(" ") +
      '" -t ' +
      status +
      " -s -nt -np";
  }
  return command;
};

export const commandGenerator = (expid, jobs, status) => {
  let arrayNames = [];
  //let command = "Invalid Command: You have to select at least one job.";
  jobs.map((job) => arrayNames.push(job.name));

  return commandGeneratorGraph(expid, arrayNames, status);
};

export const statusChangeTextGeneratorGraph = (jobs, status) => {
  let command = "You have to select at least one job.";
  //jobs.map((job) => arrayNames.push(job.name));
  if (jobs.length > 0) {
    command = jobs.join(" " + String(status)+ "\n");
    command = command + " " + String(status);
  }
  return command;
}

export const statusChangeTextGenerator = (jobs, status) => {
  let arrayNames = [];
  jobs.map((job) => arrayNames.push(job.name));
  return statusChangeTextGeneratorGraph(arrayNames, status);
}

export const secondsToDelta = (SECONDS) => {
  if (SECONDS > 0) {
    let sec_num = SECONDS; // don't forget the second param
    let days = Math.floor(sec_num / (3600 * 24));
    let hours = Math.floor((sec_num - days * (3600 * 24)) / 3600);
    let minutes = Math.floor((sec_num - days * (3600 * 24) - hours * 3600) / 60);
    let seconds = sec_num - days * (3600 * 24) - hours * 3600 - minutes * 60;

    // if (days < 10){
    //   days = "0" + days;
    // }
    //console.log(days + "-" + hou);
    if (hours < 10) {
      hours = "0" + hours;
    }
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    
    return (days > 0 ? days + (days > 1 ? " days - " : " day - ") : "") + hours + ":" + minutes + ":" + seconds;
  } else {
    return "0:00:00";
  }
};

let startTime, endTime;

export const start = () => {
  startTime = new Date();
};

export const end = () => {
  endTime = new Date();
  let timeDiff = endTime - startTime; //in ms
  // strip the ms
  timeDiff /= 1000;

  // get seconds
  let seconds = Math.round(timeDiff);
  console.log(seconds + " seconds");
};

export const approximateLoadingTreeTime = (x) => {
  if (x <= 1000) return 1;
  if (x > 1000 && x <= 1600) return 5;
  let y = Math.round(0.02 * x - 30);
  return y;
};

export const approximateLoadingQuickView = (x) => {
  if (x <= 2000) return 1;
  let y = Math.round(0.005 * x - 37);
  return y;
};

export const exportSummaryToCSV = (data, columnNames, title) => {
  let date = new Date();
  title =  date.getFullYear().toString() + "-" + date.getMonth() + "-" + date.getDate() + "_" + date.getHours() + "-" + date.getMinutes() + "_" + title;
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += columnNames.join(",") + "\n";
  if (data){
    let mapped = []
    if (columnNames.length === 4){
      data.map((item) => mapped.push([item[columnNames[0]], item[columnNames[1]], item[columnNames[2]], item[columnNames[3]]]));
    } else if (columnNames.length === 6) {
      data.map((item) => mapped.push([item[columnNames[0]], item[columnNames[1]], item[columnNames[2]], item[columnNames[3]], item[columnNames[4]], item[columnNames[5]]]));
    }        
    csvContent += mapped.map((item) => item.join(",")).join("\n");
  }
  let encodedUri = encodeURI(csvContent);
  let link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", title);
  document.body.appendChild(link); // Required for FF
  link.click();
}

export const exportHistoryToCSV = (data, columnNames, title) => {
  
  let date = new Date();  
  title =  date.getFullYear().toString() + "-" + date.getMonth() + "-" + date.getDate() + "_" + date.getHours() + "-" + date.getMinutes() + "_" + title;
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += columnNames.join(",") + "\n";
  if (data){
    let mapped = []
    data.map((item) => mapped.push([item.counter,item.job_id,item.submit,item.start,item.finish,item.queue_time,item.run_time, item.status, item.energy, item.wallclock, item.ncpus, item.nodes]));
    csvContent += mapped.map((item) => item.join(",")).join("\n");
  }
  let encodedUri = encodeURI(csvContent);
  let link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", title);
  document.body.appendChild(link); // Required for FF
  link.click();
}

export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const getReadyJobs = (jobs) => {
  if (jobs) {
    const readyJobs = jobs.filter(x => x.status === 'READY');
    const jobArray = [];
    readyJobs.map((item) => jobArray.push({ name: item.id, status: item.status }));
    if (jobArray.length > 0){
      return jobArray;
    } else {
      return null;
    }
    
  }
  return null;
}


export const groupBy = (arrayObjects, key) => {
  return arrayObjects.reduce(function(result, currentObject) {
    const val = currentObject[key];
    result[val] = result[val] || [];
    result[val].push(currentObject);
    return result;
  }, {})
}

export const groupByAndAggregate = (arrayObjects, key) => {
  const groupedBySection = groupBy(arrayObjects, key);
  let result = []
  // console.log(groupedBySection);
  // console.log(typeof groupedBySection);
  // for (let section in groupedBySection)
  //   console.log(section);
  if (groupedBySection){
    for (let sectionName in groupedBySection){
      let queueSum = 0;
      let runSum = 0;    
      // console.log(sectionName);
      groupedBySection[sectionName].forEach((itemJob) => {
        queueSum += itemJob.Queue;
        runSum += itemJob.Run;
      })
      let averageQueue = queueSum/groupedBySection[sectionName].length;
      averageQueue = Math.round(averageQueue);
      let averageRun = runSum/groupedBySection[sectionName].length;
      averageRun = Math.round(averageRun);
      result.push({ "Section": sectionName, "SumQueue": queueSum, "AverageQueue": averageQueue, "SumRun": runSum, "AverageRun": averageRun, "Count": groupedBySection[sectionName].length})
    }
  }
  return result;
}


export const errorEsarchiveStatus = { data: {
  "avg_bandwidth": null,
  "avg_latency": null,
  "bandwidth_warning": null,
  "current_bandwidth": null,
  "current_latency": null,
  "datetime": "2021-04-19-13:50:04",
  "error": true,
  "error_message": "The server couldn't reach esarchive in a reasonable time. Some simple operations might be completed, but complex requests are likely to fail.",
  "latency_warning": null,
  "reponse_time": 2,
  "response_warning": null,
  "status": "OFFLINE"}
}
export const openIcon = <i className="far fa-square"></i>;
export const openIconHistory = <i className="fas fa-history"></i>;