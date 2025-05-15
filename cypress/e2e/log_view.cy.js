describe("stats view navigation", () => {
  const expid = "a1vg";
  beforeEach(() => {
    cy.byPassAuth();
    
    cy.intercept("GET", Cypress.env("EXTERNAL_API") + "/v3/exprun/*", {
      fixture: "api/v3/exprun/run_log.json",
    }).as("dummy_run_response");

    cy.intercept("GET", Cypress.env("EXTERNAL_API") + "/v3/exp-recovery-logs/*", {
      fixture: "api/v3/exp-recovery-logs/platforms_recovery_logs.json",
    }).as("dummy_exp_recovery_logs_response");
  });

  it("navigate", () => {
    cy.visit(`/experiment/${expid}/runlog`);
    cy.wait(250)

    // pre.bash should exist and have at least one line
    cy.get("pre.bash").should("exist");
    cy.get("pre.bash").children().get("ul").children().should("have.length.greaterThan", 1);

    // Log recovery tab
    cy.contains("Log Recoveries").click();
    cy.wait(250);
    cy.get("pre.bash").children().get("ul").children().should("have.length.greaterThan", 1);

    cy.contains("local").parent().select("marenostrum5");
    cy.wait(250);
    cy.get("pre.bash").children().get("ul").children().should("have.length.greaterThan", 1);
  });
});
