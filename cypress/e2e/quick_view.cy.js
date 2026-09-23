import { JOB_STATUSES, DEFAULT_ITEMS_QUICK_VIEW, DEFAULT_STATUS_QUICK_VIEW } from "../support/utils";

const expid = "a06m";

/**
 * Visits the experiment quick view and waits for the job list request.
 * Its purpose is to avoid repeating the initial load in some tests.
 *
 * @param {string} query
 *   Optional query string without the leading `?`.
 *   Example: `"status=COMPLETED&page=2"`.
 *
 * @returns {Cypress.Chainable}
 *   The interception yielded by `cy.wait("@getExperimentJobs")`.
 */
const visitQuickView = (query = "") => {
  const suffix = query ? `?${query}` : "";

  cy.visit(`/experiment/${expid}/quick${suffix}`);

  return cy.wait("@getExperimentJobs");
};

/**
 * The default query intercept for all the tests. It is meant to be used 
 * in the `beforeEach` hook of the test suites.
 */
const setDefaultIntercept = () => {
  cy.intercept(
    {
      method: "GET",
      pathname: `/v4/experiments/${expid}/jobs`,
    },
    {
      fixture: "api/v4/experiments/huge_quick_job_list/quick_full_response.json",
    },
    (req) => {
      expect(req.query.view).to.equal("quick");
    },
  ).as("getExperimentJobs");
}

describe("quick view initial load", () => {

  beforeEach(() => {
    cy.byPassAuth();

    setDefaultIntercept();
  });

  it("shows a loading indicator while loading jobs", () => {
    cy.intercept(
      {
        method: "GET",
        pathname: `/v4/experiments/${expid}/jobs`,
      },
      (req) => {
        req.reply({
          delay: 500,
          statusCode: 200,
        });
      },
    ).as("slowJobs");

    cy.visit(`/experiment/${expid}/quick`);

    cy.get('[role="status"]')
      .should("be.visible");

    cy.wait("@slowJobs");
  });
});

describe("empty job list management", () => {

  beforeEach(() => {
    cy.byPassAuth();
  });

  it("checks the management of empty job lists", () => {
    cy.intercept(
      {
        method: "GET",
        pathname: `/v4/experiments/${expid}/jobs`,
      },
      {
        statusCode: 200,
        body: {
          jobs: [],
          pagination: {
            page: 1,
            page_size: DEFAULT_ITEMS_QUICK_VIEW,
            total_pages: 1,
            page_items: 0,
            total_items: 0,
          },
        },
      },
    ).as("emptyJobs");

    cy.visit(`/experiment/${expid}/quick`);

    cy.wait("@emptyJobs");

    cy.contains("No jobs found")
      .should("be.visible");
  });
});

describe("quick view job list interaction", () => {

  beforeEach(() => {
    cy.byPassAuth();

    setDefaultIntercept();

    visitQuickView();
  });

  it("check the first job in the list", () => {
    cy.contains("a06m_20200101_fc0_100_CLEAN")
      .should("be.visible");
  });

  it("check the last job in the list", () => {
    cy.contains("a06m_20200101_fc0_122_SIM")
      .scrollIntoView();
    cy.contains("a06m_20200101_fc0_122_SIM")
      .should("be.visible");
  });

  it("single job selection shows the job details in the bottom panel", () => {
    cy.contains("a06m_20200101_fc0_100_CLEAN")
      .click();

    cy.get("#bottom-panel-header")
      .contains("a06m_20200101_fc0_100_CLEAN")
      .should("be.visible");
  });

  it("replaces the selection with a normal click", () => {
    cy.contains("a06m_20200101_fc0_100_CLEAN")
      .click();

    cy.contains("a06m_20200101_fc0_100_INI")
      .click();

    cy.get("#bottom-panel-header")
      .should("contain.text", "a06m_20200101_fc0_100_INI");
  });

  it("deselects a selected job with Ctrl-click", () => {
    cy.contains("a06m_20200101_fc0_100_CLEAN")
      .click();

    cy.contains("a06m_20200101_fc0_100_CLEAN")
      .click({ ctrlKey: true });

    cy.get("#bottom-panel-header")
      .should("not.exist");
  });

  it("multiple job (also with negative) selection shows the job details in the bottom panel", () => {
    cy.contains("a06m_20200101_fc0_100_CLEAN")
      .click();

    cy.get("#bottom-panel-header")
      .contains("a06m_20200101_fc0_100_CLEAN")
      .should("be.visible");

    cy.contains("a06m_20200101_fc0_100_SIM")
      .click({ ctrlKey: true });
    cy.contains("2 jobs selected").should("exist");

    cy.contains("a06m_20200101_fc0_101_POST")
      .click({ shiftKey: true });
    cy.contains("5 jobs selected").should("exist");

    cy.contains("a06m_20200101_fc0_102_INI")
      .click({ ctrlKey: true });
    cy.contains("6 jobs selected").should("exist");

    cy.contains("a06m_20200101_fc0_101_SIM")
      .click({ shiftKey: true });
    cy.contains("8 jobs selected").should("exist");

    cy.contains("a06m_20200101_fc0_100_CLEAN")
      .click({ ctrlKey: true });
    cy.contains("7 jobs selected").should("exist");
  });

  it("clears selected jobs when changing page", () => {
    cy.contains("a06m_20200101_fc0_100_CLEAN")
      .click();

    cy.get("#bottom-panel-header")
      .should("be.visible");

    cy.get("#paginator")
      .contains("2")
      .click();

    cy.wait("@getExperimentJobs");

    cy.get("#bottom-panel-header")
      .should("not.exist");
  });

  it("refreshes the job list", () => {
    cy.get("#refresh-data-btn").click();

    cy.wait("@getExperimentJobs");

    cy.contains("a06m_20200101_fc0_100_CLEAN")
      .should("be.visible");
  });

  it("updates the URL when changing status", () => {
    cy.get("#status-filter")
      .select("COMPLETED");

    cy.location("search")
      .should("include", "status=COMPLETED")
      .and("include", "page=1");
  });

  it("updates the URL when changing page size", () => {
    cy.get("#jobs-per-page")
      .select("500");

    cy.location("search")
      .should("include", "page_size=500")
      .and("include", "page=1");
  });

  it("updates the URL when filtering by job name", () => {
    cy.get("#job-name-filter")
      .type("SIM{enter}");

    cy.location("search")
      .should("include", "job_name=SIM")
      .and("include", "page=1");
  });
});

describe("quick view filtering", () => {

  beforeEach(() => {
    cy.byPassAuth();

    setDefaultIntercept();
  });

  it("verify that the default page size is 100", () => {
    visitQuickView();

    cy.get("#jobs-per-page")
      .should("have.value", DEFAULT_ITEMS_QUICK_VIEW);
  });

  it("check presence of the paginator", () => {
    visitQuickView();

    cy.get("#paginator")
      .should("be.visible");
  });

  it("all possible job statuses are selectable for filtering", () => {
    visitQuickView();

    cy.get("#status-filter")
      .find("option")
      .then(($options) => {
        const actualValues = [...$options]
          .map((option) => option.value)
          .filter(Boolean);

        expect(actualValues)
          .to.have.members(JOB_STATUSES);
      });
  });

  it("check that the job list size filter works", () => {
    visitQuickView();

    const sizeToFilter = "500";

    cy.get("#jobs-per-page")
      .select(sizeToFilter);

    cy.wait("@getExperimentJobs")
      .then(({ request, response }) => {
        expect(request.query.view).to.equal("quick");
        expect(request.query.job_name).to.equal(undefined);
        expect(request.query.status).to.equal(undefined);
        expect(request.query.page).to.equal("1");
        expect(request.query.page_size).to.equal(sizeToFilter);
        expect(response.statusCode).to.equal(200);
      });
  });

  it("check page size selector when there is just a single page", () => {
    cy.intercept(
      {
        method: "GET",
        pathname: `/v4/experiments/${expid}/jobs`,
      },
      {
        statusCode: 200,
        body: {
          jobs: [],
          pagination: {
            page: 1,
            page_size: DEFAULT_ITEMS_QUICK_VIEW,
            total_pages: 1,
            page_items: 1,
            total_items: 1,
          },
        },
      },
    ).as("justOneJob");

    cy.visit(`/experiment/${expid}/quick`);

    cy.wait("@justOneJob");

    cy.get("#jobs-per-page")
      .should("not.exist");
  });

  it("check that the status filter works", () => {
    visitQuickView();

    const statusToFilter = "COMPLETED";

    cy.get("#status-filter")
      .select(statusToFilter);

    cy.wait("@getExperimentJobs")
      .then(({ request, response }) => {
        expect(request.query.view).to.equal("quick");
        expect(request.query.job_name).to.equal(undefined);
        expect(request.query.status).to.equal(statusToFilter);
        expect(request.query.page).to.equal("1");
        expect(request.query.page_size).to.equal(DEFAULT_ITEMS_QUICK_VIEW.toString());
        expect(response.statusCode).to.equal(200);
      });
  });

  it("clears the status filter when selecting 'Any status'", () => {
    visitQuickView("status=COMPLETED");

    cy.get("#status-filter")
      .select(DEFAULT_STATUS_QUICK_VIEW);

    cy.wait("@getExperimentJobs")
      .then(({ request }) => {
        expect(request.query.status)
          .to.equal(undefined);
      });

    cy.get("#status-filter")
      .find("option:selected")
      .should("have.text", DEFAULT_STATUS_QUICK_VIEW);

    cy.location("search")
      .should("not.contain", "status=COMPLETED");
  });

  it("check that the page is reset when changing status", () => {
    visitQuickView("page=5");

    cy.get("#status-filter")
      .select("FAILED");

    cy.wait("@getExperimentJobs")
      .its("request.query")
      .should("deep.include", {
        page: "1",
        status: "FAILED",
      });
  });

  it("check that the job name filter works", () => {
    visitQuickView();

    const jobNameToFilter = "SIM";

    cy.get("#job-name-filter")
      .type(`${jobNameToFilter}{enter}`);

    cy.wait("@getExperimentJobs")
      .then(({ request, response }) => {
        expect(request.query.view).to.equal("quick");
        expect(request.query.job_name).to.equal(jobNameToFilter);
        expect(request.query.status).to.equal(undefined);
        expect(request.query.page).to.equal("1");
        expect(request.query.page_size).to.equal(DEFAULT_ITEMS_QUICK_VIEW.toString());
        expect(response.statusCode).to.equal(200);
      });
  });

  it("clears the job name filter", () => {
    visitQuickView("job_name=SIM");

    cy.get("#job-name-filter")
      .clear();

    cy.contains("button", "Filter")
      .click();

    cy.wait("@getExperimentJobs")
      .its("request.query.job_name")
      .should("be.undefined");
  });

  it("preserves status when applying a job name filter", () => {
    visitQuickView("status=COMPLETED");

    cy.get("#job-name-filter")
      .type("SIM{enter}");

    cy.wait("@getExperimentJobs")
      .its("request.query")
      .should("deep.include", {
        status: "COMPLETED",
        job_name: "SIM",
        page: "1",
      });
  });

  it("preserves job name when changing status", () => {
    visitQuickView("job_name=SIM");

    cy.get("#status-filter")
      .select("FAILED");

    cy.wait("@getExperimentJobs")
      .its("request.query")
      .should("deep.include", {
        job_name: "SIM",
        status: "FAILED",
        page: "1",
      });
  });

  it("clears selected jobs when changing status", () => {
    visitQuickView();

    cy.contains("a06m_20200101_fc0_100_CLEAN")
      .click();

    cy.get("#bottom-panel-header")
      .should("be.visible");

    cy.get("#status-filter")
      .select("FAILED");

    cy.wait("@getExperimentJobs");

    cy.get("#bottom-panel-header")
      .should("not.exist");
  });
});

describe("quick view from query construction", () => {

  beforeEach(() => {
    cy.byPassAuth();

    setDefaultIntercept();
  });

  it("initializes the status filter from the URL", () => {
    visitQuickView("status=COMPLETED");

    cy.get("#status-filter")
      .should("have.value", "COMPLETED");
  });

  it("initializes the page size from the URL", () => {
    visitQuickView("page_size=500");

    cy.get("#jobs-per-page")
      .should("have.value", "500");
  });

  it("initializes the current page from the URL", () => {
    visitQuickView("page=2")
      .its("request.query.page")
      .should("eq", "2");
  });
});

describe("quick view from invalid query construction", () => {

  beforeEach(() => {
    cy.byPassAuth();

    setDefaultIntercept();
  });

  it("check that an invalid status is not accepted in the query", () => {
    visitQuickView(`status=INVALID_STATUS`)
      .then(({ request, response }) => {
        expect(request.query.view).to.equal("quick");
        expect(request.query.job_name).to.equal(undefined);
        expect(request.query.status).to.equal(undefined); // defaults to no status
        expect(request.query.page).to.equal("1");
        expect(request.query.page_size).to.equal(DEFAULT_ITEMS_QUICK_VIEW.toString());
        expect(response.statusCode).to.equal(200);
      });

    cy.get("#status-filter")
      .find("option:selected")
      .should("have.text", DEFAULT_STATUS_QUICK_VIEW);

    cy.location("search")
      .should("not.contain", "status=INVALID_STATUS");
  });

  ["-1", "aaa", "0"].forEach((invalidPage) => {
    it(`check that an invalid page number ${invalidPage} is not accepted in the query`, () => {
      visitQuickView(`page=${invalidPage}`)
        .then(({ request, response }) => {
          expect(request.query.view).to.equal("quick");
          expect(request.query.job_name).to.equal(undefined);
          expect(request.query.status).to.equal(undefined);
          expect(request.query.page).to.equal("1"); // defaults to page 1
          expect(request.query.page_size).to.equal(DEFAULT_ITEMS_QUICK_VIEW.toString());
          expect(response.statusCode).to.equal(200);
        });

      cy.location("search")
        .should("not.contain", `page=${invalidPage}`);
    });
  });

  ["-1", "99", "1001"].forEach((invalidSizeToFilter) => {
    it(`check that invalid job list size ${invalidSizeToFilter} is not accepted in the query`, () => {
      visitQuickView(`page_size=${invalidSizeToFilter}`)
        .then(({ request, response }) => {
          expect(request.query.view).to.equal("quick");
          expect(request.query.job_name).to.equal(undefined);
          expect(request.query.status).to.equal(undefined);
          expect(request.query.page).to.equal("1");
          expect(request.query.page_size).to.equal(DEFAULT_ITEMS_QUICK_VIEW.toString());
          expect(response.statusCode).to.equal(200);
        });

      cy.get("#jobs-per-page")
        .find("option:selected")
        .should("have.text", DEFAULT_ITEMS_QUICK_VIEW.toString());

      cy.location("search")
        .should("not.contain", `page_size=${invalidSizeToFilter}`);
    });
  });

  it("returns to page 1 when the requested page is out of range", () => {
    visitQuickView("page=9999");

    cy.wait("@getExperimentJobs")
      .its("request.query.page")
      .should("eq", "1");

    cy.location("search")
      .should("include", "page=1");

    cy.get("#paginator button.btn-primary")
      .should("contain", "1");
  });
});

describe("job info modal", () => {

  beforeEach(() => {
    cy.byPassAuth();

    setDefaultIntercept();

    visitQuickView();
  });

  it("opens the change status modal", () => {
    cy.contains("a06m_20200101_fc0_100_CLEAN")
      .click();

    cy.contains("button", "Change status")
      .click();

    cy.get('[role="dialog"]')
      .find(':visible')
      .should('exist');
  });

  it("loads the selected job details", () => {
    cy.intercept(
      "GET",
      "**/jobs/a06m_20200101_fc0_100_CLEAN*",
      {
        fixture: "api/v4/jobs/job_detail.json",
      },
    ).as("getJobDetail");

    cy.contains("a06m_20200101_fc0_100_CLEAN")
      .click();

    cy.wait("@getJobDetail");

    cy.get("#bottom-panel-header")
      .should(
        "contain.text",
        "a06m_20200101_fc0_100_CLEAN",
      );
  });
});

describe("HTTP error management", () => {

  beforeEach(() => {
    cy.byPassAuth();
  });

  it("shows the API error message", () => {
    cy.intercept(
      {
        method: "GET",
        pathname: `/v4/experiments/${expid}/jobs`,
      },
      {
        statusCode: 404,
        body: {
          error_message: `Experiment with expid '${expid}' not found.`,
        },
      },
    ).as("jobsError");

    cy.visit(`/experiment/${expid}/quick`);

    cy.wait("@jobsError");

    cy.get(".alert-danger")
      .should("be.visible")
      .and(
        "contain.text",
        `Experiment with expid '${expid}' not found.`,
      );
  });
});
