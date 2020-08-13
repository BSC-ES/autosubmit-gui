export const timeStampToDate = (value) => {
  //console.log('Setting new format: ' + value);
  let formattedDate = "";
  var date = new Date(value * 1000);
  var hours = date.getHours();
  var minutes = "0" + date.getMinutes();
  var seconds = "0" + date.getSeconds();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  //console.log(date)
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
  return formattedDate;
};

export const hashCode = (value) => {
  var hash = 0,
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
  let command = "Invalid Command: You have to select at least one job.";
  jobs.map((job) => arrayNames.push(job.name));
  if (arrayNames.length > 0) {
    command =
      "autosubmit setstatus " +
      expid +
      ' -fl "' +
      arrayNames.join(" ") +
      '" -t ' +
      status +
      " -s -nt -np";
  }
  return command;
};

export const secondsToDelta = (SECONDS) => {
  if (SECONDS > 0) {
    var sec_num = SECONDS; // don't forget the second param
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - hours * 3600) / 60);
    var seconds = sec_num - hours * 3600 - minutes * 60;

    if (hours < 10) {
      hours = "0" + hours;
    }
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    return hours + ":" + minutes + ":" + seconds;
  } else {
    return "0:00:00";
  }
};
