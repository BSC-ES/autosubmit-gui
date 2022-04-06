import TreeContentHandler from "./treeUpdate";
import "jquery.fancytree/dist/modules/jquery.fancytree.clones";
import "jquery.fancytree/dist/modules/jquery.fancytree.filter";
import "jquery.fancytree/dist/modules/jquery.fancytree.childcounter";
import "jquery.fancytree/dist/modules/jquery.fancytree.edit";
import "jquery.fancytree/dist/modules/jquery.fancytree.multi";
import { createTree } from "jquery.fancytree";
import { unmountComponentAtNode, render } from "react-dom";
import { act } from "react-dom/test-utils";
import data_a3ux from "./case_a3ux.json";
import data_a3ux_update from "./case_a3ux_update.json";
import data_a3ux_wrapper_1 from "./case_a3ux_update_wrapper.json";

let container = null;

beforeEach(() => {
  container = document.createElement("div");
  container.setAttribute("id", "tree");
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

test("Creates the Graph Representation object and performs a simple status update", () => {
  const { tree, reference, jobs } = data_a3ux;
  const currentTree = JSON.parse(JSON.stringify(tree));
  const currentReference = JSON.parse(JSON.stringify(reference));
  const currentJobs = JSON.parse(JSON.stringify(jobs));
  let treeRep;
  act(() => {
    treeRep = new createTree("#tree", {
      extensions: ["filter", "childcounter", "clones", "multi"],
      filter: {
        autoApply: true, // Re-apply last filter if lazy data is loaded
        autoExpand: true, // Expand all branches that contain matches while filtered
        counter: true, // Show a badge with number of matching child nodes near parent icons
        fuzzy: false, // Match single characters in order, e.g. 'fb' will match 'FooBar'
        hideExpandedCounter: true, // Hide counter badge if parent is expanded
        hideExpanders: false, // Hide expanders if all child nodes are hidden by filter
        highlight: false, // Highlight matches by wrapping inside <mark> tags
        leavesOnly: true, // Match end nodes only
        nodata: true, // Display a 'no data' status node if result is empty
        mode: "hide", // Grayout unmatched nodes (pass "hide" to remove unmatched node instead)
      },
      source: currentTree,
    });
  });

  expect(treeRep).not.toBeNull();

  let treeUpdater;
  let canUpdate;
  let processResult;
  act(() => {
    treeUpdater = new TreeContentHandler(
      currentJobs,
      currentReference,
      data_a3ux_update
    );
    canUpdate = treeUpdater.validate();
    if (canUpdate) {
      processResult = treeUpdater.processChanges(treeRep);
    }
  });
  const updatedJob = processResult.currentJobs.filter(
    (x) => x.id === "a3ux_REMOTE_SETUP"
  )[0];
  const completedJobNode = treeRep.getNodesByRef("a3ux_REMOTE_SETUP")[0];
  expect(updatedJob.status).toEqual("COMPLETED");
  expect(canUpdate).toBeTruthy();
  expect(processResult.changes.length).toBeGreaterThan(0);
  expect(processResult.changesSummarized.length).toBeGreaterThan(0);
  expect(processResult.currentJobs.length).toBe(9);
  expect(processResult.changes).toContain("a3ux_REMOTE_SETUP");
  expect(processResult.changesSummarized).toContain("a3ux_REMOTE_SETUP");
  expect(completedJobNode.title).toContain("COMPLETED");
});

test("Created the Graph Representation and adds 1 Wrapper with 2 Jobs", () => {
  // Arrange
  const { tree, reference, jobs } = data_a3ux;
  const currentTree = JSON.parse(JSON.stringify(tree));
  const currentReference = JSON.parse(JSON.stringify(reference));
  const currentJobs = JSON.parse(JSON.stringify(jobs));

  let sut = new createTree("#tree", {
    extensions: ["filter", "childcounter", "clones", "multi"],
    filter: {
      autoApply: true, // Re-apply last filter if lazy data is loaded
      autoExpand: true, // Expand all branches that contain matches while filtered
      counter: true, // Show a badge with number of matching child nodes near parent icons
      fuzzy: false, // Match single characters in order, e.g. 'fb' will match 'FooBar'
      hideExpandedCounter: true, // Hide counter badge if parent is expanded
      hideExpanders: false, // Hide expanders if all child nodes are hidden by filter
      highlight: false, // Highlight matches by wrapping inside <mark> tags
      leavesOnly: true, // Match end nodes only
      nodata: true, // Display a 'no data' status node if result is empty
      mode: "hide", // Grayout unmatched nodes (pass "hide" to remove unmatched node instead)
    },
    source: currentTree,
  });

  // Act
  let treeUpdater;
  let canUpdate;
  let processResult;

  treeUpdater = new TreeContentHandler(
    currentJobs,
    currentReference,
    data_a3ux_wrapper_1
  );
  canUpdate = treeUpdater.validate();
  if (canUpdate) {
    processResult = treeUpdater.processChanges(sut);
  }

  // Assert
  const updatedJob = processResult.currentJobs.filter(
    (x) => x.id === "a3ux_REMOTE_SETUP"
  )[0];
  const completedJobNode1 = sut.getNodesByRef("a3ux_REMOTE_SETUP")[0];
  const completedJobNode2 = sut.getNodesByRef("a3ux_19500101_fc0_INI")[0];
  const completedJobNodesSIM1 = sut.getNodesByRef("a3ux_19500101_fc0_1_SIM");
  const failedJobNodesSIM2 = sut.getNodesByRef("a3ux_19500101_fc0_2_SIM");
  const heldJobNodesSIM3 = sut.getNodesByRef("a3ux_19500101_fc0_3_SIM");
  const newWrapperFolder = sut.getNodesByRef(
    "Wrapper: a3ux_ASThread_16438795091365_1248_3"
  )[0];
  const wrapperChildrenRefKeys = newWrapperFolder.children.map(
    (child) => child.refKey
  );
  const wrapperHeaderInfo =
    processResult.currentReference[
      "Wrapper: a3ux_ASThread_16438795091365_1248_3"
    ];
  const regularFolderHeaderInfo =
    processResult.currentReference["a3ux_19500101_fc0"];
  expect(canUpdate).toBeTruthy();
  expect(sut).not.toBeNull();
  expect(
    sut.getNodesByRef("Wrapper: a3ux_ASThread_16438795091365_1248_3").length
  ).toEqual(1);
  expect(updatedJob.status).toEqual("COMPLETED");
  expect(completedJobNode1.title).toContain("COMPLETED");
  expect(completedJobNode2.title).toContain("COMPLETED");
  expect(completedJobNodesSIM1[0].title).toContain("COMPLETED");
  expect(completedJobNodesSIM1[1].title).toContain("COMPLETED");
  expect(failedJobNodesSIM2[0].title).toContain("FAILED");
  expect(failedJobNodesSIM2[1].title).toContain("FAILED");
  expect(heldJobNodesSIM3[0].title).toContain("HELD");
  expect(heldJobNodesSIM3[1].title).toContain("HELD");
  expect(wrapperHeaderInfo).not.toBeNull();
  expect(wrapperHeaderInfo.total).toEqual(3);
  expect(wrapperHeaderInfo.completed).toEqual(1);
  expect(wrapperHeaderInfo.failed).toEqual(1);
  expect(wrapperHeaderInfo.held).toEqual(1);
  expect(newWrapperFolder.children.length).toEqual(3);
  expect(regularFolderHeaderInfo.total).toEqual(7);
  expect(regularFolderHeaderInfo.completed).toEqual(3);
  expect(regularFolderHeaderInfo.failed).toEqual(1);
  expect(regularFolderHeaderInfo.held).toEqual(1);
  expect(wrapperChildrenRefKeys).toContain("a3ux_19500101_fc0_1_SIM");
  expect(wrapperChildrenRefKeys).toContain("a3ux_19500101_fc0_2_SIM");
  expect(wrapperChildrenRefKeys).toContain("a3ux_19500101_fc0_3_SIM");
  expect(processResult.changes).toContain("a3ux_19500101_fc0_1_SIM");
  expect(processResult.changes).toContain("a3ux_19500101_fc0_2_SIM");
  expect(processResult.changes).toContain("a3ux_19500101_fc0_3_SIM");
  expect(processResult.changesSummarized).toContain("a3ux_19500101_fc0_1_SIM");
  expect(processResult.changesSummarized).toContain("a3ux_19500101_fc0_2_SIM");
  expect(processResult.changesSummarized).toContain("a3ux_19500101_fc0_3_SIM");
});
