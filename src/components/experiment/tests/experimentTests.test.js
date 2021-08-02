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
import TreeContext from "../../context/tree/treeContext";
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

// --- ExperimentItem.js ---

it("ExperimentItem renders with content", () => {
  const experiment = {name: "a2h6", description: "Test", user:"wuruchi", hpc:"LOCAL", status:"RUNNING", completed:10, total:100, version:"3.11.0"};
  act(() => {
    render(<Router><ExperimentContext.Provider value={{ experiment: {}, summaries: new Map(), loadingSummary: new Map()}}><ExperimentItem key="a2h6" experiment={experiment} summaries={new Map()} loadingSummary={new Map()}/></ExperimentContext.Provider></Router>, container);
  });
  expect(container.textContent).toContain("a2h6");
  expect(container.textContent).toContain("wuruchi");
});


it('ExperimentItem renders correctly', () => {
  const experiment = {name: "a2h6", description: "Test", user:"wuruchi", hpc:"LOCAL", status:"RUNNING", completed:10, total:100, version:"3.11.0"};
  const tree = renderer.create(<Router><ExperimentContext.Provider value={{ experiment: {}, summaries: new Map(), loadingSummary: new Map()}}><ExperimentItem key="a2h6" experiment={experiment} summaries={new Map()} loadingSummary={new Map()}/></ExperimentContext.Provider></Router>).toJSON();
  expect(tree).toMatchSnapshot();
});



// --- ExperimentColumns.js --- 

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

// --- Experiment.js --- 

it('Experiment renders with content', () => {

  const experiment = {expid: "a2h6", branch: "master", description: "Test", owner:"wuruchi", owner_id: 1226, hpc:"LOCAL", db_historic_version: 14, version:"3.11.0"};

  act(() => {
    render(<Router><ExperimentContext.Provider value={{ experiment: experiment, totalJobs: 100, loading: false, loadingState: false, experimentRunning: true}}><TreeContext.Provider value={{ getExperimentRunJobData: () => null, fancyTree: {}, startAutoUpdateTreePkl: false, loadingPreviousRun: false, currentRunIdOnTree: {runId: 1, message: "None", created: "2020-11-02-16:59:42"} }}>
          <Experiment />
        </TreeContext.Provider>        
      </ExperimentContext.Provider>
      </Router>, container);
  });
  expect(container.textContent).toContain("a2h6");
  expect(container.textContent).toContain("ACTIVE");

  act(() => {
    render(<Router><ExperimentContext.Provider value={{ experiment: experiment, totalJobs: 100, loading: false, loadingState: false, experimentRunning: false}}>
    <TreeContext.Provider value={{ getExperimentRunJobData: () => null, fancyTree: null, startAutoUpdateTreePkl: false,  loadingPreviousRun: false, currentRunIdOnTree: {runId: 1, message: "None", created: "2020-11-02-16:59:42"} }}>
    <Experiment />
    </TreeContext.Provider>      
    </ExperimentContext.Provider></Router>, container);
  });
  expect(container.textContent).toContain("a2h6");
  expect(container.textContent).toContain("INACTIVE");
});

// --- Running.js ---

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
