import { triggerHotkeys } from "../lib/hotkeys";
import { clickTile, setTiles } from "../lib/tiles";

describe("adjustments", () => {
  describe("bedroom", () => {
    beforeEach(() => {
      setTiles([
        {
          id: "1,1",
          coordinates: { x: 1, y: 1 },
          designation: "mine",
          item: "bed",
        },
      ]);
      cy.visit("/");
      cy.findByText("Select").click();
      cy.findByTestId("stage").then(clickTile({ x: 1, y: 1 }));
    });

    it("deselects when pressing esc", () => {
      cy.findByTestId("stage").then(triggerHotkeys("esc"));
      cy.findByTestId("adjustment-bar").should("not.exist");
    });

    it("shows the correct adjustments", () => {
      cy.findByTestId("adjustment-bar").should("contain.text", "Bed");
      cy.findByLabelText("Make Bedroom").should("exist");
    });

    describe("without resize", () => {
      it("exports the correct string", () => {
        cy.findByLabelText("Make Bedroom").check();
        cy.findByText("Export").click();
        cy.findByLabelText("query").should("have.value", "#query\nr");
      });
    });

    describe("with resize", () => {
      it("exports the correct string", () => {
        cy.findByLabelText("Make Bedroom").check();
        cy.findByLabelText("Increment Make Bedroom Size")
          .click()
          .click();
        cy.findByText("Export").click();
        cy.findByLabelText("query").should("have.value", "#query\nr++");
        cy.findByLabelText("Decrement Make Bedroom Size")
          .click()
          .click()
          .click()
          .click();
        cy.findByLabelText("query").should("have.value", "#query\nr--");
      });
    });
  });

  describe("stockpile", () => {
    beforeEach(() => {
      setTiles([
        {
          id: "1,1",
          coordinates: { x: 1, y: 1 },
          designation: "mine",
          item: "foodStockpile",
        },
      ]);
      cy.visit("/");
      cy.findByText("Select").click();
      cy.findByTestId("stage").then(clickTile({ x: 1, y: 1 }));
    });

    it("shows the item name", () => {
      cy.findByTestId("adjustment-bar").should(
        "contain.text",
        "Food Stockpile",
      );
    });
  });
});
