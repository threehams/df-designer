/// <reference types="cypress" />
import { clickTile } from "../lib/tiles";

describe("z-levels", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("paints with undo/redo across z-levels", () => {
    cy.getId("export").click();
    cy.getId("tool-paint").click();
    cy.getId("stage").then(clickTile({ x: 1, y: 1 }));
    cy.getId("stage").then(clickTile({ x: 2, y: 1 }));
    cy.getId("export-text-dig").should("have.value", "#dig\nd,d");
    cy.getId("z-level-up").click();
    cy.getId("undo").click();
    cy.getId("z-level-down").click();
    cy.getId("export-text-dig").should("have.value", "#dig\nd");
    cy.getId("z-level-up").click();
    cy.getId("redo").click();
    cy.getId("z-level-down").click();
    cy.getId("export-text-dig").should("have.value", "#dig\nd,d");
  });

  it("exports across z-levels", () => {
    cy.getId("export").click();
    cy.getId("tool-paint").click();
    cy.getId("stage").then(clickTile({ x: 1, y: 1 }));
    cy.getId("z-level-up").click();
    cy.getId("stage").then(clickTile({ x: 2, y: 1 }));
    cy.getId("export-text-dig").should(
      "have.value",
      `#dig
\`,d
#>
d,\``,
    );
  });
});
