import { clickTile } from "../lib/tiles";

describe("z-levels", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("persists tile state across page loads", () => {
    cy.getId("tool", "paint").click();
    cy.getId("stage").then(clickTile({ x: 1, y: 1 }));
    cy.getId("stage").then(clickTile({ x: 2, y: 1 }));
    cy.reload();
    cy.getId("export").click();
    cy.getId("export-text", "dig").should(
      "have.value",
      `#dig
d,d`
    );
  });
});
