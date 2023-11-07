import React from "react";
export const timeStampToDate = (value) => {
  let formattedDate = "";
  let date = new Date(value * 1000);
  let hours = date.getHours();
  let minutes = "0" + date.getMinutes();
  let seconds = "0" + date.getSeconds();
  let month = date.getMonth() + 1;
  let day = date.getDate();
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

export const commandGeneratorUpdateDescrip = (expid, description) => {
  let command = "Not a valid experiment.";
  if (expid) {
    command = "autosubmit updatedescrip " + expid + " '" + description + "'";
  }
  return command;
};

export const getExperimentAutosubmitVersion = (version) => {
    if (typeof(version) != 'string') { return false; }

    var arr = version.split('.');
    // parse int or default to 0
    var maj = parseInt(arr[0]) || 0;
    var min = parseInt(arr[1]) || 0;
    var rest = parseInt(arr[2]) || 0;
    return {
        major: maj,
        minor: min,
        build: rest
    }
}

export const commandGenerator = (expid, jobs, status) => {
  let arrayNames = [];
  jobs.map((job) => arrayNames.push(job.name));
  return commandGeneratorGraph(expid, arrayNames, status);
};

export const statusChangeTextGeneratorGraph = (jobs, status) => {
  let command = "You have to select at least one job.";
  if (jobs.length > 0) {
    command = jobs.join(" " + String(status) + "\n");
    command = command + " " + String(status);
  }
  return command;
};

export const statusChangeTextGenerator = (jobs, status) => {
  let arrayNames = [];
  jobs.map((job) => arrayNames.push(job.name));
  return statusChangeTextGeneratorGraph(arrayNames, status);
};

export const secondsToDelta = (SECONDS) => {
  if (SECONDS > 0) {
    let sec_num = SECONDS; // don't forget the second param
    let days = Math.floor(sec_num / (3600 * 24));
    let hours = Math.floor((sec_num - days * (3600 * 24)) / 3600);
    let minutes = Math.floor(
      (sec_num - days * (3600 * 24) - hours * 3600) / 60
    );
    let seconds = sec_num - days * (3600 * 24) - hours * 3600 - minutes * 60;
    if (hours < 10) {
      hours = "0" + hours;
    }
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    if (seconds < 10) {
      seconds = "0" + seconds;
    }

    return (
      (days > 0 ? days + (days > 1 ? " days - " : " day - ") : "") +
      hours +
      ":" +
      minutes +
      ":" +
      seconds
    );
  } else {
    return "00:00:00";
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
  title =
    date.getFullYear().toString() +
    "-" +
    date.getMonth() +
    "-" +
    date.getDate() +
    "_" +
    date.getHours() +
    "-" +
    date.getMinutes() +
    "_" +
    title;
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += columnNames.join(",") + "\n";
  if (data) {
    let mapped = [];
    if (columnNames.length === 4) {
      data.map((item) =>
        mapped.push([
          item[columnNames[0]],
          item[columnNames[1]],
          item[columnNames[2]],
          item[columnNames[3]],
        ])
      );
    } else if (columnNames.length === 6) {
      data.map((item) =>
        mapped.push([
          item[columnNames[0]],
          item[columnNames[1]],
          item[columnNames[2]],
          item[columnNames[3]],
          item[columnNames[4]],
          item[columnNames[5]],
        ])
      );
    }
    csvContent += mapped.map((item) => item.join(",")).join("\n");
  }
  let encodedUri = encodeURI(csvContent);
  let link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", title);
  document.body.appendChild(link); // Required for FF
  link.click();
};

export const exportHistoryToCSV = (data, columnNames, title) => {
  let date = new Date();
  title =
    date.getFullYear().toString() +
    "-" +
    date.getMonth() +
    "-" +
    date.getDate() +
    "_" +
    date.getHours() +
    "-" +
    date.getMinutes() +
    "_" +
    title;
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += columnNames.join(",") + "\n";
  if (data) {
    let mapped = [];
    data.map((item) =>
      mapped.push([
        item.counter,
        item.job_id,
        item.submit,
        item.start,
        item.finish,
        item.queue_time,
        item.run_time,
        item.status,
        item.energy,
        item.wallclock,
        item.ncpus,
        item.nodes,
      ])
    );
    csvContent += mapped.map((item) => item.join(",")).join("\n");
  }
  let encodedUri = encodeURI(csvContent);
  let link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", title);
  document.body.appendChild(link); // Required for FF
  link.click();
};

export const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const getReadyJobs = (jobs) => {
  if (jobs) {
    const readyJobs = jobs.filter((x) => x.status === "READY");
    const jobArray = [];
    readyJobs.map((item) =>
      jobArray.push({ name: item.id, status: item.status })
    );
    if (jobArray.length > 0) {
      return jobArray;
    } else {
      return null;
    }
  }
  return null;
};

export const getIFActiveJobs = (jobs) => {
  if (jobs) {
    const activeJobs = jobs.filter(
      (x) =>
        x.status === "QUEUING" ||
        x.status === "SUBMITTED" ||
        x.status === "RUNNING"
    );
    if (activeJobs.length > 0) {
      return true;
    } else {
      return false;
    }
  }
  return false;
};

export const groupBy = (arrayObjects, key) => {
  return arrayObjects.reduce(function (result, currentObject) {
    const val = currentObject[key];
    result[val] = result[val] || [];
    result[val].push(currentObject);
    return result;
  }, {});
};

export const groupByAndAggregate = (arrayObjects, key) => {
  const groupedBySection = groupBy(arrayObjects, key);
  let result = [];

  if (groupedBySection) {
    for (let sectionName in groupedBySection) {
      let queueSum = 0;
      let runSum = 0;
      groupedBySection[sectionName].forEach((itemJob) => {
        queueSum += itemJob.Queue;
        runSum += itemJob.Run;
      });
      let averageQueue = queueSum / groupedBySection[sectionName].length;
      averageQueue = Math.round(averageQueue);
      let averageRun = runSum / groupedBySection[sectionName].length;
      averageRun = Math.round(averageRun);
      result.push({
        Section: sectionName,
        SumQueue: queueSum,
        AverageQueue: averageQueue,
        SumRun: runSum,
        AverageRun: averageRun,
        Count: groupedBySection[sectionName].length,
      });
    }
  }
  return result;
};

export const buildWarningInactiveMessageTree = (
  experimentRunning,
  timeDiff,
  logPath,
  jobs
) => {
  let message = null;
  // NOT Active, and more than 10 minutes difference
  if (!experimentRunning && timeDiff > 600 && jobs) {
    const activeJobs = getIFActiveJobs(jobs);
    // console.log("Active jobs " + String(activeJobs));
    if (activeJobs) {
      message =
        "The log of your experiment has been inactive for an extended period of time while some jobs are still active. Verify that Autosubmit is still working. Review your log: " +
        String(logPath);
    }
  }
  return message;
};

export const errorEsarchiveStatus = {
  data: {
    avg_bandwidth: null,
    avg_latency: null,
    bandwidth_warning: null,
    current_bandwidth: null,
    current_latency: null,
    datetime: "2021-04-19-13:50:04",
    error: true,
    error_message:
      "The server couldn't reach esarchive in a reasonable time. Some simple operations might be completed, but complex requests are likely to fail.",
    latency_warning: null,
    reponse_time: 2,
    response_warning: null,
    status: "OFFLINE",
  },
};
export const openIcon = <i className='far fa-square'></i>;
export const openIconHistory = <i className='fas fa-history'></i>;
export const logIconLeft = <i className='fas fa-align-left'></i>;
export const logIconRight = <i className='fas fa-align-right'></i>;

export const generateArrayOfNumbers = (numbers) => {
  return [...Array(numbers).keys()].slice(1);
};

export const normalizeString = (input) => {
  if (input) return String(input);
  return "";
};

export const normalizeInt = (input) => {
  if (input && input !== "NA") {
    return input;
  }
  return 0;
};

export const creationDateToId = (strCreationDate, intRunId) => {
  // 2021-07-07-10:36:37
  if (
    strCreationDate === null ||
    strCreationDate === undefined ||
    strCreationDate.length === 0 ||
    strCreationDate === "NA"
  ) {
    return "NA";
  }
  // console.log(strCreationDate);
  const creationDate = strCreationDate.split("-");
  const timeDay = creationDate[3].split(":");
  const code =
    creationDate[0].substr(2, 2) +
    "" +
    creationDate[1] +
    "" +
    creationDate[2] +
    "" +
    timeDay[0] +
    "" +
    timeDay[1];
  return code;
};

export const differenceBetweenConfigurations = (
  historicalConf,
  currentConf
) => {
  let differences = new Set();
  if (historicalConf && currentConf) {
    // First Level
    Object.keys(currentConf).forEach((file) => {
      const historicalFile = Object.keys(historicalConf)
        ? Object.keys(historicalConf)
        : [];
      if (historicalFile.includes(file)) {
        // Second Level
        Object.keys(currentConf[file]).forEach((header) => {
          const historicalFileHeader = Object.keys(historicalConf[file])
            ? Object.keys(historicalConf[file])
            : [];
          if (historicalFileHeader.includes(header)) {
            Object.keys(currentConf[file][header]).forEach((field) => {
              const historicalFileHeaderField = Object.keys(
                historicalConf[file][header]
              )
                ? Object.keys(historicalConf[file][header])
                : [];
              if (historicalFileHeaderField.includes(field)) {
                if (
                  currentConf[file][header][field] !==
                  historicalConf[file][header][field]
                ) {
                  differences.add(`${file}.${header}.${field}`);
                  differences.add(`${file}.${header}`);
                  differences.add(file);
                }
              } else {
                differences.add(`${file}.${header}.${field}`);
                differences.add(`${file}.${header}`);
                differences.add(file);
              }
            });
          } else {
            differences.add(`${file}.${header}`);
            differences.add(file);
          }
          const fileFileHeader = Object.keys(currentConf[file])
            ? Object.keys(currentConf[file])
            : [];

          historicalFileHeader.forEach((head) => {
            if (!fileFileHeader.includes(head))
              differences.add(`${file}.${head}`);
          });
        });
      } else {
        differences.add(file);
      }
    });
  }
  return differences;
};

export const generateConfigFileHtml = (
  conf,
  confName = "name",
  differences = new Set(),
  alertSpan = "Differencia"
) => {
  if (conf) {
    let htmlResult = (
      <div className='row'>
        <div className='col'>
          {Object.keys(conf).map((v) => (
            <div key={v} className='configuration-section'>
              <div className='configuration-section-title'>
                <strong>[{v}]</strong>{" "}
                {differences.has(`${confName}.${v}`) && alertSpan}
              </div>
              <table className='table table-sm table-fixed list-table'>
                <thead className='thead-dark'>
                  <tr>
                    <th scope='col'>Setting</th>
                    <th scope='col'>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(conf[v]).map((w) => (
                    <tr key={w}>
                      <td>
                        {w}{" "}
                        {differences.has(`${confName}.${v}.${w}`) && alertSpan}
                      </td>
                      <td>{conf[v][w]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    );
    return htmlResult;
  }
  return null;
};

export const arrayAverage = (arr) => {
  if (!arr || arr.length === 0) return 0.0;
  const sumArr = arr.reduce((accum, x) => {
    accum += x;
    return accum;
  });
  return arr.length > 0 ? sumArr / arr.length : 0.0;
};

export const arrayVariance = (arr) => {
  const average = arrayAverage(arr);
  const variance = arrayAverage(
    arr.map((x) => {
      return Math.pow(x - average, 2);
    })
  );
  return variance;
};

export const arrayStandardDeviation = (arr) => {
  return Math.sqrt(arrayVariance(arr));
};

export const arrayMeanAbsoluteDeviationAroundMean = (arr) => {
  if (!arr || arr.length === 0) return 0.0;
  const mean = arrayAverage(arr);
  const madam = arrayAverage(
    arr.map((x) => {
      return Math.abs(x - mean);
    })
  );
  return madam;
};

export const formatNumberMoney = (
  money,
  integerFormat = false,
  decimals = 2
) => {
  const moneyToFormat = money && Number.isFinite(money) ? money : 0.0;
  const floatFormat = moneyToFormat
    .toFixed(integerFormat === true ? 2 : decimals)
    .replace(/\d(?=(\d{3})+\.)/g, "$&,");
  if (integerFormat === false) {
    return floatFormat;
  } else {
    // Does it hold?
    return floatFormat.substr(0, floatFormat.length - 3);
  }
};

export const statusAlertInHistory = (submit, start, finish, status) => {
  if (["READY", "WAITING"].includes(status)) {
    if (submit || start || finish) {
      return (
        <span
          className='badge badge-warning ml-1'
          data-toggle='tooltip'
          data-placement='bottom'
          title={`It seems that the original status of this job was not '${status}'.`}
        >
          !
        </span>
      );
    }
  }
  return null;
};

export const calculateStatistics = (jobs) => {
  let jobsSubmittedCount = 0;
  let jobsRunCount = 0;
  let jobsCompletedCount = 0;
  let jobsFailedCount = 0;

  let expectedConsumption = 0.0;
  let realConsumption = 0.0;
  let failedRealConsumption = 0.0;

  let expectedCpuConsumption = 0.0;
  let cpuConsumption = 0.0;
  let failedCpuConsumption = 0.0;

  let totalQueueTime = 0.0;
  let cpuConsumptionPercentage = 0.0;

  jobs.forEach((job) => {
    jobsSubmittedCount += job.submittedCount;
    jobsRunCount += job.retrialCount;
    jobsCompletedCount += job.completedCount;
    jobsFailedCount += job.failedCount;

    expectedConsumption += job.expectedConsumption;
    realConsumption += job.realConsumption;
    failedRealConsumption += job.failedRealConsumption;

    expectedCpuConsumption += job.expectedCpuConsumption;
    cpuConsumption += job.cpuConsumption;
    failedCpuConsumption += job.failedCpuConsumption;

    totalQueueTime += job.completedQueueTime + job.failedQueueTime;
  });

  if (expectedCpuConsumption > 0) {
    cpuConsumptionPercentage = (cpuConsumption / expectedCpuConsumption) * 100;
  }

  return {
    jobsSubmittedCount: formatNumberMoney(jobsSubmittedCount, true),
    jobsRunCount: formatNumberMoney(jobsRunCount, true),
    jobsCompletedCount: formatNumberMoney(jobsCompletedCount, true),
    jobsFailedCount: formatNumberMoney(jobsFailedCount, true),
    expectedConsumption: formatNumberMoney(expectedConsumption),
    realConsumption: formatNumberMoney(realConsumption),
    failedRealConsumption: formatNumberMoney(failedRealConsumption),
    expectedCpuConsumption: formatNumberMoney(expectedCpuConsumption),
    cpuConsumption: formatNumberMoney(cpuConsumption),
    failedCpuConsumption: formatNumberMoney(failedCpuConsumption),
    totalQueueTime: formatNumberMoney(totalQueueTime),
    cpuConsumptionPercentage: formatNumberMoney(cpuConsumptionPercentage),
  };
};
