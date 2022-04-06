import React from "react";
import { unmountComponentAtNode, render } from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { act } from "react-dom/test-utils";
import renderer from "react-test-renderer";
import TreeNativeRep from "../TreeNativeRep";
import ExperimentContext from "../../context/experiment/experimentContext";
import TreeContext from "../../context/tree/treeContext";
import TreeState from "../../context/tree/TreeState";
import GraphContext from "../../context/graph/graphContext";
import TreeJob from "../TreeJob";
import JobFilter from "../JobFilter";
import { updateTreeData, buildRunTitle } from "../../context/treeutils";

const treedata = {
  error: false,
  error_message: "None",
  jobs: [
    {
      children: 4,
      children_list: [
        "a2tl_LOCAL_SEND_SOURCE",
        "a2tl_20200511_000_1_LOCAL_SEND_INITIAL",
        "a2tl_LOCAL_SEND_STATIC",
        "a2tl_20200511_000_LOCAL_SEND_SPINUP",
      ],
      chunk: null,
      custom_directives: [],
      date: "",
      date_plus: "",
      err: "/esarchive/autosubmit/a2tl/tmp/LOG_a2tl/a2tl_LOCAL_SETUP.20200514124343.err",
      finish: "2020-05-14 10:50:44",
      id: "a2tl_LOCAL_SETUP",
      internal_id: "a2tl_LOCAL_SETUP",
      label: "a2tl_LOCAL_SETUP",
      member: null,
      minutes: 0,
      minutes_queue: 1,
      out: "/esarchive/autosubmit/a2tl/tmp/LOG_a2tl/a2tl_LOCAL_SETUP.20200514124343.out",
      parent_list: [],
      parents: 0,
      platform_name: "LOCAL",
      priority: 0,
      processors: "1",
      rm_id: null,
      section: "LOCAL_SETUP",
      start: "2020-05-14 10:50:44",
      status: "COMPLETED",
      status_code: 5,
      status_color: "yellow",
      submit: "2020-05-14 10:50:43",
      sync: false,
      title:
        "a2tl_LOCAL_SETUP <span class='badge' style='background-color: yellow'>#COMPLETED</span> ~ ( 0:00:01 ) + 0:00:00 <span class='badge' style='background-color:#80d4ff'>SOURCE</span>",
      tree_parents: [],
      wallclock: "",
      wrapper: null,
      wrapper_code: null,
    },
    {
      children: 1,
      children_list: ["a2tl_20200511_000_1_PREPROCVAR"],
      chunk: 1,
      custom_directives: [],
      date: "2020 05 11",
      date_plus: "2020 05 12",
      err: "/esarchive/autosubmit/a2tl/tmp/LOG_a2tl/a2tl_20200511_000_1_LOCAL_SEND_INITIAL.20200514124343.err",
      finish: "2020-05-14 12:24:12",
      id: "a2tl_20200511_000_1_LOCAL_SEND_INITIAL",
      internal_id: "a2tl_20200511_000_1_LOCAL_SEND_INITIAL",
      label: "a2tl_20200511_000_1_LOCAL_SEND_INITIAL",
      member: "000",
      minutes: 61,
      minutes_queue: 0,
      out: "/esarchive/autosubmit/a2tl/tmp/LOG_a2tl/a2tl_20200511_000_1_LOCAL_SEND_INITIAL.20200514124343.out",
      parent_list: ["a2tl_LOCAL_SETUP"],
      parents: 1,
      platform_name: "marenostrum_archive",
      priority: 1,
      processors: "1",
      rm_id: 28022,
      section: "LOCAL_SEND_INITIAL",
      start: "2020-05-14 12:23:11",
      status: "COMPLETED",
      status_code: 5,
      status_color: "yellow",
      submit: "2020-05-14 12:23:11",
      sync: false,
      title:
        "a2tl_20200511_000_1_LOCAL_SEND_INITIAL <span class='badge' style='background-color: yellow'>#COMPLETED</span> ~ ( 0:00:00 ) + 0:01:01",
      tree_parents: ["a2tl_20200511_000"],
      wallclock: "",
      wrapper: null,
      wrapper_code: null,
    },
    {
      children: 1,
      children_list: ["a2tl_20200511_000_1_SIM"],
      chunk: null,
      custom_directives: [],
      date: "2020 05 11",
      date_plus: "2020 05 11",
      err: "/esarchive/autosubmit/a2tl/tmp/LOG_a2tl/a2tl_20200511_000_LOCAL_SEND_SPINUP.20200514124343.err",
      finish: "2020-05-14 12:24:11",
      id: "a2tl_20200511_000_LOCAL_SEND_SPINUP",
      internal_id: "a2tl_20200511_000_LOCAL_SEND_SPINUP",
      label: "a2tl_20200511_000_LOCAL_SEND_SPINUP",
      member: "000",
      minutes: 60,
      minutes_queue: 0,
      out: "/esarchive/autosubmit/a2tl/tmp/LOG_a2tl/a2tl_20200511_000_LOCAL_SEND_SPINUP.20200514124343.out",
      parent_list: ["a2tl_LOCAL_SETUP"],
      parents: 1,
      platform_name: "marenostrum_archive",
      priority: 2,
      processors: "1",
      rm_id: 27722,
      section: "LOCAL_SEND_SPINUP",
      start: "2020-05-14 12:23:11",
      status: "COMPLETED",
      status_code: 5,
      status_color: "yellow",
      submit: "2020-05-14 12:23:11",
      sync: false,
      title:
        "a2tl_20200511_000_LOCAL_SEND_SPINUP <span class='badge' style='background-color: yellow'>#COMPLETED</span> ~ ( 0:00:00 ) + 0:01:00",
      tree_parents: ["a2tl_20200511_000"],
      wallclock: "",
      wrapper: null,
      wrapper_code: null,
    },
    {
      children: 1,
      children_list: ["a2tl_REMOTE_COMPILE"],
      chunk: null,
      custom_directives: [],
      date: "",
      date_plus: "",
      err: "/esarchive/autosubmit/a2tl/tmp/LOG_a2tl/a2tl_LOCAL_SEND_SOURCE.20200514124343.err",
      finish: "2020-05-14 10:52:56",
      id: "a2tl_LOCAL_SEND_SOURCE",
      internal_id: "a2tl_LOCAL_SEND_SOURCE",
      label: "a2tl_LOCAL_SEND_SOURCE",
      member: null,
      minutes: 119,
      minutes_queue: 0,
      out: "/esarchive/autosubmit/a2tl/tmp/LOG_a2tl/a2tl_LOCAL_SEND_SOURCE.20200514124343.out",
      parent_list: ["a2tl_LOCAL_SETUP"],
      parents: 1,
      platform_name: "marenostrum_archive",
      priority: 3,
      processors: "1",
      rm_id: null,
      section: "LOCAL_SEND_SOURCE",
      start: "2020-05-14 10:50:57",
      status: "COMPLETED",
      status_code: 5,
      status_color: "yellow",
      submit: "2020-05-14 10:50:57",
      sync: false,
      title:
        "a2tl_LOCAL_SEND_SOURCE <span class='badge' style='background-color: yellow'>#COMPLETED</span> ~ ( 0:00:00 ) + 0:01:59",
      tree_parents: [],
      wallclock: "",
      wrapper: null,
      wrapper_code: null,
    },
    {
      children: 1,
      children_list: ["a2tl_PREPROCFIX"],
      chunk: null,
      custom_directives: [],
      date: "",
      date_plus: "",
      err: "/esarchive/autosubmit/a2tl/tmp/LOG_a2tl/a2tl_LOCAL_SEND_STATIC.20200514124343.err",
      finish: "2020-05-14 10:50:56",
      id: "a2tl_LOCAL_SEND_STATIC",
      internal_id: "a2tl_LOCAL_SEND_STATIC",
      label: "a2tl_LOCAL_SEND_STATIC",
      member: null,
      minutes: 0,
      minutes_queue: 0,
      out: "/esarchive/autosubmit/a2tl/tmp/LOG_a2tl/a2tl_LOCAL_SEND_STATIC.20200514124343.out",
      parent_list: ["a2tl_LOCAL_SETUP"],
      parents: 1,
      platform_name: "marenostrum_archive",
      priority: 4,
      processors: "1",
      rm_id: null,
      section: "LOCAL_SEND_STATIC",
      start: "2020-05-14 10:50:56",
      status: "COMPLETED",
      status_code: 5,
      status_color: "yellow",
      submit: "2020-05-14 10:50:56",
      sync: false,
      title:
        "a2tl_LOCAL_SEND_STATIC <span class='badge' style='background-color: yellow'>#COMPLETED</span> ~ ( 0:00:00 ) + 0:00:00",
      tree_parents: [],
      wallclock: "",
      wrapper: null,
      wrapper_code: null,
    },
    {
      children: 1,
      children_list: ["a2tl_PREPROCFIX"],
      chunk: null,
      custom_directives: [],
      date: "",
      date_plus: "",
      err: "/esarchive/autosubmit/a2tl/tmp/LOG_a2tl/a2tl_REMOTE_COMPILE.20200514124343.err",
      finish: "2020-05-14 11:11:10",
      id: "a2tl_REMOTE_COMPILE",
      internal_id: "a2tl_REMOTE_COMPILE",
      label: "a2tl_REMOTE_COMPILE",
      member: null,
      minutes: 1057,
      minutes_queue: 23,
      out: "/esarchive/autosubmit/a2tl/tmp/LOG_a2tl/a2tl_REMOTE_COMPILE.20200514124343.out",
      parent_list: ["a2tl_LOCAL_SEND_SOURCE"],
      parents: 1,
      platform_name: null,
      priority: 5,
      processors: "1",
      rm_id: null,
      section: "REMOTE_COMPILE",
      start: "2020-05-14 10:53:33",
      status: "COMPLETED",
      status_code: 5,
      status_color: "yellow",
      submit: "2020-05-14 10:53:10",
      sync: false,
      title:
        "a2tl_REMOTE_COMPILE <span class='badge' style='background-color: yellow'>#COMPLETED</span> ~ ( 0:00:23 ) + 0:17:37",
      tree_parents: [],
      wallclock: "00:50",
      wrapper: null,
      wrapper_code: null,
    },
    {
      children: 1,
      children_list: ["a2tl_20200511_000_1_PREPROCVAR"],
      chunk: null,
      custom_directives: [],
      date: "",
      date_plus: "",
      err: "/esarchive/autosubmit/a2tl/tmp/LOG_a2tl/a2tl_PREPROCFIX.20200514124343.err",
      finish: "2020-05-14 11:25:34",
      id: "a2tl_PREPROCFIX",
      internal_id: "a2tl_PREPROCFIX",
      label: "a2tl_PREPROCFIX",
      member: null,
      minutes: 750,
      minutes_queue: 95,
      out: "/esarchive/autosubmit/a2tl/tmp/LOG_a2tl/a2tl_PREPROCFIX.20200514124343.out",
      parent_list: ["a2tl_REMOTE_COMPILE", "a2tl_LOCAL_SEND_STATIC"],
      parents: 2,
      platform_name: null,
      priority: 6,
      processors: "1",
      rm_id: null,
      section: "PREPROCFIX",
      start: "2020-05-14 11:13:04",
      status: "COMPLETED",
      status_code: 5,
      status_color: "yellow",
      submit: "2020-05-14 11:11:29",
      sync: false,
      title:
        "a2tl_PREPROCFIX <span class='badge' style='background-color: yellow'>#COMPLETED</span> ~ ( 0:01:35 ) + 0:12:30",
      tree_parents: [],
      wallclock: "00:30",
      wrapper: null,
      wrapper_code: null,
    },
    {
      children: 1,
      children_list: ["a2tl_20200511_000_1_SIM"],
      chunk: 1,
      custom_directives: [],
      date: "2020 05 11",
      date_plus: "2020 05 12",
      err: "/esarchive/autosubmit/a2tl/tmp/LOG_a2tl/a2tl_20200511_000_1_PREPROCVAR.20200514124343.err",
      finish: "2020-05-14 12:27:48",
      id: "a2tl_20200511_000_1_PREPROCVAR",
      internal_id: "a2tl_20200511_000_1_PREPROCVAR",
      label: "a2tl_20200511_000_1_PREPROCVAR",
      member: "000",
      minutes: 197,
      minutes_queue: 4,
      out: "/esarchive/autosubmit/a2tl/tmp/LOG_a2tl/a2tl_20200511_000_1_PREPROCVAR.20200514124343.out",
      parent_list: [
        "a2tl_20200511_000_1_LOCAL_SEND_INITIAL",
        "a2tl_PREPROCFIX",
      ],
      parents: 2,
      platform_name: null,
      priority: 7,
      processors: "8",
      rm_id: 10114743,
      section: "PREPROCVAR",
      start: "2020-05-14 12:24:31",
      status: "COMPLETED",
      status_code: 5,
      status_color: "yellow",
      submit: "2020-05-14 12:24:27",
      sync: false,
      title:
        "a2tl_20200511_000_1_PREPROCVAR <span class='badge' style='background-color: yellow'>#COMPLETED</span> ~ ( 0:00:04 ) + 0:03:17",
      tree_parents: ["a2tl_20200511_000"],
      wallclock: "00:30",
      wrapper: null,
      wrapper_code: null,
    },
    {
      children: 1,
      children_list: ["a2tl_20200511_000_1_REDUCE"],
      chunk: 1,
      custom_directives: [],
      date: "2020 05 11",
      date_plus: "2020 05 12",
      err: "/esarchive/autosubmit/a2tl/tmp/LOG_a2tl/a2tl_20200511_000_1_SIM.20200514124343.err",
      finish: "2020-05-14 13:04:53",
      id: "a2tl_20200511_000_1_SIM",
      internal_id: "a2tl_20200511_000_1_SIM",
      label: "a2tl_20200511_000_1_SIM",
      member: "000",
      minutes: 1241,
      minutes_queue: 24,
      out: "/esarchive/autosubmit/a2tl/tmp/LOG_a2tl/a2tl_20200511_000_1_SIM.20200514124343.out",
      parent_list: [
        "a2tl_20200511_000_1_PREPROCVAR",
        "a2tl_20200511_000_LOCAL_SEND_SPINUP",
      ],
      parents: 2,
      platform_name: null,
      priority: 8,
      processors: "260",
      rm_id: 10115060,
      section: "SIM",
      start: "2020-05-14 12:44:12",
      status: "FAILED",
      status_code: -1,
      status_color: "red",
      submit: "2020-05-14 12:43:48",
      sync: false,
      title:
        "a2tl_20200511_000_1_SIM <span class='badge' style='background-color: red'>#FAILED</span> ~ ( 0:00:24 ) + 0:20:41",
      tree_parents: ["a2tl_20200511_000"],
      wallclock: "02:00",
      wrapper: null,
      wrapper_code: null,
    },
    {
      children: 1,
      children_list: ["a2tl_20200511_000_1_ARCHIVE"],
      chunk: 1,
      custom_directives: [],
      date: "2020 05 11",
      date_plus: "2020 05 12",
      err: "/esarchive/autosubmit/a2tl/tmp/LOG_a2tl/a2tl_20200511_000_1_REDUCE.20200514124343.err",
      finish: null,
      id: "a2tl_20200511_000_1_REDUCE",
      internal_id: "a2tl_20200511_000_1_REDUCE",
      label: "a2tl_20200511_000_1_REDUCE",
      member: "000",
      minutes: 0,
      minutes_queue: 0,
      out: "/esarchive/autosubmit/a2tl/tmp/LOG_a2tl/a2tl_20200511_000_1_REDUCE.20200514124343.out",
      parent_list: ["a2tl_20200511_000_1_SIM"],
      parents: 1,
      platform_name: "nord3",
      priority: 9,
      processors: "1",
      rm_id: null,
      section: "REDUCE",
      start: null,
      status: "WAITING",
      status_code: 0,
      status_color: "gray",
      submit: null,
      sync: false,
      title:
        "a2tl_20200511_000_1_REDUCE <span class='badge' style='background-color: gray'>#WAITING</span>",
      tree_parents: ["a2tl_20200511_000"],
      wallclock: "01:00",
      wrapper: null,
      wrapper_code: null,
    },
    {
      children: 1,
      children_list: ["a2tl_20200511_000_1_CLEAN"],
      chunk: 1,
      custom_directives: [],
      date: "2020 05 11",
      date_plus: "2020 05 12",
      err: "/esarchive/autosubmit/a2tl/tmp/LOG_a2tl/a2tl_20200511_000_1_ARCHIVE.20200514124343.err",
      finish: null,
      id: "a2tl_20200511_000_1_ARCHIVE",
      internal_id: "a2tl_20200511_000_1_ARCHIVE",
      label: "a2tl_20200511_000_1_ARCHIVE",
      member: "000",
      minutes: 0,
      minutes_queue: 0,
      out: "/esarchive/autosubmit/a2tl/tmp/LOG_a2tl/a2tl_20200511_000_1_ARCHIVE.20200514124343.out",
      parent_list: ["a2tl_20200511_000_1_REDUCE"],
      parents: 1,
      platform_name: "marenostrum_archive",
      priority: 10,
      processors: "1",
      rm_id: null,
      section: "ARCHIVE",
      start: null,
      status: "WAITING",
      status_code: 0,
      status_color: "gray",
      submit: null,
      sync: false,
      title:
        "a2tl_20200511_000_1_ARCHIVE <span class='badge' style='background-color: gray'>#WAITING</span>",
      tree_parents: ["a2tl_20200511_000"],
      wallclock: "00:10",
      wrapper: null,
      wrapper_code: null,
    },
    {
      children: 0,
      children_list: [],
      chunk: 1,
      custom_directives: [],
      date: "2020 05 11",
      date_plus: "2020 05 12",
      err: "/esarchive/autosubmit/a2tl/tmp/LOG_a2tl/a2tl_20200511_000_1_CLEAN.20200514124343.err",
      finish: null,
      id: "a2tl_20200511_000_1_CLEAN",
      internal_id: "a2tl_20200511_000_1_CLEAN",
      label: "a2tl_20200511_000_1_CLEAN",
      member: "000",
      minutes: 0,
      minutes_queue: 0,
      out: "/esarchive/autosubmit/a2tl/tmp/LOG_a2tl/a2tl_20200511_000_1_CLEAN.20200514124343.out",
      parent_list: ["a2tl_20200511_000_1_ARCHIVE"],
      parents: 1,
      platform_name: "marenostrum_archive",
      priority: 11,
      processors: "1",
      rm_id: null,
      section: "CLEAN",
      start: null,
      status: "WAITING",
      status_code: 0,
      status_color: "gray",
      submit: null,
      sync: false,
      title:
        "a2tl_20200511_000_1_CLEAN <span class='badge' style='background-color: gray'>#WAITING</span> <span class='badge' style='background-color:#99ff66'>TARGET</span>",
      tree_parents: ["a2tl_20200511_000"],
      wallclock: "00:10",
      wrapper: null,
      wrapper_code: null,
    },
  ],
  pkl_timestamp: 10000000,
  reference: {
    a2tl_20200511_000: {
      completed: 3,
      failed: 1,
      queuing: 0,
      running: 0,
      total: 7,
    },
    check_mark:
      " <span class='badge' style='background-color:#4dffa6'>&#10004;</span>",
    chunk_size: 1,
    chunk_unit: "day",
    completed_tag:
      " <span class='badge' style='background-color:%B'> %C / %T COMPLETED</span>",
    failed_tag:
      " <span class='badge' style='background-color:red'>%F FAILED</span>",
    packages: [],
    queuing_tag:
      " <span class='badge' style='background-color:pink'>%Q QUEUING</span>",
    running_tag:
      " <span class='badge' style='background-color:green; color:white'>%R RUNNING</span>",
  },
  total: 12,
  tree: [
    {
      children: [
        {
          children: [
            {
              children: [],
              data: "Empty",
              refKey: "a2tl_20200511_000_LOCAL_SEND_SPINUP",
              title:
                "a2tl_20200511_000_LOCAL_SEND_SPINUP <span class='badge' style='background-color: yellow'>#COMPLETED</span> ~ ( 0:00:00 ) + 0:01:00",
            },
            {
              children: [],
              data: "Empty",
              refKey: "a2tl_20200511_000_1_LOCAL_SEND_INITIAL",
              title:
                "a2tl_20200511_000_1_LOCAL_SEND_INITIAL <span class='badge' style='background-color: yellow'>#COMPLETED</span> ~ ( 0:00:00 ) + 0:01:01",
            },
            {
              children: [],
              data: "Empty",
              refKey: "a2tl_20200511_000_1_PREPROCVAR",
              title:
                "a2tl_20200511_000_1_PREPROCVAR <span class='badge' style='background-color: yellow'>#COMPLETED</span> ~ ( 0:00:04 ) + 0:03:17",
            },
            {
              children: [],
              data: "Empty",
              refKey: "a2tl_20200511_000_1_SIM",
              title:
                "a2tl_20200511_000_1_SIM <span class='badge' style='background-color: red'>#FAILED</span> ~ ( 0:00:24 ) + 0:20:41",
            },
            {
              children: [],
              data: "Empty",
              refKey: "a2tl_20200511_000_1_REDUCE",
              title:
                "a2tl_20200511_000_1_REDUCE <span class='badge' style='background-color: gray'>#WAITING</span>",
            },
            {
              children: [],
              data: "Empty",
              refKey: "a2tl_20200511_000_1_ARCHIVE",
              title:
                "a2tl_20200511_000_1_ARCHIVE <span class='badge' style='background-color: gray'>#WAITING</span>",
            },
            {
              children: [],
              data: "Empty",
              refKey: "a2tl_20200511_000_1_CLEAN",
              title:
                "a2tl_20200511_000_1_CLEAN <span class='badge' style='background-color: gray'>#WAITING</span> <span class='badge' style='background-color:#99ff66'>TARGET</span>",
            },
          ],
          data: "Empty",
          expanded: true,
          folder: true,
          refKey: "a2tl_20200511_000",
          title:
            "a2tl_20200511_000 <span class='badge' style='background-color:#ffffb3'>3 / 7 COMPLETED</span> <span class='badge' style='background-color:red'>1 FAILED</span>",
        },
      ],
      data: "Empty",
      expanded: true,
      folder: true,
      refKey: "a2tl_20200511",
      title: "a2tl_20200511",
    },
    {
      children: [
        {
          children: [],
          data: "Empty",
          refKey: "a2tl_LOCAL_SETUP",
          title:
            "a2tl_LOCAL_SETUP <span class='badge' style='background-color: yellow'>#COMPLETED</span> ~ ( 0:00:01 ) + 0:00:00 <span class='badge' style='background-color:#80d4ff'>SOURCE</span>",
        },
        {
          children: [],
          data: "Empty",
          refKey: "a2tl_LOCAL_SEND_SOURCE",
          title:
            "a2tl_LOCAL_SEND_SOURCE <span class='badge' style='background-color: yellow'>#COMPLETED</span> ~ ( 0:00:00 ) + 0:01:59",
        },
        {
          children: [],
          data: "Empty",
          refKey: "a2tl_LOCAL_SEND_STATIC",
          title:
            "a2tl_LOCAL_SEND_STATIC <span class='badge' style='background-color: yellow'>#COMPLETED</span> ~ ( 0:00:00 ) + 0:00:00",
        },
        {
          children: [],
          data: "Empty",
          refKey: "a2tl_REMOTE_COMPILE",
          title:
            "a2tl_REMOTE_COMPILE <span class='badge' style='background-color: yellow'>#COMPLETED</span> ~ ( 0:00:23 ) + 0:17:37",
        },
        {
          children: [],
          data: "Empty",
          refKey: "a2tl_PREPROCFIX",
          title:
            "a2tl_PREPROCFIX <span class='badge' style='background-color: yellow'>#COMPLETED</span> ~ ( 0:01:35 ) + 0:12:30",
        },
      ],
      data: "Empty",
      expanded: true,
      folder: true,
      refKey: "Keys",
      title: "Keys",
    },
  ],
};

const experiment = {
  expid: "a2tl",
  db_historic_version: 14,
  owner: "wuruchi",
  totalJobs: 12,
};
var treeRep = null;

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

it("Tree Representation renders with content", () => {
  act(() => {
    render(
      <TreeNativeRep
        treedata={treedata}
        treeSelectedNodes={null}
        loadingTree={false}
        cleanTreeData={() => null}
        setFancyTree={(tree) => (treeRep = tree)}
        updateSelectionTree={() => null}
        updateCurrentSelected={() => null}
        canSelect={false}
        totalJobs={null}
      />,
      container
    );
  });

  //console.log(treeRep);
  //console.log(container.textContent)
  expect(container.textContent).toContain("a2tl_LOCAL_SETUP");
  expect(container.textContent).toContain(
    "a2tl_20200511_000_1_LOCAL_SEND_INITIAL"
  );
  expect(container.textContent).toContain(
    "a2tl_20200511_000_LOCAL_SEND_SPINUP"
  );
  expect(container.textContent).toContain("a2tl_LOCAL_SEND_SOURCE");
  expect(container.textContent).toContain("a2tl_LOCAL_SEND_STATIC");
  expect(container.textContent).toContain("a2tl_REMOTE_COMPILE");
  expect(container.textContent).toContain("a2tl_PREPROCFIX");
  expect(container.textContent).toContain("a2tl_20200511_000_1_PREPROCVAR");
  expect(container.textContent).toContain("a2tl_20200511_000_1_SIM");
  // const tree = renderer.create(<TreeNativeRep/>).toJSON();
  // expect(tree).toMatchSnapshot();
});

it("Tree Representation loading matches snapshot", () => {
  const tree = renderer
    .create(
      <ExperimentContext.Provider value={{ expectedLoadingTreeTime: () => 10 }}>
        <TreeNativeRep
          treedata={treedata}
          loadingTree={true}
          cleanTreeData={() => null}
          setFancyTree={(tree) => (treeRep = tree)}
          updateSelectionTree={() => null}
          updateCurrentSelected={() => null}
          canSelect={false}
          totalJobs={null}
        />
      </ExperimentContext.Provider>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

// --- SelectionTreeNode.js ---

it("SelectionTreeNode renders from treedata", () => {
  const selectedTreeNode = { node: { refKey: "a2tl_20200511_000_1_REDUCE" } };
  act(() => {
    render(
      <ExperimentContext.Provider
        value={{
          experiment: experiment,
          jobHistoryLog: { path: "", joblog: [] },
        }}
      >
        <TreeContext.Provider
          value={{ selectedTreeNode: selectedTreeNode, treedata: treedata }}
        >
          <GraphContext.Provider
            value={{ selection: ["a2tl_20200511_000_1_REDUCE"] }}
          >
            <TreeJob />
          </GraphContext.Provider>
        </TreeContext.Provider>
      </ExperimentContext.Provider>,
      container
    );
  });

  expect(container.textContent).toContain("a2tl_20200511_000_1_REDUCE");
  expect(container.textContent).toContain("a2tl_20200511_000_1_SIM");
  expect(container.textContent).toContain("2020 05 11");
  expect(container.textContent).toContain("nord3");
});

// Testing treeutils.js functions
// GraphNativeRep provides a fancyTree object

it("Updated fancyTree shows new status of jobs", () => {
  const runData = [
    {
      chunk: 0,
      counter: 47,
      created: "2020-11-10-13:33:24",
      date: "",
      energy: "NA",
      finish: "2020-11-10-13:33:42",
      job_id: 11584,
      job_name: "a2tl_LOCAL_SETUP",
      member: "",
      ncpus: 1,
      nodes: 0,
      platform: "LOCAL",
      qos: "debug",
      queue_time: "0:00:18",
      queue_time_s: 18,
      run_time: "0:00:00",
      running_time_s: 0,
      section: "LOCAL_SETUP",
      start: "2020-11-10-13:33:42",
      status: "COMPLETED",
      status_code: 5,
      status_color: "yellow",
      submit: "2020-11-10-13:33:24",
      titletag: "( 0:00:18 ) + 0:00:00",
      wallclock: "",
    },
    {
      chunk: 1,
      counter: 47,
      created: "2020-11-10-13:33:43",
      date: "2012-01-01 00:00:00",
      energy: "NA",
      finish: "2020-11-10-13:36:50",
      job_id: 18668,
      job_name: "a2tl_20200511_000_1_LOCAL_SEND_INITIAL",
      member: "000",
      ncpus: 1,
      nodes: 0,
      platform: "marenostrum_archive",
      qos: "debug",
      queue_time: "0:00:27",
      queue_time_s: 27,
      run_time: "0:02:40",
      running_time_s: 160,
      section: "LOCAL_SEND_INITIAL",
      start: "2020-11-10-13:34:10",
      status: "COMPLETED",
      status_code: 5,
      status_color: "yellow",
      submit: "2020-11-10-13:33:43",
      titletag: "( 0:00:27 ) + 0:02:40",
      wallclock: "",
    },
    {
      chunk: 0,
      counter: 47,
      created: "2020-11-10-13:33:44",
      date: "",
      energy: "NA",
      finish: "2020-11-10-13:34:01",
      job_id: 19092,
      job_name: "a2tl_20200511_000_LOCAL_SEND_SPINUP",
      member: "",
      ncpus: 1,
      nodes: 0,
      platform: "marenostrum_archive",
      qos: "debug",
      queue_time: "0:00:16",
      queue_time_s: 16,
      run_time: "0:00:01",
      running_time_s: 1,
      section: "LOCAL_SEND_SPINUP",
      start: "2020-11-10-13:34:00",
      status: "COMPLETED",
      status_code: 5,
      status_color: "yellow",
      submit: "2020-11-10-13:33:44",
      titletag: "( 0:00:16 ) + 0:00:01",
      wallclock: "",
    },
    {
      chunk: 0,
      counter: 47,
      created: "2020-11-10-13:33:45",
      date: "",
      energy: "NA",
      finish: "2020-11-10-13:37:31",
      job_id: 19576,
      job_name: "a2tl_LOCAL_SEND_SOURCE",
      member: "",
      ncpus: 1,
      nodes: 0,
      platform: "marenostrum_archive",
      qos: "debug",
      queue_time: "0:00:13",
      queue_time_s: 13,
      run_time: "0:03:33",
      running_time_s: 213,
      section: "LOCAL_SEND_SOURCE",
      start: "2020-11-10-13:33:58",
      status: "FAILED",
      status_code: 5,
      status_color: "yellow",
      submit: "2020-11-10-13:33:45",
      titletag: "( 0:00:13 ) + 0:03:33",
      wallclock: "",
    },
    {
      chunk: 2,
      counter: 47,
      created: "2020-11-10-13:34:10",
      date: "2012-01-01 00:00:00",
      energy: "NA",
      finish: "2020-11-10-13:36:52",
      job_id: 21871,
      job_name: "a2tl_LOCAL_SEND_STATIC",
      member: "000",
      ncpus: 1,
      nodes: 0,
      platform: "marenostrum_archive",
      qos: "debug",
      queue_time: "0:00:17",
      queue_time_s: 17,
      run_time: "0:02:25",
      running_time_s: 145,
      section: "LOCAL_SEND_STATIC",
      start: "2020-11-10-13:34:27",
      status: "FAILED",
      status_code: 5,
      status_color: "yellow",
      submit: "2020-11-10-13:34:10",
      titletag: "( 0:00:17 ) + 0:02:25",
      wallclock: "",
    },
  ];

  const verifyData = new Map();
  runData.forEach((item) => {
    verifyData[item.job_name] = item.status;
  });

  act(() => {
    updateTreeData(runData, treedata, treeRep);
  });

  const dataObjects = new Map();
  // console.log(treedata.jobs);
  treedata.jobs.forEach((item) => {
    dataObjects[item.label] = item.status;
    //dataObjects.push({ label: item.label, status: item.status });
  });
  // Make sure status changed
  Object.keys(verifyData).forEach((item) => {
    expect(verifyData[item]).toBe(dataObjects[item]);
  });
  // console.log(Object.keys(treeRep.keyMap));
  const treeObjects = new Map();
  Object.keys(treeRep.keyMap).forEach(
    (item) =>
      (treeObjects[treeRep.keyMap[item].title.split(/[ ]+/)[0]] =
        treeRep.keyMap[item].title)
  );
  // console.log(treeObjects);
  // console.log(dataObjects);
  Object.keys(verifyData).forEach((item) => {
    expect(verifyData[item]).toBe(dataObjects[item]);
  });

  Object.keys(verifyData).forEach((item) => {
    expect(treeObjects[item]).toContain(verifyData[item]);
  });
});
