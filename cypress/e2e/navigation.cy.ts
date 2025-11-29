describe('Navigation', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should load the homepage', () => {
    cy.url().should('include', '/');
    cy.get('[data-testid="hero-section"]').should('be.visible');
  });

  it('should navigate to projects page', () => {
    cy.get('a[href*="projects"]').first().click();
    cy.url().should('include', '/projects');
  });

  it('should navigate between language versions', () => {
    cy.get('[data-testid="lang-switcher"]').should('exist');
    // Assuming there's a language switcher
    cy.get('[data-testid="lang-ru"]').click();
    cy.url().should('include', '/ru');
  });

  it('should handle 404 for invalid routes', () => {
    cy.visit('/non-existent-page');
    cy.get('[data-testid="404-error"]').should('be.visible');
  });
});
