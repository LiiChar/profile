// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

/// <reference types="cypress" />

// Custom command to login (if needed in the future)
// Cypress.Commands.add('login', (email: string, password: string) => {
//   cy.visit('/login');
//   cy.get('[data-testid="email"]').type(email);
//   cy.get('[data-testid="password"]').type(password);
//   cy.get('[data-testid="login-button"]').click();
// });

declare global {
  namespace Cypress {
    interface Chainable {
      // login(email: string, password: string): Chainable<void>
    }
  }
}

export {};
