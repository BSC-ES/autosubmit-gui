describe("Job run history and RunId generation", () => {

  const expid = "a06l";

  const headers = [
    "RunId",
    "out",
    "err",
    "Counter",
    "JobId",
    "Submit",
    "Start",
    "Finish",
    "Queue",
    "Run",
    "Status",
    "Energy",
    "SYPD",
    "ASYPD",
    "Wallclock",
    "NCpus",
    "NNodes"
  ];

  const createLogFixture = (type = "out") => ({
    "logfile": `.../a06l_LOCAL_SETUP.20260810125022.${type}`,
    "found": true,
    "lastModified": "2026-08-10T12:50:33+02:00",
    "timeStamp": 1786359033,
    "error": false,
    "error_message": "",
    "logcontent": [{ "index": 0, "content": `This is the ${type} log` }]
  });

  beforeEach(() => {
    cy.byPassAuth();

    cy.intercept("GET", Cypress.env("EXTERNAL_API") + `/v3/tree/${expid}`, {
      fixture: "api/v3/tree/tree_minimal_completed.json",
    }).as("getMinimalTree");

    cy.intercept("GET", Cypress.env("EXTERNAL_API") + `/v3/history/${expid}/${expid}_LOCAL_SETUP`, {
      fixture: "api/v3/history/job_run_history.json"
    }).as("getJobHistory");

    cy.intercept("GET", Cypress.env("EXTERNAL_API") + `/v3/joblog/${expid}_LOCAL_SETUP.*.out`, {
      body: createLogFixture("out")
    }).as("getJobOutLog");

    cy.intercept("GET", Cypress.env("EXTERNAL_API") + `/v3/joblog/${expid}_LOCAL_SETUP.*.err`, {
      body: createLogFixture("err")
    }).as("getJobErrLog");

    cy.visit(`/experiment/${expid}/tree`);

    cy.wait("@getMinimalTree")
      .its("response.statusCode")
      .should("eq", 200);
  });

  it("Evaluate the job history and log dialogs", () => {
    cy.contains(`${expid}_LOCAL_SETUP`)
      .should("be.visible")
      .click();

    cy.contains('button', 'Job History').click();

    cy.wait("@getJobHistory")
      .its("response.statusCode")
      .should("eq", 200);

    cy.contains(`History of Job: ${expid}_LOCAL_SETUP`).should('be.visible');

    // Check table column headers
    cy.get("table").within(() => {
      headers.forEach((header) => {
        cy.contains("th", header)
          .scrollIntoView()
          .should("be.visible");
      });
    });

    cy.get('table tbody tr').should('have.length', 2);

    // Check that the out logs can be loaded
    cy.get("table tbody tr").eq(0).within(() => {
      cy.get("button")
        .find("i.fa-terminal")
        .eq(0)
        .click();
    });
    cy.wait("@getJobOutLog")
      .its("response.statusCode")
      .should("eq", 200);

    cy.contains("This is the out log").should("be.visible");

    cy.get('[id^="headlessui-dialog-title-"]:visible')
      .last()
      .find("i.fa-xmark")
      .click();

    cy.get("table tbody tr").eq(0).within(() => {
      cy.get("button")
        .find("i.fa-terminal")
        .eq(1)
        .click();
    });
    cy.wait("@getJobErrLog")
      .its("response.statusCode")
      .should("eq", 200);

    cy.contains("This is the err log").should("be.visible");

    cy.get('[id^="headlessui-dialog-title-"]:visible')
      .last()
      .find("i.fa-xmark")
      .click();

    // Close the modal and check if it is closed
    cy.contains(
      '[id^="headlessui-dialog-title-"]:visible',
      `History of Job: ${expid}_LOCAL_SETUP`
    )
      .should("be.visible")
      .find("i.fa-xmark")
      .click();

    cy.contains(
      '[id^="headlessui-dialog-title-"]',
      `History of Job: ${expid}_LOCAL_SETUP`
    )
      .should("not.exist");
  });

  it("Evaluate the timestamp formats", () => {
    cy.contains(`${expid}_LOCAL_SETUP`)
      .should("be.visible")
      .click();

    cy.contains('button', 'Job History').click();

    // Ensure we are testing two timestamp formats
    cy.wait("@getJobHistory")
      .its("response")
      .then((response) => {
        expect(response.statusCode).to.eq(200);
        expect(response.body.history).to.have.length(2);

        expect(response.body.history[0].run_created).to.match(
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+\d{2}:\d{2}$/
        );

        expect(response.body.history[1].run_created).to.match(
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+\d{4}$/
        );
      });

    // Ensure the timestamps are visible regardless of their format and that
    // the run IDs are correctly generated from "run_created"
    cy.get('table tbody tr').should('have.length', 2).then(($rows) => {
      cy.wrap($rows[0]).within(() => {
        cy.contains('2026-08-10T12:50:22+02:00').scrollIntoView().should('be.visible');
        cy.contains('2608101250').scrollIntoView().should('be.visible');
      });

      cy.wrap($rows[1]).within(() => {
        cy.contains('2026-08-10T12:40:01+0200').scrollIntoView().should('be.visible');
        cy.contains('2608101239').scrollIntoView().should('be.visible');
      });
    });
  });
});
