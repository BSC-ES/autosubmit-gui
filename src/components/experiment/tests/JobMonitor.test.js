import React from "react";
import { unmountComponentAtNode, render } from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { act } from "react-dom/test-utils";
import renderer from 'react-test-renderer';
import JobMonitor from "../JobMonitor";
import experimentContext from "../../context/experiment/experimentContext";

const experiment = {expid: "a2tl", db_historic_version: 14, owner: "wuruchi", totalJobs: 12};
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

it("JobMonitor renders with content", () => {
   
  act(() => {
    render(<JobMonitor experiment={experiment} getExperimentPkl={() => null} cleanPklData={() => null} pkltreechanges={null} experimentRunning={true} notificationTitleGraph={"Notification"} setNotificationTitleGraph={() => null} />, container);
  });


  expect(container.textContent).toContain("Monitoring jobs...");
  expect(container.innerHTML).toContain("web-notification");
  // const tree = renderer.create(<TreeNativeRep/>).toJSON();
  // expect(tree).toMatchSnapshot();

});

// Somewhat trivial - tests some validation
it("JobMonitor renders with no notification title", () => {
   
  act(() => {
    render(<JobMonitor experiment={null} getExperimentPkl={() => null} cleanPklData={() => null} pkltreechanges={null} experimentRunning={false} notificationTitleGraph={null} setNotificationTitleGraph={() => null} />, container);
  });

  // console.log(container.textContent);
  // console.log(container.innerHTML);
  expect(container.textContent).toContain("Monitoring jobs...");
  expect(container.innerHTML).not.toContain("web-notification");
  // const tree = renderer.create(<TreeNativeRep/>).toJSON();
  // expect(tree).toMatchSnapshot();

});