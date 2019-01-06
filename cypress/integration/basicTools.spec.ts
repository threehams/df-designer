/// <reference types="cypress" />
import keycode from "keycode";
import { clickTile, dragTiles } from "../lib/tiles";

describe("Artboard", function() {
  beforeEach(function() {
    cy.visit("http://localhost:3000");
  });

  describe("export", function() {
    beforeEach(function() {
      cy.getId("export").click();
    });

    it("paints a single tile", function() {
      cy.getId("tool-paint").click();
      cy.getId("stage").then(clickTile({ x: 1, y: 1 }));
      cy.getId("export-text-dig").should("have.value", "#dig\nd");
    });

    it("paints a series of tiles", function() {
      cy.getId("tool-paint").click();
      cy.getId("stage").then(
        dragTiles({
          startX: 1,
          startY: 1,
          endX: 3,
          endY: 1,
        }),
      );
      cy.getId("export-text-dig").should("have.value", "#dig\nd,d,d");
    });

    it("paints a rectangle", function() {
      cy.getId("tool-paint-rectangle").click();
      cy.getId("stage").then(
        dragTiles({
          startX: 1,
          startY: 1,
          endX: 4,
          endY: 4,
        }),
      );
      cy.getId("export-text-dig").should(
        "have.value",
        `#dig
d,d,d,d
d,d,d,d
d,d,d,d
d,d,d,d`,
      );
    });

    describe("Select", function() {
      beforeEach(function() {
        cy.getId("stage").then(
          dragTiles({
            startX: 1,
            startY: 1,
            endX: 3,
            endY: 1,
          }),
        );
      });

      it("moves a selected area", function() {
        cy.getId("tool-select").click();
        // select
        cy.getId("stage")
          .then(
            dragTiles({
              startX: 2,
              startY: 1,
              endX: 3,
              endY: 1,
            }),
          )
          .then(
            dragTiles({
              startX: 2,
              startY: 1,
              endX: 2,
              endY: 2,
            }),
          );
        cy.getId("export-text-dig").should(
          "have.value",
          `#dig
d,\`,\`
\`,d,d`,
        );
      });

      it("clones a selected area", function() {
        cy.getId("tool-select").click();
        cy.getId("stage")
          .then(
            dragTiles({
              startX: 2,
              startY: 1,
              endX: 3,
              endY: 1,
            }),
          )
          .trigger("keydown", {
            keyCode: keycode.codes.shift,
            force: true,
          })
          .then(
            dragTiles({
              startX: 2,
              startY: 1,
              endX: 2,
              endY: 2,
            }),
          );

        cy.getId("export-text-dig").should(
          "have.value",
          `#dig
d,d,d
\`,d,d`,
        );
      });

      it("deletes a selected area", function() {
        cy.getId("tool-select").click();
        cy.getId("stage")
          .then(
            dragTiles({
              startX: 2,
              startY: 1,
              endX: 3,
              endY: 1,
            }),
          )
          .trigger("keydown", {
            keyCode: keycode.codes.delete,
            force: true,
          });
        cy.getId("export-text-dig").should("have.value", `#dig\nd`);
      });
    });
  });
});
