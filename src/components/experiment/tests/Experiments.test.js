import React from "react";
import { unmountComponentAtNode, render } from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { act } from "react-dom/test-utils";
import Experiments from "../Experiments";
import ExperimentContext from "../../context/experiment/experimentContext";
import AlertContext from "../../context/alert/alertContext";

let container = null;
// const experiment = {branch: "master", description: "Test", owner:"wuruchi", owner_id: 1226, hpc:"LOCAL", db_historic_version: 14, version:"3.11.0"};

const experiments = {
  "experiment": [
      {
          "completed": 0,
          "description": "TEST CASE MN3 auto-ecearth3 layer 2: ORCA1L75 (oce_nudg)",
          "hpc": "marenostrum3",
          "id": 1228,
          "name": "t012",
          "status": "NOT RUNNING",
          "total": 0,
          "user": "mcastril",
          "version": "3.7.3",
          "hidden": false,
      },
      {
          "completed": "NA",
          "description": "test1 auto-ml4aq",
          "hpc": "power9",
          "id": 4758,
          "name": "a2jp",
          "status": "NOT RUNNING",
          "total": "NA",
          "user": "mcastril",
          "version": "3.11.0-hotfix",
          "hidden": false,
      },
      {
          "completed": 0,
          "description": "SRun Vs Threads",
          "hpc": "marenostrum4",
          "id": 4852,
          "name": "a2lf",
          "status": "NOT RUNNING",
          "total": 19,
          "user": "mcastril",
          "version": "3.12.1b",
          "hidden": false,
      },
      {
          "completed": 243,
          "description": "Copy of a2k5 with vertical-horizontal wrappers",
          "hpc": "marenostrum4",
          "id": 4896,
          "name": "a2m3",
          "status": "NOT RUNNING",
          "total": 243,
          "user": "mcastril",
          "version": "3.13.0b0",
          "hidden": false,
      },
      {
          "completed": 51,
          "description": "Copy of a2k5",
          "hpc": "marenostrum4",
          "id": 5150,
          "name": "a2rj",
          "status": "NOT RUNNING",
          "total": 51,
          "user": "mcastril",
          "version": "3.12.1b0",
          "hidden": false,
      },
      {
          "completed": 4,
          "description": "Copy of t0bz to do memory debugging",
          "hpc": "marenostrum4",
          "id": 5248,
          "name": "a2tk",
          "status": "NOT RUNNING",
          "total": 8,
          "user": "mcastril",
          "version": "3.13.0b0",
          "hidden": false,
      },
      {
          "completed": 4,
          "description": "Copy of t0c6 to investigate ORCA025-standalone performance in EC-Earth3",
          "hpc": "marenostrum4",
          "id": 5331,
          "name": "a2vp",
          "status": "NOT RUNNING",
          "total": 5,
          "user": "mcastril",
          "version": "3.13.0b0",
          "hidden": false,
      },
      {
          "completed": 0,
          "description": "X11 test",
          "hpc": "marenostrum4",
          "id": 5405,
          "name": "a2wz",
          "status": "NOT RUNNING",
          "total": 1,
          "user": "mcastril",
          "version": "3.13.0b0",
          "hidden": false,
      },
      {
          "completed": 5,
          "description": "Copy of t0bz to check flags impact in performance",
          "hpc": "marenostrum4",
          "id": 5518,
          "name": "a2yp",
          "status": "NOT RUNNING",
          "total": 5,
          "user": "mcastril",
          "version": "3.13.0b0",
          "hidden": false,
      },
      {
          "completed": 9,
          "description": "Copy of t0gg to measure Intel MPI performance",
          "hpc": "marenostrum4",
          "id": 5688,
          "name": "a31t",
          "status": "NOT RUNNING",
          "total": 9,
          "user": "mcastril",
          "version": "3.13.0b0",
          "hidden": false,
      },
      {
          "completed": 9,
          "description": "Copy of t0gg to measure Intel MPI performance",
          "hpc": "marenostrum4",
          "id": 5689,
          "name": "a31u",
          "status": "NOT RUNNING",
          "total": 9,
          "user": "mcastril",
          "version": "3.13.0b0",
          "hidden": false,
      },
      {
          "completed": 9,
          "description": "Copy of t0gg to measure Open MPI performance",
          "hpc": "marenostrum4",
          "id": 5690,
          "name": "a31v",
          "status": "NOT RUNNING",
          "total": 9,
          "user": "mcastril",
          "version": "3.13.0b0",
          "hidden": false,
      },
      {
          "completed": 9,
          "description": "Copy of t0gg to measure Intel MPI performance",
          "hpc": "marenostrum4",
          "id": 5691,
          "name": "a31w",
          "status": "NOT RUNNING",
          "total": 9,
          "user": "mcastril",
          "version": "3.13.0b0",
          "hidden": false,
      },
      {
          "completed": 9,
          "description": "Copy of t0gg to measure Intel MPI performance",
          "hpc": "marenostrum4",
          "id": 5692,
          "name": "a31x",
          "status": "NOT RUNNING",
          "total": 9,
          "user": "mcastril",
          "version": "3.13.0b0",
          "hidden": false,
      },
      {
          "completed": 9,
          "description": "Copy of t0gg to measure Open MPI performance",
          "hpc": "marenostrum4",
          "id": 5693,
          "name": "a31y",
          "status": "NOT RUNNING",
          "total": 9,
          "user": "mcastril",
          "version": "3.13.0b0",
          "hidden": false,
      },
      {
          "completed": 4,
          "description": "Copy of a31t to measure Intel MPI performance with OFI",
          "hpc": "marenostrum4",
          "id": 5697,
          "name": "a322",
          "status": "NOT RUNNING",
          "total": 9,
          "user": "mcastril",
          "version": "3.13.0b0",
          "hidden": false,
      },
      {
          "completed": 4,
          "description": "Copy of a31t to check EC-Earth working with different number of cores",
          "hpc": "marenostrum4",
          "id": 5701,
          "name": "a325",
          "status": "NOT RUNNING",
          "total": 9,
          "user": "mcastril",
          "version": "3.13.0b0",
          "hidden": false,
      },
      {
          "completed": 32,
          "description": "Copy of a34m (t0go) experiment to analyse wrappers performance",
          "hpc": "marenostrum4",
          "id": 5835,
          "name": "a34n",
          "status": "NOT RUNNING",
          "total": 147,
          "user": "mcastril",
          "version": "3.12.0",
          "hidden": false,
      },
      {
          "completed": 0,
          "description": "Experiment to start debugging Auto-NEMO",
          "hpc": "marenostrum4",
          "id": 5976,
          "name": "a37h",
          "status": "NOT RUNNING",
          "total": 21,
          "user": "mcastril",
          "version": "3.13.0b0",
          "hidden": false,
      }
  ]
};
const considered = [];
experiments.experiment.map(item => considered.push(item.name));
//console.log(considered);

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

it("Experiments renders with content", () => {
  
  act(() => {
    render(<Router><ExperimentContext.Provider value={{ experiments: experiments.experiment, experimentsInPage: experiments.experiment, searchExperiments: () => null, getCurrentRunning: () => null, experimentRunning: true, getSummaries: () => null, clearExperiments: () => null, loading: false, getExperimentSummary: () => null, summaries: new Map(), loadingSummary: new Map(), numberPages: 1, currentPage: 1, setCurrentPage: () => null, setPaginatedResult: () => null }}>
          <AlertContext.Provider 
          value={{ setAlert: () => null }}>
            <Experiments />
          </AlertContext.Provider>
      </ExperimentContext.Provider></Router>, container);
  });
  considered.forEach(item => expect(container.textContent).toContain(item));
  //console.log(container.innerHTML);
  // console.log(container.textContent);
  // expect(container.innerHTML).toContain("Search");
  // expect(container.innerHTML).toContain("Active Exps");
});