import React from "react";
import { unmountComponentAtNode, render } from "react-dom";
import { act } from "react-dom/test-utils";
import experimentContext from "../../context/experiment/experimentContext";
import FileStatus from "../FileStatus";


//var treeRep = null;

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

it("FileStatus renders with content", () => {
  
  const esarchiveStatus = {
    "avg_bandwidth": 103.3125,
    "avg_latency": 2.1140279166666667,
    "bandwidth_warning": null,
    "current_bandwidth": 104.0,
    "current_latency": 1.78033,
    "datetime": "2020-11-26-11:41:09",
    "error": false,
    "error_message": "",
    "latency_warning": null,
    "reponse_time": 0.07644891738891602,
    "response_warning": null,
    "status": "ONLINE"
  };

  act(() => {
    render(<FileStatus getFileStatus={() => null} cleanFileStatusData={() => null} esarchiveStatus={esarchiveStatus} />, container);
  });


  //expect(container.innerHTML).toContain("badge-success");
  expect(container.innerHTML).toContain("esarchive");
  expect(container.textContent).toContain("MB/s")
  

});

it("FileStatus renders with content and warnings", () => {
  
  const esarchiveStatus = {
    "avg_bandwidth": 103.3125,
    "avg_latency": 2.1140279166666667,
    "bandwidth_warning": "warning bandwidth",
    "current_bandwidth": 104.0,
    "current_latency": 1.78033,
    "datetime": "2020-11-26-11:41:09",
    "error": false,
    "error_message": "",
    "latency_warning": "warning latency",
    "reponse_time": 0.07644891738891602,
    "response_warning": "response warning",
    "status": "ONLINE"
  };

  act(() => {
    render(<FileStatus getFileStatus={() => null} cleanFileStatusData={() => null} esarchiveStatus={esarchiveStatus} />, container);
  });

  //console.log(container.innerHTML);

  expect(container.innerHTML).toContain("warning bandwidth");
  expect(container.innerHTML).toContain("warning latency");
  expect(container.innerHTML).toContain("response warning");
  expect(container.textContent).toContain("esarchive WARNING!");

});


