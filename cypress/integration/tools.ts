/// <reference types="cypress" />
import keycode from "keycode";
import { clickTile, dragTiles } from "../lib/tiles";

describe("tools", function() {
  beforeEach(function() {
    cy.visit("/");
  });

  describe("export", function() {
    beforeEach(function() {
      cy.getId("export").click();
    });

    it("paints a single tile with undo/redo", function() {
      cy.getId("tool-paint").click();
      cy.getId("stage").then(clickTile({ x: 1, y: 1 }));
      cy.getId("export-text-dig").should("have.value", "#dig\nd");
      cy.getId("stage").then(clickTile({ x: 2, y: 1 }));
      cy.getId("export-text-dig").should("have.value", "#dig\nd,d");
      cy.getId("undo").click();
      cy.getId("export-text-dig").should("have.value", "#dig\nd");
      cy.getId("redo").click();
      cy.getId("export-text-dig").should("have.value", "#dig\nd,d");
    });

    it("paints a series of tiles with undo/redo", function() {
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
      cy.getId("stage").then(
        dragTiles({
          startX: 3,
          startY: 1,
          endX: 3,
          endY: 2,
        }),
      );
      cy.getId("export-text-dig").should("have.value", "#dig\nd,d,d\n`,`,d");
      cy.getId("undo").click();
      cy.getId("export-text-dig").should("have.value", "#dig\nd,d,d");
      cy.getId("redo").click();
      cy.getId("export-text-dig").should("have.value", "#dig\nd,d,d\n`,`,d");
    });

    it("paints a rectangle with undo/redo", function() {
      cy.getId("tool-paint-rectangle").click();
      cy.getId("stage").then(
        dragTiles({
          startX: 1,
          startY: 1,
          endX: 3,
          endY: 3,
        }),
      );
      cy.getId("export-text-dig").should(
        "have.value",
        `#dig
d,d,d
d,d,d
d,d,d`,
      );
      cy.getId("stage").then(
        dragTiles({
          startX: 2,
          startY: 2,
          endX: 3,
          endY: 4,
        }),
      );
      cy.getId("export-text-dig").should(
        "have.value",
        `#dig
d,d,d
d,d,d
d,d,d
\`,d,d`,
      );
      cy.getId("undo").click();
      cy.getId("export-text-dig").should(
        "have.value",
        `#dig
d,d,d
d,d,d
d,d,d`,
      );
      cy.getId("redo").click();
      cy.getId("export-text-dig").should(
        "have.value",
        `#dig
d,d,d
d,d,d
d,d,d
\`,d,d`,
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

      it("moves a selected area with undo/redo", function() {
        cy.getId("tool-select").click();
        cy.getId("stage")
          .then(
            // select
            dragTiles({
              startX: 2,
              startY: 1,
              endX: 3,
              endY: 1,
            }),
          )
          .then(
            // drag
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
        cy.getId("undo").click();
        cy.getId("export-text-dig").should("have.value", "#dig\nd,d,d");
        cy.getId("redo").click();
        cy.getId("export-text-dig").should(
          "have.value",
          `#dig
d,\`,\`
\`,d,d`,
        );
      });

      it("clones a selected area with undo/redo", function() {
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
        cy.getId("undo").click();
        cy.getId("export-text-dig").should("have.value", "#dig\nd,d,d");
        cy.getId("redo").click();
        cy.getId("export-text-dig").should(
          "have.value",
          `#dig
d,d,d
\`,d,d`,
        );
      });

      it("deletes a selected area with undo/redo", function() {
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
        cy.getId("undo").click();
        cy.getId("export-text-dig").should("have.value", `#dig\nd,d,d`);
        cy.getId("redo").click();
        cy.getId("export-text-dig").should("have.value", `#dig\nd`);
      });
    });
  });
});
