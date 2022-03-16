import React from "react";
import { unmountComponentAtNode, render } from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { act } from "react-dom/test-utils";
import renderer from "react-test-renderer";
import StatsSearch from "./StatsSearch";
import ExperimentContext from "../context/experiment/experimentContext";
import StatsContext from "../context/statistics/statsContext";

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
  const experiment = {
    expid: "t08b",
    branch: "master",
    description: "Test",
    owner: "gmontane",
    owner_id: 1226,
    hpc: "LOCAL",
    db_historic_version: 17,
    version: "3.13.0",
  };

  const requestResult = {
    Statistics: {
      JobStatistics: [
        {
          completedCount: 1,
          completedQueueTime: 0.0,
          completedRunTime: 0.016666666666666666,
          cpuConsumption: 0.016666666666666666,
          expectedConsumption: 0.08333333333333333,
          expectedCpuConsumption: 0.08333333333333333,
          failedCount: 0,
          failedCpuConsumption: 0.0,
          failedQueueTime: 0.0,
          failedRealConsumption: 0.0,
          failedRunTime: 0.0,
          name: "a40z_2022031512_1_ARCHIVE",
          processors: 1,
          realConsumption: 0.016666666666666666,
          retrialCount: 1,
          submittedCount: 1,
          wallclock: 0.08333333333333333,
        },
        {
          completedCount: 1,
          completedQueueTime: 0.0030555555555555557,
          completedRunTime: 0.0025,
          cpuConsumption: 0.0025,
          expectedConsumption: 0.5,
          expectedCpuConsumption: 0.5,
          failedCount: 0,
          failedCpuConsumption: 0.0,
          failedQueueTime: 0.0,
          failedRealConsumption: 0.0,
          failedRunTime: 0.0,
          name: "a40z_2022031512_1_CALC_STATS",
          processors: 1,
          realConsumption: 0.0025,
          retrialCount: 1,
          submittedCount: 1,
          wallclock: 0.5,
        },
        {
          completedCount: 1,
          completedQueueTime: 0.0,
          completedRunTime: 0.022222222222222223,
          cpuConsumption: 0.022222222222222223,
          expectedConsumption: 4.0,
          expectedCpuConsumption: 4.0,
          failedCount: 0,
          failedCpuConsumption: 0.0,
          failedQueueTime: 0.0,
          failedRealConsumption: 0.0,
          failedRunTime: 0.0,
          name: "a40z_2022031512_1_DOWNLOAD_SILAM",
          processors: 1,
          realConsumption: 0.022222222222222223,
          retrialCount: 1,
          submittedCount: 1,
          wallclock: 4.0,
        },
        {
          completedCount: 1,
          completedQueueTime: 0.0008333333333333334,
          completedRunTime: 0.004166666666666667,
          cpuConsumption: 0.06666666666666667,
          expectedConsumption: 0.3333333333333333,
          expectedCpuConsumption: 5.333333333333333,
          failedCount: 0,
          failedCpuConsumption: 0.0,
          failedQueueTime: 0.0,
          failedRealConsumption: 0.0,
          failedRunTime: 0.0,
          name: "a40z_2022031512_1_IT_H_POINTS",
          processors: 16,
          realConsumption: 0.004166666666666667,
          retrialCount: 1,
          submittedCount: 1,
          wallclock: 0.3333333333333333,
        },
        {
          completedCount: 1,
          completedQueueTime: 0.006944444444444444,
          completedRunTime: 0.0016666666666666668,
          cpuConsumption: 0.0016666666666666668,
          expectedConsumption: 0.5,
          expectedCpuConsumption: 0.5,
          failedCount: 0,
          failedCpuConsumption: 0.0,
          failedQueueTime: 0.0,
          failedRealConsumption: 0.0,
          failedRunTime: 0.0,
          name: "a40z_2022031512_CAMS_1_GET_FILES",
          processors: 1,
          realConsumption: 0.0016666666666666668,
          retrialCount: 1,
          submittedCount: 1,
          wallclock: 0.5,
        },
        {
          completedCount: 1,
          completedQueueTime: 0.8572222222222222,
          completedRunTime: 0.0075,
          cpuConsumption: 0.36,
          expectedConsumption: 0.5,
          expectedCpuConsumption: 24.0,
          failedCount: 0,
          failedCpuConsumption: 0.0,
          failedQueueTime: 0.0,
          failedRealConsumption: 0.0,
          failedRunTime: 0.0,
          name: "a40z_2022031512_CAMS_1_IT",
          processors: 48,
          realConsumption: 0.0075,
          retrialCount: 1,
          submittedCount: 1,
          wallclock: 0.5,
        },
        {
          completedCount: 1,
          completedQueueTime: 0.0008333333333333334,
          completedRunTime: 0.0016666666666666668,
          cpuConsumption: 0.0016666666666666668,
          expectedConsumption: 0.5,
          expectedCpuConsumption: 0.5,
          failedCount: 0,
          failedCpuConsumption: 0.0,
          failedQueueTime: 0.0,
          failedRealConsumption: 0.0,
          failedRunTime: 0.0,
          name: "a40z_2022031512_MONARCH_1_GET_FILES",
          processors: 1,
          realConsumption: 0.0016666666666666668,
          retrialCount: 1,
          submittedCount: 1,
          wallclock: 0.5,
        },
        {
          completedCount: 1,
          completedQueueTime: 0.8438888888888889,
          completedRunTime: 0.009722222222222222,
          cpuConsumption: 0.4666666666666667,
          expectedConsumption: 0.5,
          expectedCpuConsumption: 24.0,
          failedCount: 0,
          failedCpuConsumption: 0.0,
          failedQueueTime: 0.0,
          failedRealConsumption: 0.0,
          failedRunTime: 0.0,
          name: "a40z_2022031512_MONARCH_1_IT",
          processors: 48,
          realConsumption: 0.009722222222222222,
          retrialCount: 1,
          submittedCount: 1,
          wallclock: 0.5,
        },
        {
          completedCount: 1,
          completedQueueTime: 0.003611111111111111,
          completedRunTime: 0.0019444444444444444,
          cpuConsumption: 0.0019444444444444444,
          expectedConsumption: 0.5,
          expectedCpuConsumption: 0.5,
          failedCount: 0,
          failedCpuConsumption: 0.0,
          failedQueueTime: 0.0,
          failedRealConsumption: 0.0,
          failedRunTime: 0.0,
          name: "a40z_2022031512_SILAM_1_GET_FILES",
          processors: 1,
          realConsumption: 0.0019444444444444444,
          retrialCount: 1,
          submittedCount: 1,
          wallclock: 0.5,
        },
        {
          completedCount: 1,
          completedQueueTime: 0.8427777777777777,
          completedRunTime: 0.008333333333333333,
          cpuConsumption: 0.4,
          expectedConsumption: 0.5,
          expectedCpuConsumption: 24.0,
          failedCount: 0,
          failedCpuConsumption: 0.0,
          failedQueueTime: 0.0,
          failedRealConsumption: 0.0,
          failedRunTime: 0.0,
          name: "a40z_2022031512_SILAM_1_IT",
          processors: 48,
          realConsumption: 0.008333333333333333,
          retrialCount: 1,
          submittedCount: 1,
          wallclock: 0.5,
        },
        {
          completedCount: 1,
          completedQueueTime: 0.0,
          completedRunTime: 0.050277777777777775,
          cpuConsumption: 0.050277777777777775,
          expectedConsumption: 0.16666666666666666,
          expectedCpuConsumption: 0.16666666666666666,
          failedCount: 0,
          failedCpuConsumption: 0.0,
          failedQueueTime: 0.0,
          failedRealConsumption: 0.0,
          failedRunTime: 0.0,
          name: "a40z_SEND_SOURCE",
          processors: 1,
          realConsumption: 0.050277777777777775,
          retrialCount: 1,
          submittedCount: 1,
          wallclock: 0.16666666666666666,
        },
      ],
      Period: {
        From: "None",
        To: "2022-03-16 14:18:00",
      },
    },
    error: false,
    error_message: "",
    summary: {
      completedCount: 11,
      cpuConsumption: 1.3903,
      cpuConsumptionPercentage: 1.66,
      expectedConsumption: 8.0833,
      expectedCpuConsumption: 83.5833,
      failedCount: 0,
      failedCpuConsumption: 0.0,
      failedRealConsumption: 0.0,
      realConsumption: 0.1267,
      runCount: 11,
      submittedCount: 11,
      totalQueueTime: 2.56,
    },
  };

  act(() => {
    render(
      <Router>
        <ExperimentContext.Provider
          value={{ experiment: { experiment }, loading: false }}
        >
          <StatsContext.Provider
            value={{
              statdata: requestResult.Statistics.JobStatistics,
              getExperimentStatus: () => null,
              loading: false,
              clearStats: () => null,
              isError: false,
              errorMessage: "",
              filterAppliedCount: 0,
              filteredStatdata: [],
              timeframe: requestResult.Statistics.Period,
            }}
          >
            <StatsSearch />
          </StatsContext.Provider>
        </ExperimentContext.Provider>
      </Router>,
      container
    );
  });

  expect(container.textContent).toContain(
    "Statistics from the time frame: Start of experiment to 2022-03-16 14:18:00"
  );

  const tree = renderer
    .create(
      <Router>
        <ExperimentContext.Provider
          value={{ experiment: { experiment }, loading: false }}
        >
          <StatsContext.Provider
            value={{
              statdata: requestResult.Statistics.JobStatistics,
              getExperimentStatus: () => null,
              loading: false,
              clearStats: () => null,
              isError: false,
              errorMessage: "",
              filterAppliedCount: 0,
              filteredStatdata: [],
              timeframe: requestResult.Statistics.Period,
            }}
          >
            <StatsSearch />
          </StatsContext.Provider>
        </ExperimentContext.Provider>
      </Router>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
