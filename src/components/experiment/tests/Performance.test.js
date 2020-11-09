import React from "react";
import { unmountComponentAtNode, render } from "react-dom";
import { act } from "react-dom/test-utils";
import Performance from "../Performance";
import ExperimentContext from "../../context/experiment/experimentContext";


let container = null;
const experiment = {branch: "master", description: "Test", owner:"wuruchi", owner_id: 1226, hpc:"LOCAL", db_historic_version: 14, version:"3.11.0", expid: "t0ie"};
let considered = [];
const performancedata = {
  "ASYPD": 0.0811,
  "CHSY": 3498.53,
  "JPSY": 117223400.0,
  "Parallelization": 284,
  "SYPD": 1.9482,
  "considered": [
      {
          "CHSY": 3311.36,
          "JPSY": 116624800.0,
          "energy": 319520.0,
          "name": "t0ie_20120101_000_2_SIM",
          "queue": 2655,
          "running": 115
      },
      {
          "CHSY": 3685.69,
          "JPSY": 117822000.0,
          "energy": 322800.0,
          "name": "t0ie_20120101_000_1_SIM",
          "queue": 2942,
          "running": 128
      }
  ],
  "error": false,
  "error_message": "",
  "warnings_job_data": []
};
performancedata.considered.map(item => considered.push(item.name));


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

it("Performance renders with content", () => {
  // startAutoUpdateRun: false
  act(() => {
    render(<ExperimentContext.Provider 
          value={{ performancedata: performancedata, experiment: experiment, loadingPerformance: false }}>
            <Performance />
          </ExperimentContext.Provider>
        , container);
  });
  // console.log(container.innerHTML);
  // console.log(container.textContent);
  considered.forEach(item => expect(container.textContent).toContain(item));
  expect(container.textContent).toContain(performancedata.ASYPD);
  expect(container.textContent).toContain(performancedata.CHSY);
  expect(container.textContent).toContain(performancedata.JPSY);
  expect(container.textContent).toContain(performancedata.SYPD);
  expect(container.textContent).toContain(performancedata.Parallelization);
});

it("Performance renders with no data", () => {
  // startAutoUpdateRun: false
  act(() => {
    render(<ExperimentContext.Provider 
          value={{ performancedata: null, experiment: experiment, loadingPerformance: false }}>
            <Performance />
          </ExperimentContext.Provider>
        , container);
  });
  // console.log(container.innerHTML);
  // console.log(container.textContent);
  expect(container.textContent).toContain("Experiment not defined.");

});

