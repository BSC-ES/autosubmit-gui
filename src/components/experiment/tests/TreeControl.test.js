import React from "react";
import { unmountComponentAtNode, render } from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { act } from "react-dom/test-utils";
import renderer from 'react-test-renderer';
import TreeControl from "../TreeControl";
import ExperimentContext from "../../context/experiment/experimentContext";
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

it("TreeControl renders with content", () => {
  
  act(() => {
    render(<Router><ExperimentContext.Provider value={{ experiment: experiment, summaries: new Map(), loadingSummary: new Map(), experimentRunning:true}}><TreeContext.Provider 
      value={{treedata: {}, 
      getExperimentTree: () => null, 
      cleanTreeData: () => null, 
      enabledTreeSearch: true, 
      getExperimentTreePkl: () => null, 
      loadingTreeRefresh: false, 
      setAutoUpdateTreePkl: () => null, 
      setWarningActive: () => null,
      startAutoUpdateTreePkl: false, 
      loadingTreePkl: false }}>
        <TreeControl />
      </TreeContext.Provider></ExperimentContext.Provider></Router>, container);
  });
  //console.log(container.innerHTML);
  expect(container.innerHTML).toContain("Start Job Monitor");
  expect(container.innerHTML).toContain("Refresh");
});