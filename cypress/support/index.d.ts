/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject> {
    /**
     * Get an element by data-test attribute.
     * @example
     * cy.getId("print-button")
     */
    getId<S = any>(
      id: string,
      options?: Partial<Loggable & Timeoutable>,
    ): Chainable<S>;
  }
}
