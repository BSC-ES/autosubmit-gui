describe("navigation", () => {
  const expid = "a6zi";
  before(() => {
    cy.intercept(
      "GET",
      Cypress.env("EXTERNAL_API") + "/v3/graph/*/standard/none",
      {
        fixture: "api/v3/graph/standard_none.json",
      }
    ).as("dummy_response");
    cy.intercept("GET", Cypress.env("EXTERNAL_API") + "/v3/pklinfo/*/*", {
      fixture: "api/v3/pklinfo/graphpkl.json",
    }).as("dummy_response");

    cy.visit(`/experiment/${expid}/graph`);
    cy.wait(750);
  });

  it("monitor, filter and selection", () => {
    cy.contains("START MONITOR").click();
    cy.wait(500);
    cy.contains("STOP MONITOR").click();

    cy.get('[placeholder="Filter job..."]').type("SYNCHRONIZE");
    cy.contains("Filter").click();
    cy.get("#bottom-panel-header").contains("a6zi_SYNCHRONIZE").should("exist");
    cy.contains("Clear").click();

    cy.get(".fa-check").click();
    cy.contains("54 jobs selected").should("exist");
    cy.contains("Change status").click();
    cy.get("body").type("{esc}");
    cy.wait(500);
    cy.get(".fa-xmark").click();
    cy.get("#bottom-panel-header").should("not.exist");
  });
});
