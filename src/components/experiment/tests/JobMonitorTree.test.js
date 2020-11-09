import React from "react";
import { unmountComponentAtNode, render } from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { act } from "react-dom/test-utils";
import renderer from 'react-test-renderer';
import JobMonitorTree from "../JobMonitorTree";
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

it("JobMonitorTree renders with content", () => {
   
  act(() => {
    render(<JobMonitorTree experiment={experiment} getExperimentTreePkl={() => null} cleanPklTreeData={() => null} pkltreechanges={null} experimentRunning={true} notificationTitleTree={"Notification"} setNotificationTitleTree={() => null} />, container);
  });


  expect(container.textContent).toContain("Monitoring jobs...");
  expect(container.innerHTML).toContain("web-notification");
  // const tree = renderer.create(<TreeNativeRep/>).toJSON();
  // expect(tree).toMatchSnapshot();

});

// Somewhat trivial
it("JobMonitorTree renders with no notification title", () => {
   
  act(() => {
    render(<JobMonitorTree experiment={null} getExperimentTreePkl={() => null} cleanPklTreeData={() => null} pkltreechanges={null} experimentRunning={false} notificationTitleTree={null} setNotificationTitleTree={() => null} />, container);
  });

  // console.log(container.textContent);
  // console.log(container.innerHTML);
  expect(container.textContent).toContain("Monitoring jobs...");
  expect(container.innerHTML).not.toContain("web-notification");
  // const tree = renderer.create(<TreeNativeRep/>).toJSON();
  // expect(tree).toMatchSnapshot();

});