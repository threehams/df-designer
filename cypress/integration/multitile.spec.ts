import { dragTiles, clickTile } from "../lib/tiles";

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
      `#build
ww,ww,ww
ww,ww,ww
ww,ww,ww`,
    );
  });
});
