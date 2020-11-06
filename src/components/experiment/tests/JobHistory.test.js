import React from "react";
import { unmountComponentAtNode, render } from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { act } from "react-dom/test-utils";
import renderer from 'react-test-renderer';
import JobHistory from "../JobHistory";
import ExperimentContext from "../../context/experiment/experimentContext";
import TreeContext from "../../context/tree/treeContext";
import GraphContext from "../../context/graph/graphContext";
import experimentContext from "../../context/experiment/experimentContext";

let container = null;
const experiment = {branch: "master", description: "Test", owner:"wuruchi", owner_id: 1226, hpc:"LOCAL", db_historic_version: 14, version:"3.11.0"};
const jobHistory = {
  "error": false,
  "error_message": "",
  "history": [
      {
          "counter": 16,
          "created": "2020-11-06-01:48:35",
          "energy": 328030,
          "finish": "2020-11-06-03:48:03",
          "job_id": 12316108,
          "ncpus": 288,
          "nodes": 6,
          "platform": "marenostrum4",
          "qos": "debug",
          "queue_time": "1:57:26",
          "run_time": "0:02:02",
          "start": "2020-11-06-03:46:01",
          "status": "COMPLETED",
          "submit": "2020-11-06-01:48:35",
          "wallclock": "00:10"
      },
      {
          "counter": 15,
          "created": "2020-11-05-02:10:45",
          "energy": 331310,
          "finish": "2020-11-05-02:57:14",
          "job_id": 12294566,
          "ncpus": 288,
          "nodes": 6,
          "platform": "marenostrum4",
          "qos": "debug",
          "queue_time": "0:44:47",
          "run_time": "0:01:43",
          "start": "2020-11-05-02:55:31",
          "status": "COMPLETED",
          "submit": "2020-11-05-02:10:44",
          "wallclock": "00:10"
      },
      {
          "counter": 14,
          "created": "2020-11-04-00:30:36",
          "energy": 274810,
          "finish": "2020-11-04-01:08:35",
          "job_id": 12268753,
          "ncpus": 288,
          "nodes": 6,
          "platform": "marenostrum4",
          "qos": "debug",
          "queue_time": "0:36:21",
          "run_time": "0:01:38",
          "start": "2020-11-04-01:06:57",
          "status": "COMPLETED",
          "submit": "2020-11-04-00:30:36",
          "wallclock": "00:10"
      },
      {
          "counter": 13,
          "created": "2020-11-03-02:47:53",
          "energy": 299880,
          "finish": "2020-11-03-04:19:08",
          "job_id": 12248699,
          "ncpus": 288,
          "nodes": 6,
          "platform": "marenostrum4",
          "qos": "debug",
          "queue_time": "1:29:22",
          "run_time": "0:01:53",
          "start": "2020-11-03-04:17:15",
          "status": "COMPLETED",
          "submit": "2020-11-03-02:47:53",
          "wallclock": "00:10"
      },
      {
          "counter": 12,
          "created": "2020-11-02-00:46:38",
          "energy": 253590,
          "finish": "2020-11-02-02:12:52",
          "job_id": 12222966,
          "ncpus": 288,
          "nodes": 6,
          "platform": "marenostrum4",
          "qos": "debug",
          "queue_time": "1:24:39",
          "run_time": "0:01:35",
          "start": "2020-11-02-02:11:17",
          "status": "COMPLETED",
          "submit": "2020-11-02-00:46:38",
          "wallclock": "00:10"
      },
      {
          "counter": 11,
          "created": "2020-11-01-01:08:11",
          "energy": 303030,
          "finish": "2020-11-01-01:58:21",
          "job_id": 12209105,
          "ncpus": 288,
          "nodes": 6,
          "platform": "marenostrum4",
          "qos": "debug",
          "queue_time": "0:48:37",
          "run_time": "0:01:33",
          "start": "2020-11-01-01:56:48",
          "status": "COMPLETED",
          "submit": "2020-11-01-01:08:11",
          "wallclock": "00:10"
      },
      {
          "counter": 10,
          "created": "2020-10-31-00:57:51",
          "energy": 229750,
          "finish": "2020-10-31-01:44:24",
          "job_id": 12194102,
          "ncpus": 288,
          "nodes": 6,
          "platform": "marenostrum4",
          "qos": "debug",
          "queue_time": "0:45:06",
          "run_time": "0:01:27",
          "start": "2020-10-31-01:42:57",
          "status": "COMPLETED",
          "submit": "2020-10-31-00:57:51",
          "wallclock": "00:10"
      },
      {
          "counter": 9,
          "created": "2020-10-30-00:28:54",
          "energy": 218130,
          "finish": "2020-10-30-01:19:26",
          "job_id": 12176928,
          "ncpus": 288,
          "nodes": 6,
          "platform": "marenostrum4",
          "qos": "debug",
          "queue_time": "0:49:09",
          "run_time": "0:01:23",
          "start": "2020-10-30-01:18:03",
          "status": "COMPLETED",
          "submit": "2020-10-30-00:28:54",
          "wallclock": "00:10"
      },
      {
          "counter": 8,
          "created": "2020-10-29-01:16:04",
          "energy": 235700,
          "finish": "2020-10-29-01:17:19",
          "job_id": 12158296,
          "ncpus": 288,
          "nodes": 6,
          "platform": "marenostrum4",
          "qos": "debug",
          "queue_time": "0:45:07",
          "run_time": "0:01:21",
          "start": "2020-10-29-01:15:58",
          "status": "COMPLETED",
          "submit": "2020-10-29-00:30:51",
          "wallclock": "00:10"
      },
      {
          "counter": 7,
          "created": "2020-10-28-00:21:34",
          "energy": 219950,
          "finish": "2020-10-28-00:22:38",
          "job_id": 12142616,
          "ncpus": 288,
          "nodes": 6,
          "platform": "marenostrum4",
          "qos": "debug",
          "queue_time": "0:42:30",
          "run_time": "0:01:19",
          "start": "2020-10-28-00:21:19",
          "status": "COMPLETED",
          "submit": "2020-10-27-23:38:49",
          "wallclock": "00:10"
      },
      {
          "counter": 6,
          "created": "2020-10-27-11:03:40",
          "energy": 227120,
          "finish": "2020-10-27-11:04:51",
          "job_id": 12133545,
          "ncpus": 288,
          "nodes": 6,
          "platform": "marenostrum4",
          "qos": "debug",
          "queue_time": "0:00:05",
          "run_time": "0:01:19",
          "start": "2020-10-27-11:03:32",
          "status": "COMPLETED",
          "submit": "2020-10-27-11:03:27",
          "wallclock": "00:10"
      },
      {
          "counter": 5,
          "created": "2020-10-27-00:46:04",
          "energy": 217570,
          "finish": "2020-10-27-00:47:16",
          "job_id": 12126100,
          "ncpus": 288,
          "nodes": 6,
          "platform": "marenostrum4",
          "qos": "debug",
          "queue_time": "0:41:35",
          "run_time": "0:01:29",
          "start": "2020-10-27-00:45:47",
          "status": "COMPLETED",
          "submit": "2020-10-27-00:04:12",
          "wallclock": "00:10"
      },
      {
          "counter": 4,
          "created": "2020-10-26-00:44:21",
          "energy": 224610,
          "finish": "2020-10-26-00:45:32",
          "job_id": 12113647,
          "ncpus": 288,
          "nodes": 6,
          "platform": "marenostrum4",
          "qos": "debug",
          "queue_time": "0:46:12",
          "run_time": "0:01:18",
          "start": "2020-10-26-00:44:14",
          "status": "COMPLETED",
          "submit": "2020-10-25-23:58:02",
          "wallclock": "00:10"
      },
      {
          "counter": 3,
          "created": "2020-10-25-00:46:37",
          "energy": 223590,
          "finish": "2020-10-25-00:47:46",
          "job_id": 12106900,
          "ncpus": 288,
          "nodes": 6,
          "platform": "marenostrum4",
          "qos": "debug",
          "queue_time": "0:11:47",
          "run_time": "0:01:16",
          "start": "2020-10-25-00:46:30",
          "status": "COMPLETED",
          "submit": "2020-10-25-00:34:43",
          "wallclock": "00:10"
      },
      {
          "counter": 2,
          "created": "2020-10-24-01:51:40",
          "energy": 221290,
          "finish": "2020-10-24-01:52:49",
          "job_id": 12104622,
          "ncpus": 288,
          "nodes": 6,
          "platform": "marenostrum4",
          "qos": "debug",
          "queue_time": "0:48:19",
          "run_time": "0:01:16",
          "start": "2020-10-24-01:51:33",
          "status": "COMPLETED",
          "submit": "2020-10-24-01:03:14",
          "wallclock": "00:10"
      },
      {
          "counter": 1,
          "created": "2020-10-23-16:37:35",
          "energy": 230880,
          "finish": "2020-10-23-16:38:53",
          "job_id": 12098185,
          "ncpus": 288,
          "nodes": 6,
          "platform": "marenostrum4",
          "qos": "debug",
          "queue_time": "0:00:46",
          "run_time": "0:01:25",
          "start": "2020-10-23-16:37:28",
          "status": "COMPLETED",
          "submit": "2020-10-23-16:36:42",
          "wallclock": "00:10"
      }
  ]
}
const historyContent = [];
jobHistory.history.map(item => historyContent.push(item.submit));
const graphSelection = ['t0ie_20120101_000_1_SIM'];
const treeSelection = { node: { refKey: "t0ie_20120101_000_1_SIM" }};

beforeEach(() => {
  // setup DOM element as render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("TreeControl renders with content using source tree", () => {
  
  act(() => {
    render(<Router><ExperimentContext.Provider value={{ experiment: experiment, summaries: new Map(), loadingSummary: new Map(), experimentRunning:true, jobHistory: jobHistory, getJobHistory: () => null}}><TreeContext.Provider 
      value={{
        selectedTreeNode: treeSelection
      }}>
        <GraphContext.Provider value={{selection: graphSelection}}>
          <JobHistory source="tree" />
        </GraphContext.Provider>        
      </TreeContext.Provider></ExperimentContext.Provider></Router>, container);
  });
  // console.log(container.textContent);
  historyContent.forEach(item => expect(container.textContent).toContain(item));
  // expect(container.innerHTML).toContain("Start Job Monitor");
  // expect(container.innerHTML).toContain("Refresh");
});

it("TreeControl renders with content using source graph", () => {
  
  act(() => {
    render(<Router><ExperimentContext.Provider value={{ experiment: experiment, summaries: new Map(), loadingSummary: new Map(), experimentRunning:true, jobHistory: jobHistory, getJobHistory: () => null}}><TreeContext.Provider 
      value={{
        selectedTreeNode: treeSelection
      }}>
        <GraphContext.Provider value={{selection: graphSelection}}>
          <JobHistory source="graph" />
        </GraphContext.Provider>        
      </TreeContext.Provider></ExperimentContext.Provider></Router>, container);
  });
  // console.log(container.textContent);
  historyContent.forEach(item => expect(container.textContent).toContain(item));
  // expect(container.innerHTML).toContain("Start Job Monitor");
  // expect(container.innerHTML).toContain("Refresh");
});