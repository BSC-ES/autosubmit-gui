import React from "react";
import { unmountComponentAtNode, render } from "react-dom";
import { act } from "react-dom/test-utils";
import Navigator from "../Navigator";
import GraphContext from "../../context/graph/graphContext";


let container = null;
// const experiment = {branch: "master", description: "Test", owner:"wuruchi", owner_id: 1226, hpc:"LOCAL", db_historic_version: 14, version:"3.11.0"};


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

it("Navigator renders with content", () => {
  // startAutoUpdateRun: false
  act(() => {
    render(<GraphContext.Provider 
          value={{ navToLatest: () => null }}>
            <Navigator />
          </GraphContext.Provider>
        , container);
  });
  // console.log(container.innerHTML);
  // console.log(container.textContent);
  expect(container.innerHTML).toContain("Waiting");
  expect(container.innerHTML).toContain("Ready");
  expect(container.innerHTML).toContain("Prepared");
  expect(container.innerHTML).toContain("Submitted");
  expect(container.innerHTML).toContain("Queuing");
  expect(container.innerHTML).toContain("Running");
  expect(container.innerHTML).toContain("Completed");
  expect(container.innerHTML).toContain("Failed");
  expect(container.innerHTML).toContain("Suspended");
  expect(container.innerHTML).toContain("Unknown");
  expect(container.innerHTML).toContain("Hold");
});
