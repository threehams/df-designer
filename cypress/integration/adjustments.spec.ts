/// <reference types="cypress" />
import { clickTile } from "../lib/tiles";

describe("adjustments", function() {
  beforeEach(function() {
    cy.visit("http://localhost:3000");
  });

  describe("bedroom", function() {
    beforeEach(function() {
      cy.getId("tool-paint").click();
      cy.getId("phase-dig").click();
      cy.getId("command-mine").click();
      cy.getId("stage").then(clickTile({ x: 1, y: 1 }));
      cy.getId("phase-build").click();
      cy.getId("command-bed").click();
      cy.getId("stage").then(clickTile({ x: 1, y: 1 }));
      cy.getId("tool-select").click();
      cy.getId("stage").then(clickTile({ x: 1, y: 1 }));
    });

    it("shows the item name", function() {
      cy.getId("adjustment-bar-item-name").should("have.text", "Bed");
    });

    it("shows the correct adjustments", function() {
      cy.getId("adjustment-bar-input-makeBedroom").should("exist");
    });

    it("exports the correct string", function() {
      cy.getId("adjustment-bar-input-makeBedroom").check();
      cy.getId("export").click();
      cy.getId("export-text-query").should("have.value", "#query\nr");
    });
  });
});
