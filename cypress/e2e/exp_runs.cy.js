describe("Experiment run history and RunId generation", () => {

  const expid = "a06l";

  const headers = [
    "Select",
    "RunId",
    "Created",
    "Finish",
    "Submitted",
    "Queuing",
    "Running",
    "Failed",
    "Suspended",
    "Completed",
    "Total",
    "SYPD",
    "ASYPD",
    "ChunkUnit",
    "ChunkSize",
  ];

  beforeEach(() => {
    cy.byPassAuth();

    cy.intercept("GET", Cypress.env("EXTERNAL_API") + `/v3/tree/${expid}`, {
      fixture: "api/v3/tree/tree_minimal_completed.json",
    }).as("getMinimalTree");

    cy.intercept("GET", Cypress.env("EXTERNAL_API") + `/v3/runs/${expid}`, {
      fixture: "api/v3/runs/exp_runs.json"
    }).as("getExperimentRuns");

    cy.intercept("GET", Cypress.env("EXTERNAL_API") + `/v3/rundetail/${expid}/1`, {
      fixture: "api/v3/runs/rundetail_local_single.json"
    }).as("getRunDetail");

    cy.visit(`/experiment/${expid}/tree`);

    cy.wait("@getMinimalTree")
      .its("response.statusCode")
      .should("eq", 200);
  });

  it("Evaluate the experiment history dialog and selection", () => {
    cy.get('[title="Select Run"]')
      .should('be.visible')
      .click();

    cy.wait("@getExperimentRuns")
      .its("response.statusCode")
      .should("eq", 200);

    cy.get('[id^="headlessui-dialog-panel-"]').should('be.visible');

    // Check table column headers
    cy.get("table").within(() => {
      headers.forEach((header) => {
        cy.contains("th", header)
          .scrollIntoView()
          .should("be.visible");
      });
    });

    cy.get('table tbody tr').should('have.length', 2);

    // Check that a specific run can be selected
    cy.get('table tbody tr').eq(1).within(() => {
      cy.get('button')
        .filter(":has(i.fa-eye)")
        .scrollIntoView()
        .should("be.visible")
        .and("not.be.disabled")
        .click();
    });

    cy.wait("@getRunDetail")
      .its("response.statusCode")
      .should("eq", 200);

    // Ensure the modal is closed
    cy.get('[id^="headlessui-dialog-panel-"]')
      .should("not.exist");

    // Check that the run details are displayed correctly
    cy.contains('Run: 2026-08-07T12:19:06+0200').should('be.visible');

    cy.contains(`${expid}_LOCAL_SETUP`)
      .should("be.visible")
      .click();

    cy.contains("172292")  // Contains the remote ID of LOCAL_SETUP
      .should("be.visible");

    // Check the run reset functionality
    cy.get('[title="Reset to latest"]')
      .should('be.visible')
      .click();

    cy.contains("Run: Latest")  // Contains the remote ID of LOCAL_SETUP
      .should("be.visible");
  });

  it("Evaluate the timestamp formats", () => {
    cy.contains('button', 'Run: Latest').click();

    // Ensure we are testing two timestamp formats
    cy.wait("@getExperimentRuns")
      .its("response")
      .then((response) => {
        expect(response.statusCode).to.eq(200);
        expect(response.body.runs).to.have.length(2);

        expect(response.body.runs[0].created).to.match(
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+\d{2}:\d{2}$/
        );

        expect(response.body.runs[1].created).to.match(
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+\d{4}$/
        );
      });

    // Ensure the timestamps are visible regardless of their format
    cy.contains('2026-08-07T13:02:48+02:00').scrollIntoView().should('be.visible');
    cy.contains('2026-08-07T12:19:06+0200').scrollIntoView().should('be.visible');

    // Ensure that the run IDs are correctly generated from "created"
    cy.contains('2608071302').scrollIntoView().should('be.visible');
    cy.contains('2608071219').scrollIntoView().should('be.visible');
  });
});
