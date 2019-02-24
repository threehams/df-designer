import { triggerHotkeys } from "../lib/hotkeys";
import { clickTile, setTiles } from "../lib/tiles";

describe("adjustments", () => {
  describe("bedroom", () => {
    beforeEach(() => {
      setTiles([
        {
          id: "1,1",
          designation: "mine",
          item: "bed",
        },
      ]);
      cy.visit("/");
      cy.getId("tool", "select").click();
      cy.getId("stage").then(clickTile({ x: 1, y: 1 }));
    });

    it("deselects when pressing esc", () => {
      cy.getId("stage").then(triggerHotkeys("esc"));
      cy.getId("adjustment-bar-item-name").should("not.exist");
    });

    it("shows the correct adjustments", () => {
      cy.getId("adjustment-bar-item-name").should("have.text", "Bed");
      cy.getId("adjustment-bar-check", "makeBedroom").should("exist");
    });

    describe("without resize", () => {
      it("exports the correct string", () => {
        cy.getId("adjustment-bar-check", "makeBedroom").check();
        cy.getId("export").click();
        cy.getId("export-text", "query").should("have.value", "#query\nr");
      });
    });

    describe("with resize", () => {
      it("exports the correct string", () => {
        cy.getId("adjustment-bar-check", "makeBedroom").check();
        cy.getId("adjustment-bar-increment", "makeBedroom")
          .click()
          .click();
        cy.getId("export").click();
        cy.getId("export-text", "query").should("have.value", "#query\nr++");
        cy.getId("adjustment-bar-decrement", "makeBedroom")
          .click()
          .click()
          .click()
          .click();
        cy.getId("export-text", "query").should("have.value", "#query\nr--");
      });
    });
  });

  describe("stockpile", () => {
    beforeEach(() => {
      setTiles([
        {
          id: "1,1",
          designation: "mine",
          item: "foodStockpile",
        },
      ]);
      cy.visit("/");
      cy.getId("tool", "select").click();
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
