describe("tree navigation", () => {
  const expid = "a6zi";
  before(() => {
    cy.byPassAuth();

    cy.intercept("GET", Cypress.env("EXTERNAL_API") + "/v3/tree/*", {
      fixture: "api/v3/tree/tree_wrappers.json",
    }).as("dummy_response");

    cy.visit(`/experiment/${expid}/table`);
    cy.wait(500);
  });

  it("evaluate content", () => {

    // There is one td tag with text equal to "SIM"
    cy.get("td").contains("SIM").should("exist");

    // There is one td tag that ends with "_SIM"
    cy.get("td").contains(/_SIM$/).should("exist");

    // Get the count of the SIM row in its sibling column
    cy.get("td").contains("SIM").parent().children().eq(1).invoke('text').then((text) => {
      cy.log(text);
      let count = parseInt(text, 10);

      // Get all td tags that contains "_SIM". The total should be equal to count
      cy.get('td').filter((index, element) => {
        return /_SIM$/.test(element.innerText);
      }).should('have.length', count);
    });

  });
});
