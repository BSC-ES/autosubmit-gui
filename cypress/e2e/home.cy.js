
describe('Home Page Search Flow', () => {
    it('Write and clear filter', () => {
        cy.intercept("GET", Cypress.env('EXTERNAL_API') + "/v4/experiments?*", {
            fixture: "api/v4/experiments/oneresult.json"
        }).as("dummy_response")

        cy.visit('/')

        const expid = "a0it"
        cy.get("#search-input").type(expid)
        cy.get("#search-btn").click()
        cy.url().should('include', `query=${expid}`)
        cy.url().should('include', `page=1`)

        cy.get("#search-clear").click()
        cy.url().should('not.include', `query=${expid}`)
        cy.url().should('include', `page=1`)

        cy.get("#search-input").type(expid).type('{enter}')
        cy.url().should('include', `query=${expid}`)
        cy.url().should('include', `page=1`)
    })
})