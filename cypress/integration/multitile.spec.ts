import { dragTiles, clickTile } from "../lib/tiles";
import { template } from "../lib/template";

describe("z-levels", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("writes multitile buildings in one click", () => {
    cy.visit("/");
    cy.getId({ name: "tool", item: "paint-rectangle" }).click();
    cy.getId("stage").then(
      dragTiles({ startX: 1, startY: 1, endX: 3, endY: 3 }),
    );
    cy.getId({ name: "tool", item: "paint" }).click();
    cy.getId({ name: "phase", item: "build" }).click();
    cy.getId({ name: "command", item: "farmersWorkshop" }).click();

    cy.getId("stage").then(clickTile({ x: 1, y: 1 }));
    cy.getId("export").click();
    cy.getId({ name: "export-text", item: "build" }).should(
      "have.value",
      template(`
        #build
        ww,ww,ww
        ww,ww,ww
        ww,ww,ww`),
    );
  });

  it("erases multitile buildings when clicking on the origin", () => {
    cy.visit("/");
    cy.getId({ name: "tool", item: "paint-rectangle" }).click();
    cy.getId("stage").then(
      dragTiles({ startX: 1, startY: 1, endX: 3, endY: 3 }),
    );
    cy.getId({ name: "tool", item: "paint" }).click();
    cy.getId({ name: "phase", item: "build" }).click();
    cy.getId({ name: "command", item: "farmersWorkshop" }).click();

    cy.getId("stage").then(clickTile({ x: 1, y: 1 }));
    cy.getId("export").click();
    cy.getId({ name: "export-text", item: "build" }).should(
      "have.value",
      template(`
        #build
        ww,ww,ww
        ww,ww,ww
        ww,ww,ww`),
    );
    cy.getId({ name: "tool", item: "erase" }).click();
    cy.getId("stage").then(clickTile({ x: 1, y: 1 }));
    cy.getId({ name: "export-text", item: "build" }).should("not.exist");
  });

  it("erases multitile buildings when clicking other tiles", () => {
    cy.visit("/");
    cy.getId({ name: "tool", item: "paint-rectangle" }).click();
    cy.getId("stage").then(
      dragTiles({ startX: 1, startY: 1, endX: 3, endY: 3 }),
    );
    cy.getId({ name: "tool", item: "paint" }).click();
    cy.getId({ name: "phase", item: "build" }).click();
    cy.getId({ name: "command", item: "farmersWorkshop" }).click();

    cy.getId("stage").then(clickTile({ x: 1, y: 1 }));
    cy.getId("export").click();
    cy.getId({ name: "export-text", item: "build" }).should(
      "have.value",
      template(`
        #build
        ww,ww,ww
        ww,ww,ww
        ww,ww,ww`),
    );
    cy.getId({ name: "tool", item: "erase" }).click();
    cy.getId("stage").then(clickTile({ x: 3, y: 3 }));
    cy.getId({ name: "export-text", item: "build" }).should("not.exist");
  });
});
