import { clickTile } from "../lib/tiles";

describe("undo/redo", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("handles an undo/redo stack", () => {
    cy.getId({ name: "tool", item: "paint" }).click();
    cy.getId("export").click();
    cy.getId("stage").then(clickTile({ x: 1, y: 1 }));
    cy.getId("stage").then(clickTile({ x: 2, y: 1 }));
    cy.getId("stage").then(clickTile({ x: 3, y: 1 }));
    cy.getId("export-text").should("have.value", "#dig\nd,d,d");
    cy.getId("undo").click();
    cy.getId("export-text").should("have.value", "#dig\nd,d");
    cy.getId("undo").click();
    cy.getId("export-text").should("have.value", "#dig\nd");
    cy.getId("redo").click();
    cy.getId("export-text").should("have.value", "#dig\nd,d");
    cy.getId("redo").click();
    cy.getId("export-text").should("have.value", "#dig\nd,d,d");
  });
});
