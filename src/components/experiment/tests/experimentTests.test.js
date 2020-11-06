import React from "react";
import { unmountComponentAtNode, render } from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import renderer from 'react-test-renderer';
import { act } from "react-dom/test-utils";
import ExperimentItem from "../ExperimentItem";
import Search from "../Search";
import ExperimentColumn from "../ExperimentColumn";
import Experiment from "../Experiment";
import Performance from "../Performance";
import Running from "../Running";
import ExperimentContext from "../../context/experiment/experimentContext";
import AlertContext from "../../context/alert/alertContext";

let container = null;
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


it("ExperimentItem renders with content", () => {
  const experiment = {name: "a2h6", description: "Test", user:"wuruchi", hpc:"LOCAL", status:"RUNNING", completed:10, total:100, version:"3.11.0"};
  act(() => {
    render(<Router><ExperimentContext.Provider value={{ experiment: {}, summaries: new Map(), loadingSummary: new Map()}}><ExperimentItem key="a2h6" experiment={experiment}/></ExperimentContext.Provider></Router>, container);
  });
  expect(container.textContent).toContain("a2h6");
  expect(container.textContent).toContain("wuruchi");
});

it('ExperimentItem renders correctly', () => {
  const experiment = {name: "a2h6", description: "Test", user:"wuruchi", hpc:"LOCAL", status:"RUNNING", completed:10, total:100, version:"3.11.0"};
  const tree = renderer.create(<Router><ExperimentContext.Provider value={{ experiment: {}, summaries: new Map(), loadingSummary: new Map()}}><ExperimentItem key="a2h6" experiment={experiment}/></ExperimentContext.Provider></Router>).toJSON();
  expect(tree).toMatchSnapshot();
});

it("Search renders correctly", () => {
  const tree = renderer.create(<Router><ExperimentContext.Provider value={{ experiment: {}, experiments: [], summaries: new Map(), loadingSummary: new Map()}}><AlertContext.Provider value={{}}><Search/></AlertContext.Provider></ExperimentContext.Provider></Router>).toJSON();
  expect(tree).toMatchSnapshot();
})

it('ExperimentColumn renders with content', () => {
  const experiment = {branch: "master", description: "Test", owner:"wuruchi", owner_id: 1226, hpc:"LOCAL", db_historic_version: 14, version:"3.11.0"};
  act(() => {
    render(<Router><ExperimentContext.Provider value={{ experiment: experiment, totalJobs: 100, loading: false}}><ExperimentColumn /></ExperimentContext.Provider></Router>, container);
  });
  expect(container.textContent).toContain("master");
  expect(container.textContent).toContain("wuruchi");
  expect(container.textContent).toContain("100");
  expect(container.textContent).toContain("14");
});

it('Experiment renders with content', () => {

  const experiment = {expid: "a2h6", branch: "master", description: "Test", owner:"wuruchi", owner_id: 1226, hpc:"LOCAL", db_historic_version: 14, version:"3.11.0"};

  act(() => {
    render(<Router><ExperimentContext.Provider value={{ experiment: experiment, totalJobs: 100, loading: false, loadingState: false, experimentRunning: true}}><Experiment /></ExperimentContext.Provider></Router>, container);
  });
  expect(container.textContent).toContain("a2h6");
  expect(container.textContent).toContain("ACTIVE");

  act(() => {
    render(<Router><ExperimentContext.Provider value={{ experiment: experiment, totalJobs: 100, loading: false, loadingState: false, experimentRunning: false}}><Experiment /></ExperimentContext.Provider></Router>, container);
  });
  expect(container.textContent).toContain("a2h6");
  expect(container.textContent).toContain("INACTIVE");
});

it('Performance renders with content and content is listed', () => {
    const experiment = {expid: "a2h6", branch: "master", description: "Test", owner:"wuruchi", owner_id: 1226, hpc:"LOCAL", db_historic_version: 14, version:"3.11.0"};
    const performancedata = {
      ASYPD: 1.8483,
      CHSY: 92.88,
      JPSY: 1521053.0,
      Parallelization: 1,
      SYPD: 1.8604,
      considered: [
          {
              CHSY: 878.84,
              JPSY: 6320340.0,
              energy: 17316.0,
              name: "a2h6_20150527_001_4_SIM",
              queue: 60,
              running: 8668
          },
          {
              CHSY: 5.68,
              JPSY: 1731545.4,
              energy: 4743.96,
              name: "a2h6_20150527_003_3_SIM",
              queue: 0,
              running: 56
          },
          {
              CHSY: 6.49,
              JPSY: 825385.45,
              energy: 2261.33,
              name: "a2h6_20150527_001_2_SIM",
              queue: 0,
              running: 64
          },
          {
              CHSY: 6.29,
              JPSY: 920526.35,
              energy: 2521.99,
              name: "a2h6_20150527_003_1_SIM",
              queue: 0,
              running: 62
          },
          {
              CHSY: 6.39,
              JPSY: 935374.55,
              energy: 2562.67,
              name: "a2h6_20141128_003_1_SIM",
              queue: 0,
              running: 63
          },
          {
              CHSY: 6.39,
              JPSY: 935374.55,
              energy: 2562.67,
              name: "a2h6_20141128_001_1_SIM",
              queue: 0,
              running: 63
          },
          {
              CHSY: 6.39,
              JPSY: 935374.55,
              energy: 2562.67,
              name: "a2h6_20150527_001_1_SIM",
              queue: 0,
              running: 63
          },
          {
              CHSY: 5.88,
              JPSY: 1793387.35,
              energy: 4913.39,
              name: "a2h6_20150527_001_3_SIM",
              queue: 0,
              running: 58
          },
          {
              CHSY: 6.39,
              JPSY: 812490.0,
              energy: 2226.0,
              name: "a2h6_20150527_003_2_SIM",
              queue: 0,
              running: 63
          },
          {
              CHSY: 0.1,
              JPSY: 730.0,
              energy: 2.0,
              name: "a2h6_20150527_003_4_SIM",
              queue: 0,
              running: 1
          }
      ],
      error: false,
      error_message: "",
      warnings_job_data: [
          "Wrapper | Wrapper 16043275053587 does not have complete sacct data available.",
          "Approximation | The energy results in wrapper 16043275053587 are an approximation. Total energy detected: 17320.0.",
          "Completion | Job a2h6_20150527_001_3_REDUCE (Package 16043275053587) has no reliable information available and has been excluded from the calculation.",
          "Completion | Job a2h6_20150527_001_4_SIM (Package 16043275053587) data has been corrected with data from worker database.",
          "Wrapper | Wrapper 16043271293004 does not have complete sacct data available.",
          "Approximation | The energy results in wrapper 16043271293004 are an approximation. Total energy detected: 9010.0.",
          "Wrapper | Wrapper 16043266984965 does not have complete sacct data available.",
          "Approximation | The energy results in wrapper 16043266984965 are an approximation. Total energy detected: 10210.0.",
          "Wrapper | Wrapper 16043272999254 does not have complete sacct data available.",
          "Approximation | The energy results in wrapper 16043272999254 are an approximation. Total energy detected: 19230.0."
      ]
  }

  act(() => {
    render(<Router><ExperimentContext.Provider value={{ experiment: experiment, totalJobs: 100, loading: false, loadingState: false, loadingPerformance: false, performancedata: performancedata}}><Performance /></ExperimentContext.Provider></Router>, container);
  });

  expect(container.textContent).toContain("a2h6_20150527_001_4_SIM");
  expect(container.textContent).toContain("a2h6_20150527_003_3_SIM");
  expect(container.textContent).toContain("a2h6_20150527_001_2_SIM");
  expect(container.textContent).toContain("a2h6_20150527_003_1_SIM");
  expect(container.textContent).toContain("a2h6_20141128_003_1_SIM");
  expect(container.textContent).toContain("a2h6_20141128_001_1_SIM");
  expect(container.textContent).toContain("a2h6_20150527_001_1_SIM");
  expect(container.textContent).toContain("a2h6_20150527_001_3_SIM");
  expect(container.textContent).toContain("a2h6_20150527_003_2_SIM");
  expect(container.textContent).toContain("a2h6_20150527_003_4_SIM");
  expect(container.textContent).toContain("Wrapper | Wrapper 16043275053587 does not have complete sacct data available.");

});

it('Log Running renders with no rundata', () => {
  const experiment = {expid: "a2h6"};
  //const rundata
  act(() => {
    render(<Running rundata={null}
      loadingRun={false}
      cleanRunData={() => null}
      getExperimentRun={() => null}
      experiment={experiment}
      startAutoUpdateRun={() => null}
      setAutoUpdateRun={() => null}
      experimentRunning={false} />, container);
  });
  expect(container.textContent).toContain("Loading");
})

it('Log Running renders with rundata', () => {
  const experiment = {expid: "a2h6"};
  const rundata = {error: false, erro_message: "", found: true, lastModified: "2020-11-02 16:59:42", logcontent: [
    {
        content: "  File \"/home/Earth/wuruchi/AutosubmitRealDeal/autosubmit-issue371a/autosubmit/autosubmit/database/db_jobdata.py\", line 1321, in process_current_run_collection",
        index: 0
    },
    {
      content: "    if jobs_in_package[i].running_time() <= 0:",
      index: 1
    },
    {
      content: "IndexError: list index out of range",
      index: 2
    }],
  logfile: "20201102_175754_run.log",
  timeStamp: 1604336382.4040346}
  act(() => {
    render(<Running rundata={rundata}
      loadingRun={false}
      cleanRunData={() => null}
      getExperimentRun={() => null}
      experiment={experiment}
      startAutoUpdateRun={() => null}
      setAutoUpdateRun={() => null}
      experimentRunning={false} />, container);
  });
  expect(container.textContent).toContain("IndexError: list index out of range");
  expect(container.textContent).toContain("20201102_175754_run.log");
});
