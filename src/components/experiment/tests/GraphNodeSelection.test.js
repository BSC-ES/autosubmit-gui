import React from "react";
import { unmountComponentAtNode, render } from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { act } from "react-dom/test-utils";
import GraphNodeSelection from "../GraphNodeSelection";
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

it("GraphNodeSelection renders with content", () => {

  const currentSelected = ["a34f_19600101_fc0000_1_SIM",
  "a34f_19600101_fc0000_2_SIM",
  "a34f_19600101_fc0000_3_SIM",
  "a34f_19600101_fc0000_4_SIM",
  "a34f_19600101_fc0000_5_SIM",
  "a34f_19600101_fc0000_6_SIM",
  "a34f_19600101_fc0000_7_SIM",
  "a34f_19600101_fc0000_8_SIM",
  "a34f_19600101_fc0000_9_SIM",
  "a34f_19600101_fc0000_10_SIM"]

  act(() => {
    render(<Router><ExperimentContext.Provider value={{ experiment: experiment, summaries: new Map(), loadingSummary: new Map(), experimentRunning:true, canSelect: false, setCurrentCommand: () => null, currentSelected: currentSelected}}>
      <TreeContext.Provider value={{
        treeSelectedNodes: null,
        currentCommandTree: null,
        currentTextCommandTree: null,
        setCurrentTextCommandTree: () => null,
        setCurrentCommandTree: () => null,
      }}>
      <GraphContext.Provider 
          value={{data: {}, 
                selection: {},
                updateGraphSelectedNodes: () => null,
                graphSelectedNodes: currentSelected,
                setCurrentCommandGraph: () => null,
                currentCommandGraph: "" }}>
            <GraphNodeSelection />
          </GraphContext.Provider>
      </TreeContext.Provider>          
      </ExperimentContext.Provider></Router>, container);
  });
  // console.log(container.innerHTML);
  // console.log(container.textContent);
  expect(container.textContent).toContain("Ready");
  expect(container.textContent).toContain("Waiting");
  expect(container.textContent).toContain("Completed");
  expect(container.textContent).toContain("Suspended");
  expect(container.textContent).toContain("Failed");  
});


it("GraphNodeSelection renders null when selection is still enabled", () => {

  const currentSelected = ["a34f_19600101_fc0000_1_SIM",
  "a34f_19600101_fc0000_2_SIM",
  "a34f_19600101_fc0000_3_SIM",
  "a34f_19600101_fc0000_4_SIM",
  "a34f_19600101_fc0000_5_SIM",
  "a34f_19600101_fc0000_6_SIM",
  "a34f_19600101_fc0000_7_SIM",
  "a34f_19600101_fc0000_8_SIM",
  "a34f_19600101_fc0000_9_SIM",
  "a34f_19600101_fc0000_10_SIM"]

  act(() => {
    render(<Router><ExperimentContext.Provider value={{ experiment: experiment, summaries: new Map(), loadingSummary: new Map(), experimentRunning:true, canSelect: true, setCurrentCommand: () => null, currentSelected: currentSelected}}>
      <TreeContext.Provider value={{
        treeSelectedNodes: null,
        currentCommandTree: null,
        currentTextCommandTree: null,
        setCurrentTextCommandTree: () => null,
        setCurrentCommandTree: () => null,
      }}>
        <GraphContext.Provider 
          value={{data: {}, 
                selection: {},
                updateGraphSelectedNodes: () => null,
                graphSelectedNodes: currentSelected,
                setCurrentCommandGraph: () => null,
                currentCommandGraph: "" }}>
            <GraphNodeSelection />
        </GraphContext.Provider>
      </TreeContext.Provider>
      </ExperimentContext.Provider></Router>, container);
  });
  expect(container.textContent).toBeFalsy();
});