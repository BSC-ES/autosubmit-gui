import React from "react";
import { unmountComponentAtNode, render } from "react-dom";
import { act } from "react-dom/test-utils";
import PerformanceControl from "../PerformanceControl";
import ExperimentContext from "../../context/experiment/experimentContext";
import TreeContext from "../../context/tree/treeContext";

let container = null;
const experiment = {
  branch: "master",
  description: "Test",
  owner: "wuruchi",
  owner_id: 1226,
  hpc: "LOCAL",
  db_historic_version: 14,
  version: "3.11.0",
  expid: "t0ie",
};

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

it("PerformanceControl renders with content", () => {
  // startAutoUpdateRun: false
  act(() => {
    render(
      <ExperimentContext.Provider
        value={{
          getExperimentPerformanceMetrics: () => null,
          experiment: experiment,
          loadingPerformance: false,
        }}
      >
        <TreeContext.Provider value={{ enabledTreeSearch: true }}>
          <PerformanceControl />
        </TreeContext.Provider>
      </ExperimentContext.Provider>,
      container
    );
  });
  expect(container.innerHTML).toContain("Show");
});

it("PerformanceControl renders with content but no experiment", () => {
  // startAutoUpdateRun: false
  act(() => {
    render(
      <ExperimentContext.Provider
        value={{
          getExperimentPerformanceMetrics: () => null,
          experiment: null,
          loadingPerformance: false,
        }}
      >
        <TreeContext.Provider value={{ enabledTreeSearch: true }}>
          <PerformanceControl />
        </TreeContext.Provider>
      </ExperimentContext.Provider>,
      container
    );
  });
  expect(container.innerHTML).not.toContain("Refresh");
});
