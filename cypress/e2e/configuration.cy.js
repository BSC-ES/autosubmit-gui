describe("configuration view", () => {
  const expid = "a000";

  beforeEach(() => {
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
  }
  )

  it("configuration view", () => {
    cy.visit(`/experiment/${expid}/config`);
    cy.wait(500);
    cy.contains("Run 3")
    cy.contains("Current Filesystem")
    // Div that contains key1 also have a child i tag with class fa-solid fa-circle-exclamation
    cy.contains("key1").find(".fa-solid.fa-circle-exclamation").should("exist")
  })

  it("configuration view with filter", () => {
    cy.visit(`/experiment/${expid}/config?filter=filter1`);
    cy.wait(500);
    
    // Select input with id="config-filter" and check if it has value "filter1"
    cy.get("#config-filter").should("have.value", "filter1")

    // Type other value in the input and click the apply button
    cy.get("#config-filter").type("filter2")
    cy.get("#config-filter-apply").click()

    // Check if the input has the new value and is in the url
    cy.get("#config-filter").should("have.value", "filter1filter2")
    cy.url().should("include", "filter=filter1filter2")
  })

  it("configuration view with filter and runs", () => {
    cy.visit(`/experiment/${expid}/config?filter=filter1&left=1&right=2`);
    cy.wait(500);

    // Select input with id="config-filter" and check if it has value "filter1"
    cy.get("#config-filter").should("have.value", "filter1")

    cy.contains("Run 2")
    cy.contains("Run 1")

    // Find the select with value "Run 2" and change it to "Run 3"
    cy.contains("Run 1").parent().select("3")
    cy.wait(250);

    // Check if the url has the new run value
    cy.url().should("include", "left=3")
  })

}
);