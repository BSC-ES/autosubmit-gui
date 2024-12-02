// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add("byPassAuth", () => {
  window.localStorage.setItem("token", "dummy_token")
  cy.intercept(
    "GET",
    Cypress.env("EXTERNAL_API") + `/v4/auth/verify-token`,
    {
      statusCode: 200,
      body: {
        user: "dummy_user",
        authenticated: true,
      }
    }
  ).as("dummy_authorized_response");
});