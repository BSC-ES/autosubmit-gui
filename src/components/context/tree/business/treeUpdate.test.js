import TreeContentHandler from "./treeUpdate";
import "jquery.fancytree/dist/modules/jquery.fancytree.clones";
import "jquery.fancytree/dist/modules/jquery.fancytree.filter";
import "jquery.fancytree/dist/modules/jquery.fancytree.childcounter";
import "jquery.fancytree/dist/modules/jquery.fancytree.edit";
import "jquery.fancytree/dist/modules/jquery.fancytree.multi";
import { createTree } from "jquery.fancytree";
import React from "react";
import { unmountComponentAtNode, render } from "react-dom";
import { act } from "react-dom/test-utils";
import { interval } from "d3-timer";
import data_a3ux from "./case_a3ux.json";
import data_a3ux_update from "./case_a3ux_update.json";
import data_a3ux_wrapper_1 from "./case_a3ux_update_wrapper.json";


const experiment = {
    expid: "a3ux",
    db_historic_version: 18,
    owner: "wuruchi",
    totalJobs: 19,
}



var treeRep = null;
let container = null;

beforeEach(() => {
    container = document.createElement("div");
    container.setAttribute("id", "tree")
    document.body.appendChild(container);
})

afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
    container = null;
})

it("Creates the Graph Representation object and performs a simple status update", () => {
    const { tree, reference, jobs } = data_a3ux;
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
            source: tree,
        })        
    });

    expect(treeRep).not.toBeNull();

    let treeUpdater;
    let canUpdate;    
    let processResult;
    act(() => {
        treeUpdater = new TreeContentHandler(jobs, reference, data_a3ux_update, treeRep);
        canUpdate = treeUpdater.validate();
        if (canUpdate) {
            processResult = treeUpdater.processChanges();
        }
    })
    const updatedJob = processResult.currentJobs.filter(x => x.id === 'a3ux_REMOTE_SETUP')[0];
    const completedJobNode = treeRep.getNodesByRef('a3ux_REMOTE_SETUP')[0];
    expect(updatedJob.status).toEqual("COMPLETED");
    expect(canUpdate).toBeTruthy();
    expect(processResult.changes.length).toBeGreaterThan(0);
    expect(processResult.changesSummarized.length).toBeGreaterThan(0);
    expect(processResult.currentJobs.length).toBe(9);
    expect(completedJobNode.title).toContain("COMPLETED");
})


it("Created the Graph Representation and adds 1 Wrapper with 2 Jobs", () => {
    const { tree, reference, jobs } = data_a3ux;
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
            source: tree,
        })        
    });

    expect(treeRep).not.toBeNull();

    let treeUpdater;
    let canUpdate;    
    let processResult;
    act(() => {
        treeUpdater = new TreeContentHandler(jobs, reference, data_a3ux_wrapper_1, treeRep);
        canUpdate = treeUpdater.validate();
        if (canUpdate) {
            processResult = treeUpdater.processChanges();
        }
    })
    expect(canUpdate).toBeTruthy();
    const updatedJob = processResult.currentJobs.filter(x => x.id === 'a3ux_REMOTE_SETUP')[0];      
    const completedJobNode1 = treeRep.getNodesByRef('a3ux_REMOTE_SETUP')[0];
    const completedJobNode2 = treeRep.getNodesByRef('a3ux_19500101_fc0_INI')[0];
    const completedJobNodesSIM1 = treeRep.getNodesByRef('a3ux_19500101_fc0_1_SIM');
    const failedJobNodesSIM2 = treeRep.getNodesByRef('a3ux_19500101_fc0_2_SIM');
    const heldJobNodesSIM3 = treeRep.getNodesByRef('a3ux_19500101_fc0_3_SIM');
   
    expect(updatedJob.status).toEqual("COMPLETED");        
    expect(completedJobNode1.title).toContain("COMPLETED");
    expect(completedJobNode2.title).toContain("COMPLETED");
    expect(completedJobNodesSIM1[0].title).toContain("COMPLETED");
    expect(completedJobNodesSIM1[1].title).toContain("COMPLETED");
    expect(failedJobNodesSIM2[0].title).toContain("FAILED");
    expect(failedJobNodesSIM2[1].title).toContain("FAILED");
    expect(heldJobNodesSIM3[0].title).toContain("HELD");
    expect(heldJobNodesSIM3[1].title).toContain("HELD");
    expect(processResult.currentReference["Wrapper: a3ux_ASThread_16438795091365_1248_3"]).not.toBeNull();    
})
