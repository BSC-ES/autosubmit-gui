import React from "react";
import { unmountComponentAtNode, render } from "react-dom";
import { act } from "react-dom/test-utils";
import Performance from "../Performance";
import ExperimentContext from "../../context/experiment/experimentContext";
import { formatNumberMoney } from "../../context/utils";

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
let considered = [];
const performancedata = {
  ASYPD: 0.95,
  CHSY: 6329.88,
  JPSY: 284160000.0,
  Parallelization: 324,
  RSYPD: 0,
  SYPD: 1.2285,
  considered: [
    {
      ASYPD: 0.95,
      CHSY: 6329.88,
      JPSY: 284160000.0,
      SYPD: 1.23,
      energy: 23680000,
      name: "a4g9_20100101_fc0_1_SIM",
      ncpus: 324,
      queue: 1741,
      running: 5861,
      yps: 0.08333333333333333,
    },
  ],
  error: false,
  error_message: "",
  warnings_job_data: [
    "We couldn't find COMPLETED POST jobs in the experiment. ASYPD can't be calculated.",
    "RSYPD | There are no TRANSFER nor CLEAN (COMPLETED) jobs in the experiment, RSYPD cannot be computed.",
  ],
  arrJPSYdata: [284160000.0],
  arrSYPDdata: [1.23],
  arrASYPDdata: [0.95],
  arrCHSY: [6329.88],
};

const performanceDisplayPlots = {
  JPSYvsCHSY: false,
  JPSYvsSYPD: false,
  JPSYvsASYPD: false,
};

performancedata.considered.map((item) => considered.push(item.name));

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
    render(
      <ExperimentContext.Provider
        value={{
          performancedata: performancedata,
          experiment: experiment,
          loadingPerformance: false,
          performanceDisplayPlots: performanceDisplayPlots,
        }}
      >
        <Performance />
      </ExperimentContext.Provider>,
      container
    );
  });
  // console.log(container.innerHTML);
  // console.log(container.textContent);
  considered.forEach((item) => expect(container.innerHTML).toContain(item));
  expect(container.textContent).toContain(
    formatNumberMoney(performancedata.ASYPD)
  );
  expect(container.textContent).toContain(
    formatNumberMoney(performancedata.CHSY)
  );
  expect(container.textContent).toContain(
    formatNumberMoney(performancedata.JPSY)
  );
  expect(container.textContent).toContain(
    formatNumberMoney(performancedata.SYPD)
  );
  expect(container.textContent).toContain(performancedata.Parallelization);
});

it("Performance renders with no data", () => {
  // startAutoUpdateRun: false
  act(() => {
    render(
      <ExperimentContext.Provider
        value={{
          performancedata: null,
          experiment: experiment,
          loadingPerformance: false,
          performanceDisplayPlots: performanceDisplayPlots,
        }}
      >
        <Performance />
      </ExperimentContext.Provider>,
      container
    );
  });
  // console.log(container.innerHTML);
  // console.log(container.textContent);
  expect(container.textContent).toContain("Press Show.");
});
