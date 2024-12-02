describe("configuration view", () => {
  const expid = "a000";

  before(() => {
    cy.byPassAuth();
    
    cy.intercept(
      "GET",
      Cypress.env("EXTERNAL_API") + `/v4/experiments/${expid}/runs`,
      {
        fixture: "api/v4/experiments/runs/minimal_run_list.json",
      }
    ).as("dummy_response");

    cy.intercept(
      "GET",
      Cypress.env("EXTERNAL_API") + `/v4/experiments/${expid}/filesystem-config`,
      {
        body: {
          config: {
            key1: "value1",
            key2: "value2",
          }
        }
      }
    ).as("dummy_response");

    cy.intercept(
      "GET",
      Cypress.env("EXTERNAL_API") + `/v4/experiments/${expid}/runs/3/config`,
      {
        body: {
          run_id: 3,
          config: {
            key1: "value1a1",
            key2: "value2",
          }
        }
      }
    ).as("dummy_response");

    cy.visit(`/experiment/${expid}/config`);
    cy.wait(500);
  }
  )

  it("configuration view", () => {
    cy.contains("Run 3")
    cy.contains("Current Filesystem")
    // Div that contains key1 also have a child i tag with class fa-solid fa-circle-exclamation
    cy.contains("key1").find(".fa-solid.fa-circle-exclamation").should("exist")
  })

}
);