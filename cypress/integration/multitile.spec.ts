import { dragTiles, clickTile } from "../lib/tiles";
import { template } from "../lib/template";

describe("z-levels", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("writes multitile buildings in one click", () => {
    cy.visit("/");
    cy.findByText("Paint Rectangle").click();
    cy.findByTestId("stage").then(
      dragTiles({ startX: 1, startY: 1, endX: 3, endY: 3 }),
    );
    cy.findByText("Paint").click();
    cy.findByText("Build").click();
    cy.findByText("Farmer's Workshop").click();

    cy.findByTestId("stage").then(clickTile({ x: 1, y: 1 }));
    cy.findByText("Export").click();
    cy.findByLabelText("build").should(
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
    cy.findByText("Paint Rectangle").click();
    cy.findByTestId("stage").then(
      dragTiles({ startX: 1, startY: 1, endX: 3, endY: 3 }),
    );
    cy.findByText("Paint").click();
    cy.findByText("Build").click();
    cy.findByText("Farmer's Workshop").click();

    cy.findByTestId("stage").then(clickTile({ x: 1, y: 1 }));
    cy.findByText("Export").click();
    cy.findByLabelText("build").should(
      "have.value",
      template(`
        #build
        ww,ww,ww
        ww,ww,ww
        ww,ww,ww`),
    );
    cy.findByText("Erase").click();
    cy.findByTestId("stage").then(clickTile({ x: 1, y: 1 }));
    cy.findByLabelText("build").should("not.exist");
  });

  it("erases multitile buildings when clicking other tiles", () => {
    cy.visit("/");
    cy.findByText("Paint Rectangle").click();
    cy.findByTestId("stage").then(
      dragTiles({ startX: 1, startY: 1, endX: 3, endY: 3 }),
    );
    cy.findByText("Paint").click();
    cy.findByText("Build").click();
    cy.findByText("Farmer's Workshop").click();

    cy.findByTestId("stage").then(clickTile({ x: 1, y: 1 }));
    cy.findByText("Export").click();
    cy.findByLabelText("build").should(
      "have.value",
      template(`
        #build
        ww,ww,ww
        ww,ww,ww
        ww,ww,ww`),
    );
    cy.findByText("Erase").click();
    cy.findByTestId("stage").then(clickTile({ x: 3, y: 3 }));
    cy.findByLabelText("build").should("not.exist");
  });
});
