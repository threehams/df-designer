import { triggerHotkeys } from "../lib/hotkeys";
import { clickTile } from "../lib/tiles";
import { template } from "../lib/template";

describe("z-levels", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("paints with undo/redo across z-levels", () => {
    cy.findByText("Export").click();
    cy.findByText("Paint").click();
    cy.findByTestId("stage").then(clickTile({ x: 1, y: 1 }));
    cy.findByTestId("stage").then(clickTile({ x: 2, y: 1 }));
    cy.findByLabelText("dig").should(
      "have.value",
      template(`
        #dig
        d,d`),
    );
    cy.findByText("Up Level").click();
    cy.findByTitle("Z Level").should("have.text", "65");
    cy.findByText("Undo").click();
    cy.findByText("Down Level").click();
    cy.findByTitle("Z Level").should("have.text", "64");
    cy.findByLabelText("dig").should("have.value", "#dig\nd");
    cy.findByText("Up Level").click();
    cy.findByTitle("Z Level").should("have.text", "65");
    cy.findByText("Redo").click();
    cy.findByText("Down Level").click();
    cy.findByTitle("Z Level").should("have.text", "64");
    cy.findByLabelText("dig").should("have.value", "#dig\nd,d");
  });

  it("allows hotkeys for changing z-levels", () => {
    cy.findByText("Export").click();
    cy.findByText("Paint").click();
    cy.findByTestId("stage").then(clickTile({ x: 1, y: 1 }));
    cy.findByLabelText("dig").should("have.value", "#dig\nd");
    cy.findByTestId("stage").then(triggerHotkeys(["shift", "."]));
    cy.findByTitle("Z Level").should("have.text", "63");
    cy.findByTestId("stage").then(triggerHotkeys(["shift", ","]));
    cy.findByTitle("Z Level").should("have.text", "64");
  });

  it("exports across z-levels", () => {
    cy.findByText("Export").click();
    cy.findByText("Paint").click();
    cy.findByTestId("stage").then(clickTile({ x: 1, y: 1 }));
    cy.findByText("Up Level").click();
    cy.findByTitle("Z Level").should("have.text", "65");
    cy.findByTestId("stage").then(clickTile({ x: 2, y: 1 }));
    cy.findByLabelText("dig").should(
      "have.value",
      template(`
        #dig
        ~,d
        #>
        d,~`),
    );
  });
});
