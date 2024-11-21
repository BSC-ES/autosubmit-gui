describe("login", () => {
  const expid = "a000";

  it("error login", () => {
    cy.intercept(
      "GET",
      Cypress.env("EXTERNAL_API") + `/v4/auth/verify-token`,
      {
        statusCode: 401
      }
    ).as("dummy_response");

    // intercept any login
    cy.intercept(
      "GET",
      Cypress.env("EXTERNAL_API") + `/v4/auth/**/login*`,
      {
        statusCode: 401
      }
    ).as("dummy_login_response");

    cy.visit(`/login?ticket=invalid_ticket`);
    cy.wait(750);

    // span with alert alert-danger should exist
    cy.get(".alert.alert-danger").should("exist");
  })

  it("successful login", () => {
    cy.intercept(
      "GET",
      Cypress.env("EXTERNAL_API") + `/v4/auth/verify-token`,
      {
        statusCode: 200
      }
    ).as("dummy_response");

    cy.visit(`/login`);
    cy.wait(500);

    // should be redirected to exactly base url or base url + /
    cy.url().should('match', new RegExp(`^${Cypress.config().baseUrl}/?$`));
  })
}
);