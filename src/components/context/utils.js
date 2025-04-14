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

export const CONVERSIONS_YEARS = [
  { label: 'year', hours: 8760 },
  { label: 'month', hours: 730 },
  { label: 'week', hours: 168 },
  { label: 'day', hours: 24 },
  { label: 'hour', hours: 1 }
];

export const formatTime = (years) => {
    if (typeof years !== "number" || isNaN(years)) return "-";
    else if (years === 0) return "0 hours";

    let totalHours = years * CONVERSIONS_YEARS[0].hours;
    const results = [];

    for (let i = 0; i < CONVERSIONS_YEARS.length; i++) {
        const unit = CONVERSIONS_YEARS[i];
        const count = Math.floor(totalHours / unit.hours);
        if (count > 0) {
            results.push({ unit: unit.label, count });
        }
        totalHours %= unit.hours;
        if (totalHours === 0) {
            break;
        }
    }

    const parts = results.map(item => `${item.count} ${item.unit}${item.count !== 1 ? 's' : ''}`);
    let message = "";
    if (parts.length > 1) {
        message += parts.slice(0, parts.length - 1).join(', ') + " and " + parts[parts.length - 1];
    } else {
        message += parts[0];
    }
    return message;
};


export const formatSecondsToHMS = (seconds) => {
  if (seconds === 0) return "0s";
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  let parts = [];
  if (hrs) parts.push(`${hrs}h`);
  if (mins) parts.push(`${mins}m`);
  if (secs) parts.push(`${secs}s`);
  return parts.join(" ");
};