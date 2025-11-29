describe('Blog Functionality', () => {
  beforeEach(() => {
    cy.visit('/blog');
  });

  it('should display blog posts on the page', () => {
    cy.get('[data-testid="blog-post"]').should('have.length.greaterThan', 0);
  });

  it('should navigate to individual blog post', () => {
    cy.get('[data-testid="blog-post"]').first().click();
    cy.url().should('match', /\/blog\/\d+/);
  });

  it('should display blog post content', () => {
    cy.get('[data-testid="blog-post"]').first().click();
    cy.get('[data-testid="blog-content"]').should('be.visible');
    cy.get('[data-testid="blog-title"]').should('be.visible');
  });

  it('should allow commenting on blog posts', () => {
    cy.get('[data-testid="blog-post"]').first().click();

    cy.get('[data-testid="comment-form"]').should('be.visible');
    cy.get('[data-testid="comment-input"]').type('This is a test comment');
    cy.get('[data-testid="submit-comment"]').click();

    cy.get('[data-testid="comments-list"]').should('contain', 'This is a test comment');
  });

  it('should handle blog pagination', () => {
    // Check if pagination exists and works
    cy.get('[data-testid="pagination"]').then($pagination => {
      if ($pagination.length > 0) {
        cy.get('[data-testid="pagination-next"]').click();
        cy.url().should('include', 'page=');
      }
    });
  });
});
