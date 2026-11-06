import { GRAPH_FIT_DURATION } from "../support/utils.js";

describe("navigation", () => {
  const expid = "a6zi";

  /**
   * Waits for the fit animation to complete before proceeding with the next test step.
   * Uses FIT_DURATION from the graphUtils.js file to determine the wait time plus a 
   * small buffer to ensure the animation has completed.
   * 
   * @returns {Cypress.Chainable} A Cypress chainable that resolves after the wait time.
   */
  const waitForFit = () => {
    return cy.wait(GRAPH_FIT_DURATION + 100);
  }

  /**
   * Expects a node to be within the viewport of the graph.
   * 
   * @param {string} nodeId - The ID of the node to check.
   * @param {boolean} expected - The expected result of the check.
   * @returns {Cypress.Chainable} A Cypress chainable that resolves after the check.
   */
  const expectNodeInViewport = (nodeId, expected) => {
    return cy.window().should((win) => {
      const graph = win.workflowCy;

      expect(Boolean(graph), "Cytoscape instance exists").to.equal(true);

      const node = graph.getElementById(nodeId);
      expect(node.length, `Node ${nodeId} exists`).to.equal(1);

      const box = node.renderedBoundingBox({
        includeLabels: false,
        includeOverlays: false,
      });

      const intersectsViewport =
        box.x2 > 0 &&
        box.y2 > 0 &&
        box.x1 < graph.width() &&
        box.y1 < graph.height();

      expect(
        intersectsViewport,
        `${nodeId} intersects the graph viewport`
      ).to.equal(expected);
    });
  }

  beforeEach(() => {
    cy.byPassAuth();
    
    cy.intercept("GET", "/v3/pklinfo/*/*", {
      fixture: "api/v3/pklinfo/graphpkl.json",
    }).as("pklinfo_response");

    cy.intercept(
      {
        method: "GET",
        pathname: "/v3/graph/*/standard/none",
      },
      {
        fixture: "api/v3/graph/standard_none.json",
      }
    ).as("standard_none_response");

    cy.visit(`/experiment/${expid}/graph`);
    cy.wait("@standard_none_response");
  });

  it("check that the graph is loaded with jobs", () => {
    cy.window().should((win) => {
      const graph = win.workflowCy;
      expect(Boolean(graph), "Cytoscape instance exists").to.equal(true);
      expect(graph.elements().length, "Graph has elements").to.be.greaterThan(0);
    });
  });

  it("monitor, filter and selection", () => {
    cy.contains("START MONITOR").click();
    cy.wait(500);
    cy.contains("STOP MONITOR").click();

    cy.get('[placeholder="Filter job name..."]').type("SYNCHRONIZE");
    cy.contains("Filter").click();
    cy.get("#bottom-panel-header").contains("a6zi_SYNCHRONIZE").should("exist");
    cy.contains("Clear").click();

    cy.get("#status-filter").select("COMPLETED");
    cy.get(".fa-check").click();
    cy.contains("53 jobs selected").should("exist");
    cy.contains("Change status").click();
    cy.get("body").type("{esc}");
    cy.wait(500);
    cy.get(".fa-xmark").click();
    cy.get("#bottom-panel-header").should("not.exist");
  });

  it("autofocus and fit workflow", () => {
    // Autofocus by default
    waitForFit();
    expectNodeInViewport("a6zi_LOCAL_SETUP", false);

    // Test full workflow fit
    cy.get('button[title="Fit workflow"]').should("be.enabled").click();
    waitForFit();
    expectNodeInViewport("a6zi_LOCAL_SETUP", true);

    // Test autofocusing on the active job
    cy.get('button[title="Focus active jobs"]').should("be.enabled").click();
    waitForFit();
    expectNodeInViewport("a6zi_LOCAL_SETUP", false);
  });

  it("the status legend is present and can be toggled", () => {
    const getLegend = () =>
      cy.contains("Status legend").parent().parent();

    getLegend().should("exist");

    cy.get('button[title="Expand status legend"]').click();
    getLegend().should("contain", "READY");

    cy.get('button[title="Minimize status legend"]').click();
    getLegend().should("not.contain", "READY");
  });
});
