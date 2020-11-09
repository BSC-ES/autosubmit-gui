import React from "react";
import { unmountComponentAtNode, render } from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { act } from "react-dom/test-utils";
import GraphControl from "../GraphControl";
import ExperimentContext from "../../context/experiment/experimentContext";
import GraphContext from "../../context/graph/graphContext";
import TreeContext from "../../context/tree/treeContext";

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

it("GraphControl renders with content", () => {
  
  act(() => {
    render(<Router><ExperimentContext.Provider value={{ experiment: experiment, summaries: new Map(), loadingSummary: new Map(), experimentRunning:true}}>
        <TreeContext.Provider value={{setStartSelection:() => null}}>
          <GraphContext.Provider 
          value={{data: {}, 
          getExperimentGraph: () => null, 
          enabledGraphSearch: true, 
          getExperimentPkl: () => null, 
          setAutoUpdatePkl: () => null, 
          startAutoUpdatePkl: false, 
          loadingPkl: false }}>
            <GraphControl />
          </GraphContext.Provider>
        </TreeContext.Provider>
      </ExperimentContext.Provider></Router>, container);
  });
  // console.log(container.innerHTML);
  // console.log(container.textContent);
  expect(container.innerHTML).toContain("Start Job Monitor");
  expect(container.innerHTML).toContain("Classic");
  expect(container.innerHTML).toContain("Laplacian");
  expect(container.innerHTML).toContain("Grouped by D-M");
  expect(container.innerHTML).toContain("Grouped by Status");
  expect(container.innerHTML).toContain("Refresh");
});

it("GraphControl renders when experiment is not running", () => {
  
  act(() => {
    render(<Router><ExperimentContext.Provider value={{ experiment: experiment, summaries: new Map(), loadingSummary: new Map(), experimentRunning:false}}>
        <TreeContext.Provider value={{setStartSelection:() => null}}>
          <GraphContext.Provider 
          value={{data: {}, 
          getExperimentGraph: () => null, 
          enabledGraphSearch: true, 
          getExperimentPkl: () => null, 
          setAutoUpdatePkl: () => null, 
          startAutoUpdatePkl: false, 
          loadingPkl: false }}>
            <GraphControl />
          </GraphContext.Provider>
        </TreeContext.Provider>
      </ExperimentContext.Provider></Router>, container);
  });
  //console.log(container.innerHTML);
  //console.log(container.textContent);
  expect(container.innerHTML).not.toContain("Start Job Monitor");
  expect(container.innerHTML).toContain("Classic");
  expect(container.innerHTML).toContain("Laplacian");
  expect(container.innerHTML).toContain("Grouped by D-M");
  expect(container.innerHTML).toContain("Grouped by Status");
  expect(container.innerHTML).not.toContain("Refresh");
});