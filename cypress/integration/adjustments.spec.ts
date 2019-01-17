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
      cy.getId("adjustment-bar-makeBedroom-check").should("exist");
    });

    describe("without resize", function() {
      it("exports the correct string", function() {
        cy.getId("adjustment-bar-makeBedroom-check").check();
        cy.getId("export").click();
        cy.getId("export-text-query").should("have.value", "#query\nr");
      });
    });

    describe("with resize", function() {
      it("exports the correct string", function() {
        cy.getId("adjustment-bar-makeBedroom-check").check();
        cy.getId("adjustment-bar-makeBedroom-increment")
          .click()
          .click();
        cy.getId("export").click();
        cy.getId("export-text-query").should("have.value", "#query\nr++");
        cy.getId("adjustment-bar-makeBedroom-decrement")
          .click()
          .click()
          .click()
          .click();
        cy.getId("export-text-query").should("have.value", "#query\nr--");
      });
    });
  });

  describe("stockpile", function() {
    beforeEach(function() {
      cy.getId("tool-paint").click();
      cy.getId("phase-dig").click();
      cy.getId("command-mine").click();
      cy.getId("stage").then(clickTile({ x: 1, y: 1 }));
      cy.getId("phase-place").click();
      cy.getId("command-foodStockpile").click();
      cy.getId("stage").then(clickTile({ x: 1, y: 1 }));
      cy.getId("tool-select").click();
      cy.getId("stage").then(clickTile({ x: 1, y: 1 }));
    });

    it("shows the item name", function() {
      cy.getId("adjustment-bar-item-name").should(
        "have.text",
        "Food Stockpile",
      );
    });
  });
});
