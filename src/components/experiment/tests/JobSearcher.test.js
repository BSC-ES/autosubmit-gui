import React from "react";
import { unmountComponentAtNode, render } from "react-dom";
import { act } from "react-dom/test-utils";
import JobSearcher from "../JobSearcher";
import GraphContext from "../../context/graph/graphContext";
import ExperimentContext from "../../context/experiment/experimentContext";

let container = null;
const experiment = {branch: "master", description: "Test", owner:"wuruchi", owner_id: 1226, hpc:"LOCAL", db_historic_version: 14, version:"3.11.0"};

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

it("JobSearcher renders with content", () => {

  const foundNodes = ["a34f_19600101_fc0000_1_SIM",
  "a34f_19600101_fc0000_2_SIM",
  "a34f_19600101_fc0000_3_SIM",
  "a34f_19600101_fc0000_4_SIM",
  "a34f_19600101_fc0000_5_SIM"]
  act(() => {
    render(<ExperimentContext.Provider value={{ totalJobs: 12, experiment: experiment}}>
            <GraphContext.Provider 
            value={{data: {}, 
                  selection: {},
                  searchJobInGraph: () => null,
                  foundNodes: foundNodes,
                  loadingSearchJob: false,
                  data: { total_jobs: 12 },
                  selection: null,
                  navigateTo: () => null }}>
              <JobSearcher />
            </GraphContext.Provider>
          </ExperimentContext.Provider>, container);
  });
    
  expect(container.textContent).toContain("Previous");
  expect(container.textContent).toContain("Next");
  expect(container.textContent).toContain("12");
  expect(container.innerHTML).toContain("1 of 5"); // from foundNodes array
});


it("JobSearcher renders with no search result", () => {

  const foundNodes = null
  act(() => {
    render(<ExperimentContext.Provider value={{ totalJobs: 12, experiment: experiment}}>
            <GraphContext.Provider 
            value={{data: {}, 
                  selection: {},
                  searchJobInGraph: () => null,
                  foundNodes: foundNodes,
                  loadingSearchJob: false,
                  data: { total_jobs: 12 },
                  selection: null,
                  navigateTo: () => null }}>
              <JobSearcher />
            </GraphContext.Provider>
          </ExperimentContext.Provider>, container);
  });
  // console.log(container.innerHTML);
  // console.log(container.textContent);
  expect(container.textContent).not.toContain("Previous");
  expect(container.textContent).not.toContain("Next");
  expect(container.innerHTML).not.toContain("1 of 5"); // from foundNodes array
});