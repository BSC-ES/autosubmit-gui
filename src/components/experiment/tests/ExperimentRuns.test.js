import React from "react";
import { unmountComponentAtNode, render } from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { act } from "react-dom/test-utils";
import renderer from 'react-test-renderer';
import ExperimentRuns from "../ExperimentRuns";
import ExperimentContext from "../../context/experiment/experimentContext";


let container = null;
const experiment = {branch: "master", description: "Test", owner:"wuruchi", owner_id: 1226, hpc:"LOCAL", db_historic_version: 14, version:"3.11.0"};

const runs = {
  "error": false,
  "error_message": "",
  "runs": [
      {
          "chunk_size": 1,
          "chunk_unit": "day",
          "completed": 2,
          "created": "2020-11-04-18:30:11",
          "failed": 0,
          "finish": null,
          "queuing": 2,
          "run_id": 47,
          "running": 0,
          "submitted": 0,
          "suspended": 0,
          "total": 144
      },
      {
          "chunk_size": 1,
          "chunk_unit": "day",
          "completed": 4,
          "created": "2020-11-04-18:26:19",
          "failed": 0,
          "finish": null,
          "queuing": 2,
          "run_id": 46,
          "running": 0,
          "submitted": 0,
          "suspended": 0,
          "total": 252
      },
      {
          "chunk_size": 1,
          "chunk_unit": "day",
          "completed": 0,
          "created": "2020-11-04-18:23:04",
          "failed": 0,
          "finish": null,
          "queuing": 2,
          "run_id": 45,
          "running": 8,
          "submitted": 0,
          "suspended": 0,
          "total": 468
      },
      {
          "chunk_size": 1,
          "chunk_unit": "day",
          "completed": 10,
          "created": "2020-11-04-17:19:21",
          "failed": 0,
          "finish": null,
          "queuing": 0,
          "run_id": 44,
          "running": 0,
          "submitted": 0,
          "suspended": 0,
          "total": 468
      },
      {
          "chunk_size": 1,
          "chunk_unit": "day",
          "completed": 24,
          "created": "2020-11-02-15:24:57",
          "failed": 0,
          "finish": null,
          "queuing": 1,
          "run_id": 43,
          "running": 2,
          "submitted": 0,
          "suspended": 4,
          "total": 252
      },
      {
          "chunk_size": 1,
          "chunk_unit": "day",
          "completed": 5,
          "created": "2020-11-02-15:18:16",
          "failed": 0,
          "finish": null,
          "queuing": 1,
          "run_id": 42,
          "running": 0,
          "submitted": 4,
          "suspended": 0,
          "total": 252
      },
      {
          "chunk_size": 1,
          "chunk_unit": "day",
          "completed": 0,
          "created": "2020-10-29-10:01:07",
          "failed": 0,
          "finish": null,
          "queuing": 0,
          "run_id": 41,
          "running": 0,
          "submitted": 0,
          "suspended": 0,
          "total": 468
      },
      {
          "chunk_size": 1,
          "chunk_unit": "day",
          "completed": 0,
          "created": "2020-10-29-09:48:07",
          "failed": 0,
          "finish": null,
          "queuing": 0,
          "run_id": 40,
          "running": 0,
          "submitted": 0,
          "suspended": 0,
          "total": 468
      },
      {
          "chunk_size": 1,
          "chunk_unit": "day",
          "completed": 0,
          "created": "2020-10-29-09:46:37",
          "failed": 0,
          "finish": null,
          "queuing": 0,
          "run_id": 39,
          "running": 0,
          "submitted": 0,
          "suspended": 0,
          "total": 468
      },
      {
          "chunk_size": 1,
          "chunk_unit": "day",
          "completed": 0,
          "created": "2020-10-29-09:45:25",
          "failed": 0,
          "finish": null,
          "queuing": 0,
          "run_id": 38,
          "running": 0,
          "submitted": 0,
          "suspended": 0,
          "total": 468
      },
      {
          "chunk_size": 1,
          "chunk_unit": "day",
          "completed": 0,
          "created": "2020-10-29-09:44:56",
          "failed": 0,
          "finish": null,
          "queuing": 0,
          "run_id": 37,
          "running": 0,
          "submitted": 0,
          "suspended": 0,
          "total": 468
      },
      {
          "chunk_size": 1,
          "chunk_unit": "day",
          "completed": 0,
          "created": "2020-10-29-09:43:22",
          "failed": 0,
          "finish": null,
          "queuing": 0,
          "run_id": 36,
          "running": 0,
          "submitted": 0,
          "suspended": 0,
          "total": 468
      },
      {
          "chunk_size": 1,
          "chunk_unit": "day",
          "completed": 0,
          "created": "2020-10-29-09:40:07",
          "failed": 0,
          "finish": null,
          "queuing": 0,
          "run_id": 35,
          "running": 0,
          "submitted": 0,
          "suspended": 0,
          "total": 468
      },
      {
          "chunk_size": 1,
          "chunk_unit": "day",
          "completed": 0,
          "created": "2020-10-29-09:39:20",
          "failed": 0,
          "finish": null,
          "queuing": 0,
          "run_id": 34,
          "running": 0,
          "submitted": 0,
          "suspended": 0,
          "total": 468
      },
      {
          "chunk_size": 1,
          "chunk_unit": "day",
          "completed": 0,
          "created": "2020-10-29-09:37:29",
          "failed": 0,
          "finish": null,
          "queuing": 0,
          "run_id": 33,
          "running": 0,
          "submitted": 0,
          "suspended": 0,
          "total": 468
      },
      {
          "chunk_size": 1,
          "chunk_unit": "day",
          "completed": 33,
          "created": "2020-10-28-09:46:43",
          "failed": 0,
          "finish": null,
          "queuing": 1,
          "run_id": 32,
          "running": 0,
          "submitted": 4,
          "suspended": 0,
          "total": 252
      },
      {
          "chunk_size": 1,
          "chunk_unit": "day",
          "completed": 2,
          "created": "2020-10-15-13:36:16",
          "failed": 0,
          "finish": "2020-10-15-13:50:09",
          "queuing": 0,
          "run_id": 31,
          "running": 0,
          "submitted": 0,
          "suspended": 0,
          "total": 108
      },
      {
          "chunk_size": 1,
          "chunk_unit": "day",
          "completed": 166,
          "created": "2020-10-08-13:55:54",
          "failed": 0,
          "finish": null,
          "queuing": 8,
          "run_id": 30,
          "running": 0,
          "submitted": 8,
          "suspended": 0,
          "total": 468
      },
      {
          "chunk_size": 0,
          "chunk_unit": "NA",
          "completed": 0,
          "created": "2020-10-08-13:55:54",
          "failed": 0,
          "finish": null,
          "queuing": 0,
          "run_id": 29,
          "running": 0,
          "submitted": 0,
          "suspended": 0,
          "total": 0
      }
  ]
}

const runs_detail = [];
runs.runs.map(item => runs_detail.push(item.created));

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
  
  act(() => {
    render(<Router><ExperimentContext.Provider value={{ experiment: experiment, getExperimentRuns: () => null, experimentRuns: runs }}>
        <ExperimentRuns />
      </ExperimentContext.Provider></Router>, container);
  });
  //console.log(container.innerHTML);
  // Contains all the requested runs.
  runs_detail.forEach(item => expect(container.textContent).toContain(item));
  
  //expect(container.innerHTML).toContain("Refresh");
});