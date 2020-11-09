import React from "react";
import { unmountComponentAtNode, render } from "react-dom";
import { act } from "react-dom/test-utils";
import LogControl from "../LogControl";
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

it("LogControl renders with content and auto-update disabled", () => {
  // startAutoUpdateRun: false
  act(() => {
    render(<ExperimentContext.Provider 
          value={{experiment: experiment, 
          startAutoUpdateRun: false, 
          setAutoUpdateRun: () => null }}>
            <LogControl />
          </ExperimentContext.Provider>
        , container);
  });
  // console.log(container.innerHTML);
  // console.log(container.textContent);
  expect(container.innerHTML).toContain("Show Log");
});

it("LogControl renders with content and auto-update enabled", () => {
  // startAutoUpdateRun: true
  act(() => {
    render(<ExperimentContext.Provider 
          value={{experiment: experiment, 
          startAutoUpdateRun: true, 
          setAutoUpdateRun: () => null }}>
            <LogControl />
          </ExperimentContext.Provider>
        , container);
  });
  // console.log(container.innerHTML);
  // console.log(container.textContent);
  expect(container.innerHTML).toContain("Hide Log");
});
