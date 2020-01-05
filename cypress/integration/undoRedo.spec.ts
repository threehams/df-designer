import { clickTile } from "../lib/tiles";

describe("undo/redo", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("handles an undo/redo stack", () => {
    cy.findByText("Paint").click();
    cy.findByText("Export").click();
    cy.findByTestId("stage").then(clickTile({ x: 1, y: 1 }));
    cy.findByTestId("stage").then(clickTile({ x: 2, y: 1 }));
    cy.findByTestId("stage").then(clickTile({ x: 3, y: 1 }));
    cy.findByLabelText("dig").should("have.value", "#dig\nd,d,d");
    cy.findByText("Undo").click();
    cy.findByLabelText("dig").should("have.value", "#dig\nd,d");
    cy.findByText("Undo").click();
    cy.findByLabelText("dig").should("have.value", "#dig\nd");
    cy.findByText("Redo").click();
    cy.findByLabelText("dig").should("have.value", "#dig\nd,d");
    cy.findByText("Redo").click();
    cy.findByLabelText("dig").should("have.value", "#dig\nd,d,d");
  });

  it("handles undo across z-levels", () => {
    cy.findByText("Paint").click();
    cy.findByText("Export").click();
    cy.findByTestId("stage").then(clickTile({ x: 1, y: 1 }));
    cy.findByText("Down Level").click();
    cy.findByTestId("stage").then(clickTile({ x: 2, y: 1 }));
    cy.findByText("Up Level").click();
    cy.findByText("Undo").click();
    cy.findByLabelText("dig").should("have.value", "#dig\nd");
  });
});
