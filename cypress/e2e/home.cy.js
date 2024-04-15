describe("Home Page Search Flow", () => {
  const expid = "a0it";

  beforeEach(() => {
    cy.intercept("GET", Cypress.env("EXTERNAL_API") + "/v4/experiments*", {
      fixture: "api/v4/experiments/oneresult.json",
    }).as("dummy_response");

    cy.visit("/");
  });

  it("Write and clear filter", () => {
    cy.get("#search-input").type(expid);
    cy.get("#search-btn").click();
    cy.url().should("include", `query=${expid}`);
    cy.url().should("include", `page=1`);

    cy.get("#search-clear").click();
    cy.url().should("not.include", `query=${expid}`);
    cy.url().should("include", `page=1`);

    cy.get("#search-input").type(expid).type("{enter}");
    cy.url().should("include", `query=${expid}`);
    cy.url().should("include", `page=1`);
  });

  it("Other controls submit text input", () => {
    cy.get("#search-input").type(expid);
    cy.get("#experiment-type-select").select("Experiment");
    cy.url().should("include", `query=${expid}`);
    cy.url().should("include", `exp_type=experiment`);

    cy.get("#search-clear").click();
    cy.get("#search-input").type(expid);
    cy.get("#only-active-switch").click();
    cy.url().should("include", `query=${expid}`);
    cy.url().should("include", `only_active=false`);
  });
});

describe("Navigation buttons", () => {
  const expid = "a0it";

  beforeEach(() => {
    cy.intercept("GET", Cypress.env("EXTERNAL_API") + "/v4/experiments*", {
      fixture: "api/v4/experiments/fullpage.json",
    }).as("dummy_response");

    cy.visit("/");
  });

  it("Navigate to dropdown quick", () => {
    cy.get("i.fa-ellipsis-vertical").first().click();
    cy.get(
      `[href="/experiment/${expid}/quick"][data-radix-collection-item`
    ).click();
    cy.url().should("include", `/experiment/${expid}/quick`);
  });

  it("Navigate to dropdown graph", () => {
    cy.get("i.fa-ellipsis-vertical").first().click();
    cy.get(
      `[href="/experiment/${expid}/graph"][data-radix-collection-item`
    ).click();
    cy.url().should("include", `/experiment/${expid}/graph`);
  });

  it("Navigate to dropdown tree", () => {
    cy.get("i.fa-ellipsis-vertical").first().click();
    cy.get(
      `[href="/experiment/${expid}/tree"][data-radix-collection-item`
    ).click();
    cy.url().should("include", `/experiment/${expid}/tree`);
  });
});
