import { triggerHotkeys } from "../lib/hotkeys";
import { clickTile } from "../lib/tiles";

describe("adjustments", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  describe("bedroom", () => {
    beforeEach(() => {
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

    it("deselects when pressing esc", () => {
      cy.getId("stage").then(triggerHotkeys("esc"));
      cy.getId("adjustment-bar-item-name").should("not.exist");
    });

    it("shows the correct adjustments", () => {
      cy.getId("adjustment-bar-item-name").should("have.text", "Bed");
      cy.getId("adjustment-bar-makeBedroom-check").should("exist");
    });

    describe("without resize", () => {
      it("exports the correct string", () => {
        cy.getId("adjustment-bar-makeBedroom-check").check();
        cy.getId("export").click();
        cy.getId("export-text-query").should("have.value", "#query\nr");
      });
    });

    describe("with resize", () => {
      it("exports the correct string", () => {
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

  describe("stockpile", () => {
    beforeEach(() => {
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

    it("shows the item name", () => {
      cy.getId("adjustment-bar-item-name").should(
        "have.text",
        "Food Stockpile",
      );
    });
  });
});
