import { triggerHotkeys } from "../lib/hotkeys";
import { clickTile, dragTiles, setTiles } from "../lib/tiles";
import { template } from "../lib/template";

describe("tools", () => {
  describe("paint tools", () => {
    beforeEach(() => {
      cy.visit("/");
      cy.findByText("Export").click();
    });

    it("paints a single tile with undo/redo", () => {
      cy.findByText("Paint").click();
      cy.findByTestId("stage").then(clickTile({ x: 1, y: 1 }));
      cy.findByLabelText("dig").should("have.value", "#dig\nd");
      cy.findByTestId("stage").then(clickTile({ x: 2, y: 1 }));
      cy.findByLabelText("dig").should("have.value", "#dig\nd,d");
      cy.findByText("Undo").click();
      cy.findByLabelText("dig").should("have.value", "#dig\nd");
      cy.findByText("Redo").click();
      cy.findByLabelText("dig").should("have.value", "#dig\nd,d");
    });

    it("builds and places with undo/redo", () => {
      cy.findByText("Paint Rectangle").click();
      cy.findByTestId("stage").then(
        dragTiles({ startX: 1, startY: 1, endX: 3, endY: 1 }),
      );
      cy.findByLabelText("dig").should("have.value", "#dig\nd,d,d");

      cy.findByText("Build").click();
      cy.findByText("Bed").click();
      cy.findByTestId("stage").then(clickTile({ x: 2, y: 1 }));
      cy.findByLabelText("build").should("have.value", "#build\n~,b,~");
      cy.findByText("Undo").click();
      cy.findByLabelText("build").should("not.exist");
      cy.findByText("Redo").click();
      cy.findByLabelText("build").should("have.value", "#build\n~,b,~");

      cy.findByText("Place Stockpiles").click();
      cy.findByText("Food Stockpile").click();
      cy.findByTestId("stage").then(clickTile({ x: 3, y: 1 }));
      cy.findByLabelText("place").should("have.value", "#place\n~,~,f");
      cy.findByText("Undo").click();
      cy.findByLabelText("place").should("not.exist");
      cy.findByText("Redo").click();
      cy.findByLabelText("place").should("have.value", "#place\n~,~,f");
    });

    it("paints a series of tiles with undo/redo (including hotkeys)", () => {
      cy.findByText("Paint").click();
      cy.findByTestId("stage").then(
        dragTiles({
          startX: 1,
          startY: 1,
          endX: 3,
          endY: 1,
        }),
      );
      cy.findByLabelText("dig").should("have.value", "#dig\nd,d,d");
      cy.findByTestId("stage").then(
        dragTiles({
          startX: 3,
          startY: 1,
          endX: 3,
          endY: 2,
        }),
      );
      cy.findByLabelText("dig").should("have.value", "#dig\nd,d,d\n~,~,d");
      cy.findByText("Undo").click();
      cy.findByLabelText("dig").should("have.value", "#dig\nd,d,d");
      cy.findByText("Redo").click();
      cy.findByLabelText("dig").should("have.value", "#dig\nd,d,d\n~,~,d");
      cy.findByTestId("stage").then(triggerHotkeys(["ctrl", "z"]));
      cy.findByLabelText("dig").should("have.value", "#dig\nd,d,d");
      cy.findByTestId("stage").then(triggerHotkeys(["ctrl", "shift", "z"]));
      cy.findByLabelText("dig").should("have.value", "#dig\nd,d,d\n~,~,d");
    });

    it("paints a rectangle with undo/redo", () => {
      cy.findByText("Paint Rectangle").click();
      cy.findByTestId("stage").then(
        dragTiles({
          startX: 1,
          startY: 1,
          endX: 3,
          endY: 3,
        }),
      );
      cy.findByLabelText("dig").should(
        "have.value",
        template(`
          #dig
          d,d,d
          d,d,d
          d,d,d`),
      );
      cy.findByTestId("stage").then(
        dragTiles({
          startX: 2,
          startY: 2,
          endX: 3,
          endY: 4,
        }),
      );
      cy.findByLabelText("dig").should(
        "have.value",
        template(`
        #dig
        d,d,d
        d,d,d
        d,d,d
        ~,d,d`),
      );
      cy.findByText("Undo").click();
      cy.findByLabelText("dig").should(
        "have.value",
        template(`
          #dig
          d,d,d
          d,d,d
          d,d,d`),
      );
      cy.findByText("Redo").click();
      cy.findByLabelText("dig").should(
        "have.value",
        template(`
          #dig
          d,d,d
          d,d,d
          d,d,d
          ~,d,d`),
      );
    });

    it("erases tiles with undo/redo", () => {
      cy.findByText("Paint").click();
      cy.findByTestId("stage").then(
        dragTiles({
          startX: 1,
          startY: 1,
          endX: 3,
          endY: 1,
        }),
      );
      cy.findByText("Erase").click();
      cy.findByTestId("stage").then(
        dragTiles({
          startX: 2,
          startY: 1,
          endX: 3,
          endY: 1,
        }),
      );
      cy.findByLabelText("dig").should("have.value", `#dig\nd`);
      cy.findByText("Undo").click();
      cy.findByLabelText("dig").should("have.value", `#dig\nd,d,d`);
      cy.findByText("Redo").click();
      cy.findByLabelText("dig").should("have.value", `#dig\nd`);
    });
  });

  describe("Select", () => {
    beforeEach(() => {
      setTiles([
        {
          id: "1,1",
          coordinates: { x: 1, y: 1 },
          designation: "mine",
        },
        {
          id: "2,1",
          coordinates: { x: 2, y: 1 },
          designation: "mine",
        },
        {
          id: "3,1",
          coordinates: { x: 3, y: 1 },
          designation: "mine",
        },
      ]);
      cy.visit("/");
      cy.findByText("Export").click();
    });

    it("moves a selected area with undo/redo", () => {
      cy.findByText("Select").click();
      cy.findByTestId("stage")
        .then(
          // select
          dragTiles({
            startX: 2,
            startY: 1,
            endX: 3,
            endY: 1,
          }),
        )
        .then(
          // drag
          dragTiles({
            startX: 2,
            startY: 1,
            endX: 2,
            endY: 2,
          }),
        );
      cy.findByLabelText("dig").should(
        "have.value",
        template(`
          #dig
          d,~,~
          ~,d,d`),
      );
      cy.findByText("Undo").click();
      cy.findByLabelText("dig").should("have.value", "#dig\nd,d,d");
      cy.findByText("Redo").click();
      cy.findByLabelText("dig").should(
        "have.value",
        template(`
          #dig
          d,~,~
          ~,d,d`),
      );
    });

    it("clones a selected area with undo/redo", () => {
      cy.findByText("Select").click();
      cy.findByTestId("stage")
        .then(
          dragTiles({
            startX: 2,
            startY: 1,
            endX: 3,
            endY: 1,
          }),
        )
        .then(triggerHotkeys("shift"))
        .then(
          dragTiles({
            startX: 2,
            startY: 1,
            endX: 2,
            endY: 2,
          }),
        );

      cy.findByLabelText("dig").should(
        "have.value",
        template(`
          #dig
          d,d,d
          ~,d,d`),
      );
      cy.findByText("Undo").click();
      cy.findByLabelText("dig").should("have.value", "#dig\nd,d,d");
      cy.findByText("Redo").click();
      cy.findByLabelText("dig").should(
        "have.value",
        template(`
          #dig
          d,d,d
          ~,d,d`),
      );
    });

    it("deletes a selected area with undo/redo", () => {
      cy.findByText("Select").click();
      cy.findByTestId("stage")
        .then(
          dragTiles({
            startX: 2,
            startY: 1,
            endX: 3,
            endY: 1,
          }),
        )
        .then(triggerHotkeys("delete"));
      cy.findByLabelText("dig").should("have.value", `#dig\nd`);
      cy.findByText("Undo").click();
      cy.findByLabelText("dig").should("have.value", `#dig\nd,d,d`);
      cy.findByText("Redo").click();
      cy.findByLabelText("dig").should("have.value", `#dig\nd`);
    });

    it("flips a selected area with undo/redo", () => {
      cy.findByText("Paint").click();
      cy.findByTestId("stage").then(
        dragTiles({
          startX: 3,
          startY: 1,
          endX: 3,
          endY: 3,
        }),
      );
      cy.findByText("Select").click();
      cy.findByTestId("stage").then(
        dragTiles({
          startX: 1,
          startY: 1,
          endX: 3,
          endY: 3,
        }),
      );
      cy.findByText("Flip Horizontal").click();
      cy.findByLabelText("dig").should(
        "have.value",
        template(`
          #dig
          d,d,d
          d,~,~
          d,~,~`),
      );
      cy.findByText("Undo").click();
      cy.findByLabelText("dig").should(
        "have.value",
        template(`
          #dig
          d,d,d
          ~,~,d
          ~,~,d`),
      );
      cy.findByText("Redo").click();
      cy.findByLabelText("dig").should(
        "have.value",
        template(`
          #dig
          d,d,d
          d,~,~
          d,~,~`),
      );
      cy.findByText("Flip Vertical").click();
      cy.findByLabelText("dig").should(
        "have.value",
        template(`
          #dig
          d,~,~
          d,~,~
          d,d,d`),
      );
      cy.findByText("Undo").click();
      cy.findByLabelText("dig").should(
        "have.value",
        template(`
          #dig
          d,d,d
          d,~,~
          d,~,~`),
      );
      cy.findByText("Redo").click();
      cy.findByLabelText("dig").should(
        "have.value",
        template(`
          #dig
          d,~,~
          d,~,~
          d,d,d`),
      );
    });
  });
});
