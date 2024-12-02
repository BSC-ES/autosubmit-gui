describe("tree navigation", () => {
  const expid = "a6zi";
  before(() => {
    cy.byPassAuth();
    
    cy.intercept("GET", Cypress.env("EXTERNAL_API") + "/v3/tree/*", {
      fixture: "api/v3/tree/tree_wrappers.json",
    }).as("dummy_response");
    cy.intercept("GET", Cypress.env("EXTERNAL_API") + "/v3/pkltreeinfo/**/*", {
      fixture: "api/v3/pkltreeinfo/treepkl.json",
    }).as("dummy_monitor_response");

    cy.visit(`/experiment/${expid}/tree`);
  });

  it("monito, filter and selection", () => {
    cy.contains("START MONITOR").click();
    cy.wait(500);
    cy.contains("STOP MONITOR").click();

    cy.get('[placeholder="Filter job..."]').type("SYNCHRONIZE");
    cy.contains("Filter").click();
    cy.contains("a6zi_SYNCHRONIZE").dblclick();
    cy.get("#bottom-panel-header").contains("a6zi_SYNCHRONIZE").should("exist");
    cy.contains("Clear").click();

    cy.contains("a6zi_LOCAL_SETUP").click({ ctrlKey: true });
    cy.contains("2 jobs selected").should("exist");
  });
});
