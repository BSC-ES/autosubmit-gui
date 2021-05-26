export const AUTOSUBMIT_API_SOURCE = "https://earth.bsc.es/autosubmitapi";
//export const AUTOSUBMIT_API_SOURCE = "http://84.88.185.33:8081";
export const DEBUG = false;
export const NOAPI = false;
export const ERROR_MESSAGE = "Autosubmit API couldn't retrieve the requested information on time. It might be due to a network error or heavy traffic on the shared folders that Autosubmit uses to store experiment information (/esarchive/autosubmit/)."

export const WaitingCode = 0;
export const FailedCode = -1;
export const CompletedCode = 5;
export const RunningCode = 4;
export const QueueCode = 3;
export const SubmittedCode = 2;
export const UnknownCode = -2;
export const SuspendedCode = -3;
export const HoldCode = 6;
export const ReadyCode = 1;
export const PreparedCode = 7;
export const SkippedCode = 8;

export const maxReponseTimeThreshold = 240; // 4 minutes
export const quickThreshold = 12000;

export const queueColor = {
  background: "lightpink",
  fontWeight: "bold",
};
export const failedColor = {
  background: "red",
  fontWeight: "bold",
  color: "white",
};
export const completedColor = {
  background: "yellow",
  fontWeight: "bold",
};
export const submittedColor = {
  background: "cyan",
  fontWeight: "bold",
};
export const runningColor = {
  background: "green",
  fontWeight: "bold",
  color: "white",
};
export const readyColor = {
  background: "lightblue",
  fontWeight: "bold",
};
export const waitingColor = {
  background: "gray",
  fontWeight: "bold",
  color: "white",
};
export const unknownColor = {
  background: "white",
  color: "black",
  fontWeight: "bold",
};
export const suspendedColor = {
  background: "orange",
  fontWeight: "bold",
  color: "black",
};
export const holdColor = {
  background: "salmon",
  fontWeight: "bold",
  color: "white",
};
export const preparedColor = {
  background: "lightsalmon",
  fontWeight: "bold",
};
export const skippedColor = {
  background: "lightyellow",
  fontWeight: "bold",
};


export const statusCodeToStyle = (code) => {
  if (code === WaitingCode)
    return waitingColor;
  if (code === FailedCode)
    return failedColor;
  if (code === CompletedCode)
    return completedColor;
  if (code === RunningCode)
    return runningColor;
  if (code === QueueCode)
    return queueColor;
  if (code === SubmittedCode)
    return submittedColor;
  if (code === UnknownCode)
    return unknownColor;
  if (code === SuspendedCode)
    return suspendedColor;
  if (code === HoldCode)
    return holdColor;
  if (code === ReadyCode)
    return readyColor;
  if (code === PreparedCode)
    return preparedColor;
  if (code === SkippedCode)
    return skippedColor;
  return unknownColor;
};

export const localStorageExperimentTypeSearch = "experimentTypeSearch";
export const localStorageExperimentActiveCheck = "activeCheckSearch";