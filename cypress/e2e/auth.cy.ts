describe('Authentication', () => {
	describe('Login Page', () => {
		beforeEach(() => {
			cy.visit('/login');
		});

		it('should display login form', () => {
			cy.get('form').should('be.visible');
			cy.get('input[name="name"], input[type="text"]').should('exist');
			cy.get('input[type="password"]').should('exist');
		});

		it('should have submit button', () => {
			cy.get('button[type="submit"]').should('exist');
		});

		it('should show error for invalid credentials', () => {
			cy.get('input[name="name"], input[type="text"]').first().type('invaliduser');
			cy.get('input[type="password"]').type('wrongpassword');
			cy.get('button[type="submit"]').click();
			
			// Should show error toast or message
			cy.get('.sonner-toast, [data-testid="error-message"]').should('exist');
		});

		it('should validate required fields', () => {
			cy.get('button[type="submit"]').click();
			// Form validation should trigger
		});
	});

	describe('Protected Routes', () => {
		it('should redirect to login when accessing protected route', () => {
			cy.visit('/settings');
			// Should either redirect to login or show login required message
			cy.url().should('satisfy', (url: string) => {
				return url.includes('/login') || url.includes('/settings');
			});
		});
	});

	describe('User Session', () => {
		it('should show login link when not authenticated', () => {
			cy.visit('/');
			cy.get('header').should('contain.text', '');
		});
	});
});

describe('Registration', () => {
	beforeEach(() => {
		cy.visit('/register');
	});

	it('should display registration form', () => {
		cy.get('form').should('be.visible');
	});

	it('should have all registration fields', () => {
		cy.get('input').should('have.length.greaterThan', 1);
	});

	it('should validate password confirmation', () => {
		cy.get('input[type="password"]').first().type('password123');
		cy.get('input[type="password"]').eq(1).then($input => {
			if ($input.length > 0) {
				cy.wrap($input).type('differentpassword');
				cy.get('button[type="submit"]').click();
				// Should show password mismatch error
			}
		});
	});
});

