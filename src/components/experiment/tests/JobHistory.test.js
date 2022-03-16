import React from "react";
import { unmountComponentAtNode, render } from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { act } from "react-dom/test-utils";
import renderer from "react-test-renderer";
import JobHistory from "../JobHistory";
import ExperimentContext from "../../context/experiment/experimentContext";
import TreeContext from "../../context/tree/treeContext";
import GraphContext from "../../context/graph/graphContext";
import experimentContext from "../../context/experiment/experimentContext";

let container = null;
const experiment = {
  branch: "master",
  description: "Test",
  owner: "wuruchi",
  owner_id: 1226,
  hpc: "LOCAL",
  db_historic_version: 14,
  version: "3.11.0",
};
const jobHistory = {
  error: false,
  error_message: "",
  history: [
    {
      ASYPD: null,
      SYPD: null,
      counter: 12,
      created: "2022-02-28-07:03:06",
      energy: 0,
      err: "",
      finish: null,
      job_id: 20864862,
      ncpus: 5040,
      nodes: 0,
      out: "",
      platform: "marenostrum4",
      qos: "class_a",
      queue_time: "0:00:00",
      run_created: "2022-02-01-15:31:03",
      run_id: 5,
      run_time: "0:00:00",
      start: null,
      status: "WAITING",
      submit: "2022-02-28 06:03:06",
      wallclock: "05:30",
    },
    {
      ASYPD: null,
      SYPD: null,
      counter: 11,
      created: "2022-02-27-09:36:52",
      energy: 0,
      err: "a28v_19500101_fc0_601_SIM.20220228025118.err",
      finish: "2022-02-28 01:55:18",
      job_id: 20854483,
      ncpus: 5040,
      nodes: 0,
      out: "a28v_19500101_fc0_601_SIM.20220228025118.out",
      platform: "marenostrum4",
      qos: "class_a",
      queue_time: "0:00:00",
      run_created: "2022-02-01-15:31:03",
      run_id: 5,
      run_time: "0:00:00",
      start: "2022-02-28 01:51:18",
      status: "READY",
      submit: "2022-02-27 08:36:52",
      wallclock: "05:30",
    },
    {
      ASYPD: null,
      SYPD: null,
      counter: 10,
      created: "2022-02-26-16:09:50",
      energy: 7590000.0,
      err: "a28v_19500101_fc0_601_SIM.20220227093253.err",
      finish: "2022-02-27 08:36:19",
      job_id: 20851465,
      ncpus: 5040,
      nodes: 105,
      out: "a28v_19500101_fc0_601_SIM.20220227093253.out",
      platform: "marenostrum4",
      qos: "class_a",
      queue_time: "0:00:00",
      run_created: "2022-02-01-15:31:03",
      run_id: 5,
      run_time: "0:00:00",
      start: "2022-02-27 08:32:49",
      status: "READY",
      submit: "2022-02-26 15:09:50",
      wallclock: "05:30",
    },
    {
      ASYPD: null,
      SYPD: null,
      counter: 9,
      created: "2022-02-25-12:04:58",
      energy: 2370000000.0,
      err: "a28v_19500101_fc0_601_SIM.20220226114432.err",
      finish: "2022-02-26 15:09:21",
      job_id: 20824203,
      ncpus: 5040,
      nodes: 105,
      out: "a28v_19500101_fc0_601_SIM.20220226114432.out",
      platform: "marenostrum4",
      qos: "class_a",
      queue_time: "19:07:27",
      run_created: "2022-02-01-15:31:03",
      run_id: 5,
      run_time: "8:56:56",
      start: "2022-02-26 06:12:25",
      status: "FAILED",
      submit: "2022-02-25 11:04:58",
      wallclock: "05:30",
    },
    {
      ASYPD: null,
      SYPD: null,
      counter: 8,
      created: "2022-02-23-23:01:36",
      energy: 0,
      err: "",
      finish: null,
      job_id: 20803775,
      ncpus: 5040,
      nodes: 0,
      out: "",
      platform: "marenostrum4",
      qos: "class_a",
      queue_time: "0:00:00",
      run_created: "2022-02-01-15:31:03",
      run_id: 5,
      run_time: "0:00:00",
      start: null,
      status: "WAITING",
      submit: "2022-02-23 22:01:36",
      wallclock: "05:30",
    },
    {
      ASYPD: null,
      SYPD: null,
      counter: 7,
      created: "2022-02-22-00:30:30",
      energy: 0,
      err: "",
      finish: null,
      job_id: 20782448,
      ncpus: 5040,
      nodes: 0,
      out: "",
      platform: "marenostrum4",
      qos: "class_a",
      queue_time: "0:00:00",
      run_created: "2022-02-01-15:31:03",
      run_id: 5,
      run_time: "0:00:00",
      start: null,
      status: "SUBMITTED",
      submit: "2022-02-21 23:30:30",
      wallclock: "05:30",
    },
  ],
  path_to_logs: "/esarchive/autosubmit/a28v/tmp/LOG_a28v",
};
const historyContent = [];
jobHistory.history.map((item) => historyContent.push(item.submit));
const graphSelection = ["t0ie_20120101_000_1_SIM"];
const treeSelection = { node: { refKey: "t0ie_20120101_000_1_SIM" } };

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
    render(
      <Router>
        <ExperimentContext.Provider
          value={{
            experiment: experiment,
            summaries: new Map(),
            loadingSummary: new Map(),
            experimentRunning: true,
            jobHistory: jobHistory,
            getJobHistory: () => null,
          }}
        >
          <TreeContext.Provider
            value={{
              selectedTreeNode: treeSelection,
            }}
          >
            <GraphContext.Provider value={{ selection: graphSelection }}>
              <JobHistory source='tree' />
            </GraphContext.Provider>
          </TreeContext.Provider>
        </ExperimentContext.Provider>
      </Router>,
      container
    );
  });
  // console.log(container.textContent);
  historyContent.forEach((item) =>
    expect(container.textContent).toContain(item)
  );
  // expect(container.innerHTML).toContain("Start Job Monitor");
  // expect(container.innerHTML).toContain("Refresh");
});

it("TreeControl renders with content using source graph", () => {
  act(() => {
    render(
      <Router>
        <ExperimentContext.Provider
          value={{
            experiment: experiment,
            summaries: new Map(),
            loadingSummary: new Map(),
            experimentRunning: true,
            jobHistory: jobHistory,
            getJobHistory: () => null,
          }}
        >
          <TreeContext.Provider
            value={{
              selectedTreeNode: treeSelection,
            }}
          >
            <GraphContext.Provider value={{ selection: graphSelection }}>
              <JobHistory source='graph' />
            </GraphContext.Provider>
          </TreeContext.Provider>
        </ExperimentContext.Provider>
      </Router>,
      container
    );
  });
  // console.log(container.textContent);
  historyContent.forEach((item) =>
    expect(container.textContent).toContain(item)
  );
  // expect(container.innerHTML).toContain("Start Job Monitor");
  // expect(container.innerHTML).toContain("Refresh");
});
