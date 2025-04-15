describe("user metrics view", () => {
  const expid = "a6zi";

  beforeEach(() => {
    cy.byPassAuth();

    cy.intercept(
      "GET",
      Cypress.env("EXTERNAL_API") + `/v4/experiments/${expid}/runs`,
      {
        fixture: "api/v4/experiments/runs/minimal_run_list.json",
      }
    ).as("dummy_runs_response");

    cy.intercept(
      "GET",
      Cypress.env("EXTERNAL_API") + `/v4/experiments/${expid}/runs/3/user-metrics`,
      {
        fixture: "api/v4/experiments/runs/user-metrics/metrics.json",
      }
    ).as("dummy_user_metrics_response");

    cy.intercept(
      "GET",
      Cypress.env("EXTERNAL_API") + `/v4/experiments/${expid}/runs/1/user-metrics`,
      {
        body: {
          run_id: 1,
          metrics: []
        },
      }
    ).as("dummy_config_response");

  })

  it("user metrics view", () => {
    cy.visit(`/experiment/${expid}/user-metrics`);
    cy.wait(500);
    cy.contains("Run 3")

    cy.contains("a6zi_SIM")

    // Change the selected run to 1
    cy.contains("Run 3").parent().select("Run 1")
    cy.wait(250);

    cy.contains("Run 1")
    cy.contains("No metrics available")
  })

  it("user metrics view with filter", () => {
    cy.visit(`/experiment/${expid}/user-metrics?run_id=1`);
    cy.wait(500);

    cy.contains("Run 1")
    cy.contains("No metrics available")
  })

  it("cannot get runs", () => {
    cy.intercept(
      "GET",
      Cypress.env("EXTERNAL_API") + `/v4/experiments/${expid}/runs`,
      {
        body: {
          error: "Cannot get runs",
        },
        statusCode: 500,
      }
    ).as("dummy_runs_response");

    cy.visit(`/experiment/${expid}/user-metrics`);
    cy.wait(500);

    // Check if the page contains "No metrics available"
    cy.contains("Error fetching the experiment runs")
  })
});