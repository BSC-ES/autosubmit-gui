export const AUTOSUBMIT_API_SOURCE = "https://earth.bsc.es/autosubmitapi/";
//export const AUTOSUBMIT_API_SOURCE = "http://84.88.185.94:8081";
export const DEBUG = false;
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
  color: "white",
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
