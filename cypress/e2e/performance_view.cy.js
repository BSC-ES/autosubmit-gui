describe("performance view navigation", () => {
  const performData = require("../fixtures/api/v3/performance/performance.json");

  const expid = "a6zi";
  before(() => {
    cy.byPassAuth();
    
    cy.intercept("GET", Cypress.env("EXTERNAL_API") + "/v3/performance/*", {
      fixture: "api/v3/performance/performance.json",
    }).as("dummy_response");

    cy.visit(`/experiment/${expid}/performance`);
  });

  it("table content", () => {
    performData.considered.forEach((item) => {
      cy.get("table td").contains(item.name).should("exist");
    });
    cy.contains("WARNINGS (").click();
  });
});
