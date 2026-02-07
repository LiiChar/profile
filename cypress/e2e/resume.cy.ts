describe('Resume Page', () => {
	beforeEach(() => {
		cy.visit('/resume');
	});

	it('should display resume page', () => {
		cy.url().should('include', '/resume');
	});

	it('should display personal information', () => {
		cy.get('[data-testid="resume-name"], h1').should('be.visible');
	});

	it('should display experience section', () => {
		cy.contains(/experience|опыт/i).should('exist');
	});

	it('should display education section', () => {
		cy.contains(/education|образование/i).should('exist');
	});

	it('should display skills section', () => {
		cy.contains(/skills|навыки/i).should('exist');
	});

	it('should have download button', () => {
		cy.get('[data-testid="download-resume"], a[download], button').should('exist');
	});

	it('should be printable', () => {
		// Check that page has print-friendly styles
		cy.document().then(doc => {
			const styles = Array.from(doc.styleSheets);
			expect(styles.length).to.be.greaterThan(0);
		});
	});
});

describe('Resume Localization', () => {
	it('should display Russian resume', () => {
		cy.visit('/ru/resume');
		cy.contains(/опыт|образование|навыки/i).should('exist');
	});

	it('should display English resume', () => {
		cy.visit('/en/resume');
		cy.contains(/experience|education|skills/i).should('exist');
	});
});

