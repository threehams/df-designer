import { clickTile } from "../lib/tiles";

describe("z-levels", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("persists tile state across page loads", () => {
    cy.findByText("Paint").click();
    cy.findByTestId("stage").then(clickTile({ x: 1, y: 1 }));
    cy.findByTestId("stage").then(clickTile({ x: 2, y: 1 }));
    cy.reload();
    cy.findByText("Export").click();
    cy.findByLabelText("dig").should("have.value", "#dig\nd,d");
  });
});
