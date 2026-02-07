describe('Home Page', () => {
	beforeEach(() => {
		cy.visit('/');
	});

	it('should load the homepage successfully', () => {
		cy.url().should('include', '/');
	});

	it('should display hero section', () => {
		cy.get('#hero').should('exist');
	});

	it('should display description section', () => {
		cy.get('#description').should('exist');
	});

	it('should display knowledge section', () => {
		cy.get('#knowledge').should('exist');
	});

	it('should display portfolio section', () => {
		cy.get('#portfolio').should('exist');
	});

	it('should display blog section', () => {
		cy.get('#blog').should('exist');
	});

	it('should have working navigation sidebar on desktop', () => {
		cy.viewport(1280, 720);
		cy.get('aside').should('be.visible');
	});

	it('should scroll to sections when navigation is clicked', () => {
		cy.viewport(1280, 720);
		
		cy.get('[aria-label*="Навыки"]').click();
		cy.get('#knowledge').should('be.visible');
	});

	it('should display header with logo', () => {
		cy.get('header').should('be.visible');
	});

	it('should display footer', () => {
		cy.scrollTo('bottom');
		cy.get('footer').should('be.visible');
	});

	it('should be responsive on mobile', () => {
		cy.viewport(375, 667);
		cy.get('#hero').should('be.visible');
	});

	it('should hide sidebar on mobile', () => {
		cy.viewport(375, 667);
		cy.get('aside').should('not.be.visible');
	});
});

describe('Theme Switching', () => {
	beforeEach(() => {
		cy.visit('/');
	});

	it('should have theme toggle button', () => {
		cy.get('[data-testid="theme-toggle"]').should('exist');
	});

	it('should toggle between themes', () => {
		cy.get('[data-testid="theme-toggle"]').then($toggle => {
			if ($toggle.length > 0) {
				cy.wrap($toggle).click();
				// Check that theme changed
				cy.get('html').should($html => {
					const hasTheme =
						$html.hasClass('dark') || $html.hasClass('light');
					expect(hasTheme, 'theme class').to.eq(true);
				});
			}
		});
	});
});

describe('Language Switching', () => {
	it('should switch to English', () => {
		cy.visit('/ru');
		cy.get('[data-testid="lang-switcher"]').then($switcher => {
			if ($switcher.length > 0) {
				cy.wrap($switcher).click();
				cy.get('[data-testid="lang-en"]').click();
				cy.url().should('include', '/en');
			}
		});
	});

	it('should switch to Russian', () => {
		cy.visit('/en');
		cy.get('[data-testid="lang-switcher"]').then($switcher => {
			if ($switcher.length > 0) {
				cy.wrap($switcher).click();
				cy.get('[data-testid="lang-ru"]').click();
				cy.url().should('include', '/ru');
			}
		});
	});

	it('should persist language preference', () => {
		cy.visit('/en');
		cy.reload();
		cy.url().should('include', '/en');
	});
});

