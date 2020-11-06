import React from "react";
import { unmountComponentAtNode, render } from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { act } from "react-dom/test-utils";
import renderer from 'react-test-renderer';
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
  const experiment = {expid: "t08b", branch: "master", description: "Test", owner:"gmontane", owner_id: 1226, hpc:"LOCAL", db_historic_version: 14, version:"3.11.0"};
  const result = [
    [
      "Jobs",
      "Queued",
      "Run",
      "Failed Jobs",
      "Failed Queued",
      "Fail Run"
    ],
    [
      {
        "v": 1,
        "f": "t08b_20120101_000_1_SIM"
      },
      1.8716666666666666,
      0.007222222222222222,
      0,
      0,
      0
    ],
    [
      {
        "v": 2,
        "f": "t08b_20120101_001_1_SIM"
      },
      1.871388888888889,
      0.0077777777777777776,
      0,
      0,
      0
    ],
    [
      {
        "v": 3,
        "f": "t08b_20120101_002_1_SIM"
      },
      1.8488888888888888,
      0.005,
      0,
      0,
      0
    ],
    [
      {
        "v": 4,
        "f": "t08b_20120101_003_1_SIM"
      },
      1.87,
      0.006111111111111111,
      0,
      0,
      0
    ],
    [
      {
        "v": 5,
        "f": "t08b_20120101_1_DA"
      },
      0.0011111111111111111,
      0.1297222222222222,
      0,
      0,
      0
    ],
    [
      {
        "v": 6,
        "f": "t08b_20120101_000_1_REDUCE"
      },
      0.0011111111111111111,
      0.004722222222222222,
      0,
      0,
      0
    ],
    [
      {
        "v": 7,
        "f": "t08b_20120101_001_1_REDUCE"
      },
      0.005833333333333334,
      0.0019444444444444444,
      0,
      0,
      0
    ],
    [
      {
        "v": 8,
        "f": "t08b_20120101_002_1_REDUCE"
      },
      0.008611111111111111,
      0.0033333333333333335,
      0,
      0,
      0
    ],
    [
      {
        "v": 9,
        "f": "t08b_20120101_003_1_REDUCE"
      },
      0.0125,
      0.003611111111111111,
      0,
      0,
      0
    ],
    [
      {
        "v": 10,
        "f": "t08b_20120101_1_CALC_STATS"
      },
      0.0011111111111111111,
      0.0030555555555555557,
      0,
      0,
      0
    ],
    [
      {
        "v": 11,
        "f": "t08b_20120101_000_1_ARCHIVE"
      },
      0.0002777777777777778,
      0.016944444444444446,
      0,
      0,
      0
    ],
    [
      {
        "v": 12,
        "f": "t08b_20120101_001_1_ARCHIVE"
      },
      0,
      0.016944444444444446,
      0,
      0,
      0
    ],
    [
      {
        "v": 13,
        "f": "t08b_20120101_002_1_ARCHIVE"
      },
      0,
      0.016944444444444446,
      0,
      0,
      0
    ],
    [
      {
        "v": 14,
        "f": "t08b_20120101_003_1_ARCHIVE"
      },
      0,
      0.017777777777777778,
      0,
      0,
      0
    ]
  ]
  const requestResult = {
    "error": false,
    "error_message": "",
    "jobs": [
      "t08b_20120101_000_1_SIM",
      "t08b_20120101_001_1_SIM",
      "t08b_20120101_002_1_SIM",
      "t08b_20120101_003_1_SIM",
      "t08b_20120101_1_DA",
      "t08b_20120101_000_1_REDUCE",
      "t08b_20120101_001_1_REDUCE",
      "t08b_20120101_002_1_REDUCE",
      "t08b_20120101_003_1_REDUCE",
      "t08b_20120101_1_CALC_STATS",
      "t08b_20120101_000_1_ARCHIVE",
      "t08b_20120101_001_1_ARCHIVE",
      "t08b_20120101_002_1_ARCHIVE",
      "t08b_20120101_003_1_ARCHIVE"
    ],
    "otherstats": [],
    "periodo_fin": "Tue, 03 Nov 2020 18:49:00 GMT",
    "periodo_ini": "Tue, 03 Nov 2020 16:49:00 GMT",
    "stats": {
      "fail_queued": [
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
      ],
      "fail_run": [
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
      ],
      "failed_jobs": [
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
      ],
      "max_fail": 0,
      "max_time": 1.8716666666666666,
      "queued": [
        1.8716666666666666,
        1.871388888888889,
        1.8488888888888888,
        1.87,
        0.0011111111111111111,
        0.0011111111111111111,
        0.005833333333333334,
        0.008611111111111111,
        0.0125,
        0.0011111111111111111,
        0.0002777777777777778,
        0,
        0,
        0
      ],
      "run": [
        0.007222222222222222,
        0.0077777777777777776,
        0.005,
        0.006111111111111111,
        0.1297222222222222,
        0.004722222222222222,
        0.0019444444444444444,
        0.0033333333333333335,
        0.003611111111111111,
        0.0030555555555555557,
        0.016944444444444446,
        0.016944444444444446,
        0.016944444444444446,
        0.017777777777777778
      ],
      "threshold": 1,
      "totals": [
        "Period: 2020-11-03 16:49:00 ~ 2020-11-03 18:49:00",
        "Submitted (#): 14",
        "Run  (#): 14",
        "Failed  (#): 0",
        "Completed (#): 14",
        "Queueing time (h): 7.49",
        "Expected consumption real (h): 13.33",
        "Expected consumption CPU time (h): 366.33",
        "Consumption real (h): 0.24",
        "Consumption CPU time (h): 35.07",
        "Consumption (%): 9.57"
      ]
    }
  }
  const ticks = [
    {
      "v": 1,
      "f": "t08b_20120101_000_1_SIM"
    },
    {
      "v": 2,
      "f": "t08b_20120101_001_1_SIM"
    },
    {
      "v": 3,
      "f": "t08b_20120101_002_1_SIM"
    },
    {
      "v": 4,
      "f": "t08b_20120101_003_1_SIM"
    },
    {
      "v": 5,
      "f": "t08b_20120101_1_DA"
    },
    {
      "v": 6,
      "f": "t08b_20120101_000_1_REDUCE"
    },
    {
      "v": 7,
      "f": "t08b_20120101_001_1_REDUCE"
    },
    {
      "v": 8,
      "f": "t08b_20120101_002_1_REDUCE"
    },
    {
      "v": 9,
      "f": "t08b_20120101_003_1_REDUCE"
    },
    {
      "v": 10,
      "f": "t08b_20120101_1_CALC_STATS"
    },
    {
      "v": 11,
      "f": "t08b_20120101_000_1_ARCHIVE"
    },
    {
      "v": 12,
      "f": "t08b_20120101_001_1_ARCHIVE"
    },
    {
      "v": 13,
      "f": "t08b_20120101_002_1_ARCHIVE"
    },
    {
      "v": 14,
      "f": "t08b_20120101_003_1_ARCHIVE"
    }
  ]

  act(() => {
    render(<Router><ExperimentContext.Provider value={{ experiment: {experiment}, loading: false }}><StatsContext.Provider value={{ getExperimentStatus: () => null, loading: false, clearStats: () => null, isError: false, errorMessage: "", totaldata: requestResult, ticksdata: ticks }}><StatsSearch/></StatsContext.Provider></ExperimentContext.Provider></Router>, container);
  });
  expect(container.textContent).toContain("Period: 2020-11-03 16:49:00 ~ 2020-11-03 18:49:00");

  const tree = renderer.create(<Router><ExperimentContext.Provider value={{ experiment: {experiment}, loading: false }}><StatsContext.Provider value={{ getExperimentStatus: () => null, statdata: result, loading: false, clearStats: () => null, isError: false, errorMessage: "", totaldata: requestResult, ticksdata: ticks }}><StatsSearch/></StatsContext.Provider></ExperimentContext.Provider></Router>).toJSON();
  expect(tree).toMatchSnapshot();
});