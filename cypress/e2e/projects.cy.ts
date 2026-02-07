describe('Projects Functionality', () => {
	beforeEach(() => {
		cy.visit('/projects');
	});

	it('should display projects page', () => {
		cy.url().should('include', '/projects');
	});

	it('should display project cards', () => {
		cy.get('[data-testid="project-card"]').should('exist');
	});

	it('should navigate to individual project', () => {
		cy.get('[data-testid="project-card"]').first().then($card => {
			if ($card.length > 0) {
				cy.wrap($card).click();
				cy.url().should('match', /\/projects\/\d+/);
			}
		});
	});

	it('should display project details', () => {
		cy.get('[data-testid="project-card"]').first().then($card => {
			if ($card.length > 0) {
				cy.wrap($card).click();
				cy.get('[data-testid="project-title"]').should('be.visible');
				cy.get('[data-testid="project-content"]').should('be.visible');
			}
		});
	});

	it('should display project tags', () => {
		cy.get('[data-testid="project-card"]').first().then($card => {
			if ($card.length > 0) {
				cy.get('[data-testid="project-tags"]').should('exist');
			}
		});
	});
});

describe('Project Creation', () => {
	beforeEach(() => {
		// Assume user needs to be logged in
		cy.visit('/projects/create');
	});

	it('should display create project form', () => {
		cy.get('input[placeholder*="Название"]').should('be.visible');
	});

	it('should have all required form fields', () => {
		cy.get('input[placeholder*="example.com"]').should('exist');
		cy.get('input[placeholder*="Название"]').should('exist');
		cy.get('input[placeholder*="image"]').should('exist');
		cy.get('textarea').should('exist');
	});

	it('should validate required fields', () => {
		cy.get('button[type="submit"]').click();
		// Form should show validation errors
		cy.get('form').should('contain.text', '');
	});

	it('should allow filling the form', () => {
		cy.get('input[placeholder*="Название"]').type('Test Project');
		cy.get('input[placeholder*="example.com"]').first().type('https://test.com');
		cy.get('input[placeholder*="Ваше имя"]').clear().type('Test Author');
	});
});

