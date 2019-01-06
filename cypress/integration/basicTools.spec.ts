/// <reference types="cypress" />
import keycode from "keycode";
import { Coords, SelectedCoords } from "../../store/tool";

const TILE_SIZE = 16;

const coordinates = (x: number, y: number) => {
  return {
    x: (x + 0.5) * TILE_SIZE,
    y: (y + 0.5) * TILE_SIZE,
  };
};

const path = (selection: SelectedCoords) => {
  const steps = [];
  for (let x = selection.startX; x <= selection.endX; x++) {
    steps.push({ x, y: selection.startY });
  }
  for (let y = selection.startY; y <= selection.endY; y++) {
    steps.push({ x: selection.endX, y });
  }
  return steps;
};

const clickTile = (subject: string, { x, y }: Coords) => {
  cy.get(subject)
    .trigger("pointerdown", {
      ...coordinates(x, y),
      buttons: 1,
    })
    .trigger("pointerup", coordinates(x, y));
};

const dragTiles = (subject: string, selection: SelectedCoords) => {
  cy.get(subject).trigger("pointerdown", {
    ...coordinates(selection.startX, selection.startY),
    buttons: 1,
  });
  cy.wrap(path(selection)).each((coords: Coords) => {
    cy.get(subject).trigger("pointermove", {
      ...coordinates(coords.x, coords.y),
      buttons: 1,
    });
  });
  cy.get(subject).trigger(
    "pointerup",
    coordinates(selection.endX, selection.endY),
  );
};

describe("Artboard", function() {
  beforeEach(function() {
    cy.visit("http://localhost:3000");
  });

  describe("export", function() {
    beforeEach(function() {
      cy.get("[data-test=export]").click();
    });

    it("paints a single tile", function() {
      cy.get("[data-test=tool-paint]").click();
      clickTile("[data-test=stage]", { x: 1, y: 1 });
      cy.get("[data-test=export-text-dig]").should("have.value", "#dig\nd");
    });

    it("paints a series of tiles", function() {
      cy.get("[data-test=tool-paint]").click();
      dragTiles("[data-test=stage]", {
        startX: 1,
        startY: 1,
        endX: 3,
        endY: 1,
      });
      cy.get("[data-test=export-text-dig]").should("have.value", "#dig\nd,d,d");
    });

    it("paints a rectangle", function() {
      cy.get("[data-test=tool-paint-rectangle]").click();
      dragTiles("[data-test=stage]", {
        startX: 1,
        startY: 1,
        endX: 4,
        endY: 4,
      });
      cy.get("[data-test=export-text-dig]").should(
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
        dragTiles("[data-test=stage]", {
          startX: 1,
          startY: 1,
          endX: 3,
          endY: 1,
        });
      });

      it("moves a selected area", function() {
        cy.get("[data-test=tool-select]").click();
        // select
        dragTiles("[data-test=stage]", {
          startX: 2,
          startY: 1,
          endX: 3,
          endY: 1,
        });
        // drag
        dragTiles("[data-test=stage]", {
          startX: 2,
          startY: 1,
          endX: 2,
          endY: 2,
        });

        cy.get("[data-test=export-text-dig]").should(
          "have.value",
          `#dig
d,\`,\`
\`,d,d`,
        );
      });

      it("clones a selected area", function() {
        cy.get("[data-test=tool-select]").click();
        dragTiles("[data-test=stage]", {
          startX: 2,
          startY: 1,
          endX: 3,
          endY: 1,
        });
        // drag area
        cy.get("[data-test=stage]").trigger("keydown", {
          keyCode: keycode.codes.shift,
          force: true,
        });
        dragTiles("[data-test=stage]", {
          startX: 2,
          startY: 1,
          endX: 2,
          endY: 2,
        });

        cy.get("[data-test=export-text-dig]").should(
          "have.value",
          `#dig
d,d,d
\`,d,d`,
        );
      });

      it("deletes a selected area", function() {
        cy.get("[data-test=tool-select]").click();
        dragTiles("[data-test=stage]", {
          startX: 2,
          startY: 1,
          endX: 3,
          endY: 1,
        });
        cy.get("[data-test=stage]").trigger("keydown", {
          keyCode: keycode.codes.delete,
          force: true,
        });
        cy.get("[data-test=export-text-dig]").should("have.value", `#dig\nd`);
      });
    });
  });
});
