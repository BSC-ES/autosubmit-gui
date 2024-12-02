describe("stats view navigation", () => {
  const expid = "a6zi";
  before(() => {
    cy.byPassAuth();
    
    cy.intercept("GET", Cypress.env("EXTERNAL_API") + "/v3/stats/*/*/*", {
      fixture: "api/v3/stats/any0.json",
    }).as("dummy_response");

    cy.visit(`/experiment/${expid}/stats`);
  });

  it("navigate", () => {
    cy.contains("Get Statistics").click();
    cy.get("input").should("have.value", "Any");
    cy.url().should("include", `section=Any`);
    cy.url().should("include", `hours=0`);
    cy.contains("Start of experiment").should("exist");
  });
});
