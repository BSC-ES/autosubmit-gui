describe('Initial', () => {
  beforeEach(() => {
    cy.byPassAuth();
  });

  it('Webserver is working', () => {
    cy.visit('/')
  })

  it('About page is working', () => {
    cy.visit('/about')
  })

  it('404 page is working', () => {
    cy.visit('/404')
  })
})
