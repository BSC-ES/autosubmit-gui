import React from "react";
import { unmountComponentAtNode, render } from "react-dom";
import { act } from "react-dom/test-utils";
import renderer from 'react-test-renderer';
import TreeNativeRep from "../TreeNativeRep";
import ExperimentContext from "../../context/experiment/experimentContext";
import LighterNativeRep from "../LighterNativeRep";

let jobs_included = [];
const lightData = {
  "completed": 18,
  "error": false,
  "error_message": "",
  "failed": 0,
  "queuing": 0,
  "running": 1,
  "total": 19,
  "tree_view": [
      {
          "children": [],
          "data": "Empty",
          "refKey": "t0ie_LOCAL_SETUP",
          "title": "t0ie_LOCAL_SETUP <span class='badge' style='background-color: yellow'>#COMPLETED</span>"
      },
      {
          "children": [],
          "data": "Empty",
          "refKey": "t0ie_REMOTE_COMPILE",
          "title": "t0ie_REMOTE_COMPILE <span class='badge' style='background-color: yellow'>#COMPLETED</span>"
      },
      {
          "children": [],
          "data": "Empty",
          "refKey": "t0ie_20120101_000_2_PREPROCVAR",
          "title": "t0ie_20120101_000_2_PREPROCVAR <span class='badge' style='background-color: yellow'>#COMPLETED</span>"
      },
      {
          "children": [],
          "data": "Empty",
          "refKey": "t0ie_20120101_000_2_REDUCE",
          "title": "t0ie_20120101_000_2_REDUCE <span class='badge' style='background-color: yellow'>#COMPLETED</span>"
      },
      {
          "children": [],
          "data": "Empty",
          "refKey": "t0ie_20120101_000_2_ARCHIVE",
          "title": "t0ie_20120101_000_2_ARCHIVE <span class='badge' style='background-color: yellow'>#COMPLETED</span>"
      },
      {
          "children": [],
          "data": "Empty",
          "refKey": "t0ie_20120101_000_2_LOCAL_SEND_INITIAL",
          "title": "t0ie_20120101_000_2_LOCAL_SEND_INITIAL <span class='badge' style='background-color: yellow'>#COMPLETED</span>"
      },
      {
          "children": [],
          "data": "Empty",
          "refKey": "t0ie_20120101_000_1_ARCHIVE",
          "title": "t0ie_20120101_000_1_ARCHIVE <span class='badge' style='background-color: yellow'>#COMPLETED</span>"
      },
      {
          "children": [],
          "data": "Empty",
          "refKey": "t0ie_20120101_000_1_PREPROCVAR",
          "title": "t0ie_20120101_000_1_PREPROCVAR <span class='badge' style='background-color: yellow'>#COMPLETED</span>"
      },
      {
          "children": [],
          "data": "Empty",
          "refKey": "t0ie_LOCAL_SEND_SOURCE",
          "title": "t0ie_LOCAL_SEND_SOURCE <span class='badge' style='background-color: yellow'>#COMPLETED</span>"
      },
      {
          "children": [],
          "data": "Empty",
          "refKey": "t0ie_20120101_000_1_CLEAN",
          "title": "t0ie_20120101_000_1_CLEAN <span class='badge' style='background-color: yellow'>#COMPLETED</span>"
      },
      {
          "children": [],
          "data": "Empty",
          "refKey": "t0ie_20120101_2_ARCHIVE_REDUCE",
          "title": "t0ie_20120101_2_ARCHIVE_REDUCE <span class='badge' style='background-color: yellow'>#COMPLETED</span>"
      },
      {
          "children": [],
          "data": "Empty",
          "refKey": "t0ie_LOCAL_SEND_STATIC",
          "title": "t0ie_LOCAL_SEND_STATIC <span class='badge' style='background-color: yellow'>#COMPLETED</span>"
      },
      {
          "children": [],
          "data": "Empty",
          "refKey": "t0ie_20120101_000_1_LOCAL_SEND_INITIAL",
          "title": "t0ie_20120101_000_1_LOCAL_SEND_INITIAL <span class='badge' style='background-color: yellow'>#COMPLETED</span>"
      },
      {
          "children": [],
          "data": "Empty",
          "refKey": "t0ie_20120101_1_ARCHIVE_REDUCE",
          "title": "t0ie_20120101_1_ARCHIVE_REDUCE <span class='badge' style='background-color: yellow'>#COMPLETED</span>"
      },
      {
          "children": [],
          "data": "Empty",
          "refKey": "t0ie_20120101_000_2_CLEAN",
          "title": "t0ie_20120101_000_2_CLEAN <span class='badge' style='background-color: yellow'>#COMPLETED</span>"
      },
      {
          "children": [],
          "data": "Empty",
          "refKey": "t0ie_PREPROCFIX",
          "title": "t0ie_PREPROCFIX <span class='badge' style='background-color: yellow'>#COMPLETED</span>"
      },
      {
          "children": [],
          "data": "Empty",
          "refKey": "t0ie_20120101_000_2_SIM",
          "title": "t0ie_20120101_000_2_SIM <span class='badge' style='background-color: yellow'>#COMPLETED</span>"
      },
      {
          "children": [],
          "data": "Empty",
          "refKey": "t0ie_20120101_000_1_SIM",
          "title": "t0ie_20120101_000_1_SIM <span class='badge' style='background-color: yellow'>#COMPLETED</span>"
      },
      {
          "children": [],
          "data": "Empty",
          "refKey": "t0ie_20120101_000_1_REDUCE",
          "title": "t0ie_20120101_000_1_REDUCE <span class='badge' style='background-color: yellow'>#COMPLETED</span>"
      }
  ],
  "view_data": [
      {
          "err": "/t0ie_LOCAL_SETUP.20201109110038.err",
          "name": "t0ie_LOCAL_SETUP",
          "out": "/t0ie_LOCAL_SETUP.20201109110038.out",
          "path_log": "/esarchive/autosubmit/t0ie/tmp/LOG_t0ie"
      },
      {
          "err": "/t0ie_REMOTE_COMPILE.20201109110038.err",
          "name": "t0ie_REMOTE_COMPILE",
          "out": "/t0ie_REMOTE_COMPILE.20201109110038.out",
          "path_log": "/esarchive/autosubmit/t0ie/tmp/LOG_t0ie"
      },
      {
          "err": "/t0ie_20120101_000_2_PREPROCVAR.20201109110038.err",
          "name": "t0ie_20120101_000_2_PREPROCVAR",
          "out": "/t0ie_20120101_000_2_PREPROCVAR.20201109110038.out",
          "path_log": "/esarchive/autosubmit/t0ie/tmp/LOG_t0ie"
      },
      {
          "err": "/t0ie_20120101_000_2_REDUCE.20201109110038.err",
          "name": "t0ie_20120101_000_2_REDUCE",
          "out": "/t0ie_20120101_000_2_REDUCE.20201109110038.out",
          "path_log": "/esarchive/autosubmit/t0ie/tmp/LOG_t0ie"
      },
      {
          "err": "/t0ie_20120101_000_2_ARCHIVE.20201109110038.err",
          "name": "t0ie_20120101_000_2_ARCHIVE",
          "out": "/t0ie_20120101_000_2_ARCHIVE.20201109110038.out",
          "path_log": "/esarchive/autosubmit/t0ie/tmp/LOG_t0ie"
      },
      {
          "err": "/t0ie_20120101_000_2_LOCAL_SEND_INITIAL.20201109110038.err",
          "name": "t0ie_20120101_000_2_LOCAL_SEND_INITIAL",
          "out": "/t0ie_20120101_000_2_LOCAL_SEND_INITIAL.20201109110038.out",
          "path_log": "/esarchive/autosubmit/t0ie/tmp/LOG_t0ie"
      },
      {
          "err": "/t0ie_20120101_000_1_ARCHIVE.20201109110038.err",
          "name": "t0ie_20120101_000_1_ARCHIVE",
          "out": "/t0ie_20120101_000_1_ARCHIVE.20201109110038.out",
          "path_log": "/esarchive/autosubmit/t0ie/tmp/LOG_t0ie"
      },
      {
          "err": "/t0ie_20120101_000_1_PREPROCVAR.20201109110038.err",
          "name": "t0ie_20120101_000_1_PREPROCVAR",
          "out": "/t0ie_20120101_000_1_PREPROCVAR.20201109110038.out",
          "path_log": "/esarchive/autosubmit/t0ie/tmp/LOG_t0ie"
      },
      {
          "err": "/t0ie_LOCAL_SEND_SOURCE.20201109110038.err",
          "name": "t0ie_LOCAL_SEND_SOURCE",
          "out": "/t0ie_LOCAL_SEND_SOURCE.20201109110038.out",
          "path_log": "/esarchive/autosubmit/t0ie/tmp/LOG_t0ie"
      },
      {
          "err": "/t0ie_20120101_000_1_CLEAN.20201109110038.err",
          "name": "t0ie_20120101_000_1_CLEAN",
          "out": "/t0ie_20120101_000_1_CLEAN.20201109110038.out",
          "path_log": "/esarchive/autosubmit/t0ie/tmp/LOG_t0ie"
      },
      {
          "err": "/t0ie_20120101_2_ARCHIVE_REDUCE.20201109110038.err",
          "name": "t0ie_20120101_2_ARCHIVE_REDUCE",
          "out": "/t0ie_20120101_2_ARCHIVE_REDUCE.20201109110038.out",
          "path_log": "/esarchive/autosubmit/t0ie/tmp/LOG_t0ie"
      },
      {
          "err": "/t0ie_LOCAL_SEND_STATIC.20201109110038.err",
          "name": "t0ie_LOCAL_SEND_STATIC",
          "out": "/t0ie_LOCAL_SEND_STATIC.20201109110038.out",
          "path_log": "/esarchive/autosubmit/t0ie/tmp/LOG_t0ie"
      },
      {
          "err": "/t0ie_20120101_000_1_LOCAL_SEND_INITIAL.20201109110038.err",
          "name": "t0ie_20120101_000_1_LOCAL_SEND_INITIAL",
          "out": "/t0ie_20120101_000_1_LOCAL_SEND_INITIAL.20201109110038.out",
          "path_log": "/esarchive/autosubmit/t0ie/tmp/LOG_t0ie"
      },
      {
          "err": "/t0ie_20120101_1_ARCHIVE_REDUCE.20201109110038.err",
          "name": "t0ie_20120101_1_ARCHIVE_REDUCE",
          "out": "/t0ie_20120101_1_ARCHIVE_REDUCE.20201109110038.out",
          "path_log": "/esarchive/autosubmit/t0ie/tmp/LOG_t0ie"
      },
      {
          "err": "/t0ie_20120101_000_2_CLEAN.20201109110038.err",
          "name": "t0ie_20120101_000_2_CLEAN",
          "out": "/t0ie_20120101_000_2_CLEAN.20201109110038.out",
          "path_log": "/esarchive/autosubmit/t0ie/tmp/LOG_t0ie"
      },
      {
          "err": "/t0ie_PREPROCFIX.20201109110038.err",
          "name": "t0ie_PREPROCFIX",
          "out": "/t0ie_PREPROCFIX.20201109110038.out",
          "path_log": "/esarchive/autosubmit/t0ie/tmp/LOG_t0ie"
      },
      {
          "err": "/t0ie_20120101_000_2_SIM.20201109110038.err",
          "name": "t0ie_20120101_000_2_SIM",
          "out": "/t0ie_20120101_000_2_SIM.20201109110038.out",
          "path_log": "/esarchive/autosubmit/t0ie/tmp/LOG_t0ie"
      },
      {
          "err": "/t0ie_20120101_000_1_SIM.20201109110038.err",
          "name": "t0ie_20120101_000_1_SIM",
          "out": "/t0ie_20120101_000_1_SIM.20201109110038.out",
          "path_log": "/esarchive/autosubmit/t0ie/tmp/LOG_t0ie"
      },
      {
          "err": "/t0ie_20120101_000_1_REDUCE.20201109110038.err",
          "name": "t0ie_20120101_000_1_REDUCE",
          "out": "/t0ie_20120101_000_1_REDUCE.20201109110038.out",
          "path_log": "/esarchive/autosubmit/t0ie/tmp/LOG_t0ie"
      }
  ]
};

lightData.tree_view.map(item => jobs_included.push(item.refKey));

const experiment = {expid: "t0ie", db_historic_version: 14, owner: "wuruchi" };
let treeRep = null;

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

it("Lighter Representation renders with content", () => {
   
  act(() => {
    render(<LighterNativeRep data={lightData} loadingView={false} setLighterFancyTree={(obj) => treeRep = obj} cleanLoadingLighterView={() => null} />, container);
  });
  
  // console.log(treeRep);
  // console.log(container.innerHTML);
  // console.log(container.textContent)
  jobs_included.forEach(item => expect(container.textContent).toContain(item));

});

it("Lighter Representation matches snapshot", () => {


  const tree = renderer.create(<ExperimentContext.Provider value={{expectedLoadingTreeTime:() => 10}}><LighterNativeRep data={lightData} loadingView={false} setLighterFancyTree={(obj) => treeRep = obj} cleanLoadingLighterView={() => null} /></ExperimentContext.Provider> ).toJSON();

  expect(tree).toMatchSnapshot();

});

