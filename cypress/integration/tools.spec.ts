import { triggerHotkeys } from "../lib/hotkeys";
import { clickTile, dragTiles, setTiles } from "../lib/tiles";

const template = (string: string) => {
  return string
    .trim()
    .split("\n")
    .map(part => part.trim())
    .join("\n");
};

describe("tools", () => {
  describe("paint tools", () => {
    beforeEach(() => {
      cy.visit("/");
      cy.getId("export").click();
    });

    it("paints a single tile with undo/redo", () => {
      cy.getId({ name: "tool", item: "paint" }).click();
      cy.getId("stage").then(clickTile({ x: 1, y: 1 }));
      cy.getId({ name: "export-text", item: "dig" }).should(
        "have.value",
        "#dig\nd",
      );
      cy.getId("stage").then(clickTile({ x: 2, y: 1 }));
      cy.getId({ name: "export-text", item: "dig" }).should(
        "have.value",
        "#dig\nd,d",
      );
      cy.getId("undo").click();
      cy.getId({ name: "export-text", item: "dig" }).should(
        "have.value",
        "#dig\nd",
      );
      cy.getId("redo").click();
      cy.getId({ name: "export-text", item: "dig" }).should(
        "have.value",
        "#dig\nd,d",
      );
    });

    it("builds and places with undo/redo", () => {
      cy.getId(["toolbar", { name: "tool", item: "paint-rectangle" }]).click();
      cy.getId("stage").then(
        dragTiles({ startX: 1, startY: 1, endX: 3, endY: 1 }),
      );
      cy.getId("tool");
      cy.getId({ name: "export-text", item: "dig" }).should(
        "have.value",
        "#dig\nd,d,d",
      );

      cy.getId({ name: "phase", item: "build" }).click();
      cy.getId({ name: "command", item: "bed" }).click();
      cy.getId("stage").then(clickTile({ x: 2, y: 1 }));
      cy.getId({ name: "export-text", item: "build" }).should(
        "have.value",
        "#build\n~,b,~",
      );
      cy.getId("undo").click();
      cy.getId({ name: "export-text", item: "build" }).should("not.exist");
      cy.getId("redo").click();
      cy.getId({ name: "export-text", item: "build" }).should(
        "have.value",
        "#build\n~,b,~",
      );

      cy.getId({ name: "phase", item: "place" }).click();
      cy.getId({ name: "command", item: "foodStockpile" }).click();
      cy.getId("stage").then(clickTile({ x: 3, y: 1 }));
      cy.getId({ name: "export-text", item: "place" }).should(
        "have.value",
        "#place\n~,~,f",
      );
      cy.getId("undo").click();
      cy.getId({ name: "export-text", item: "place" }).should("not.exist");
      cy.getId("redo").click();
      cy.getId({ name: "export-text", item: "place" }).should(
        "have.value",
        "#place\n~,~,f",
      );
    });

    it("paints a series of tiles with undo/redo (including hotkeys)", () => {
      cy.getId({ name: "tool", item: "paint" }).click();
      cy.getId("stage").then(
        dragTiles({
          startX: 1,
          startY: 1,
          endX: 3,
          endY: 1,
        }),
      );
      cy.getId({ name: "export-text", item: "dig" }).should(
        "have.value",
        "#dig\nd,d,d",
      );
      cy.getId("stage").then(
        dragTiles({
          startX: 3,
          startY: 1,
          endX: 3,
          endY: 2,
        }),
      );
      cy.getId({ name: "export-text", item: "dig" }).should(
        "have.value",
        "#dig\nd,d,d\n~,~,d",
      );
      cy.getId("undo").click();
      cy.getId({ name: "export-text", item: "dig" }).should(
        "have.value",
        "#dig\nd,d,d",
      );
      cy.getId("redo").click();
      cy.getId({ name: "export-text", item: "dig" }).should(
        "have.value",
        "#dig\nd,d,d\n~,~,d",
      );
      cy.getId("stage").then(triggerHotkeys(["ctrl", "z"]));
      cy.getId({ name: "export-text", item: "dig" }).should(
        "have.value",
        "#dig\nd,d,d",
      );
      cy.getId("stage").then(triggerHotkeys(["ctrl", "shift", "z"]));
      cy.getId({ name: "export-text", item: "dig" }).should(
        "have.value",
        "#dig\nd,d,d\n~,~,d",
      );
    });

    it("paints a rectangle with undo/redo", () => {
      cy.getId({ name: "tool", item: "paint-rectangle" }).click();
      cy.getId("stage").then(
        dragTiles({
          startX: 1,
          startY: 1,
          endX: 3,
          endY: 3,
        }),
      );
      cy.getId({ name: "export-text", item: "dig" }).should(
        "have.value",
        template(`#dig
        d,d,d
        d,d,d
        d,d,d`),
      );
      cy.getId("stage").then(
        dragTiles({
          startX: 2,
          startY: 2,
          endX: 3,
          endY: 4,
        }),
      );
      cy.getId({ name: "export-text", item: "dig" }).should(
        "have.value",
        template(`
        #dig
        d,d,d
        d,d,d
        d,d,d
        ~,d,d`),
      );
      cy.getId("undo").click();
      cy.getId({ name: "export-text", item: "dig" }).should(
        "have.value",
        `#dig
d,d,d
d,d,d
d,d,d`,
      );
      cy.getId("redo").click();
      cy.getId({ name: "export-text", item: "dig" }).should(
        "have.value",
        `#dig
d,d,d
d,d,d
d,d,d
~,d,d`,
      );
    });

    it("erases tiles with undo/redo", () => {
      cy.getId({ name: "tool", item: "paint" }).click();
      cy.getId("stage").then(
        dragTiles({
          startX: 1,
          startY: 1,
          endX: 3,
          endY: 1,
        }),
      );
      cy.getId({ name: "tool", item: "erase" }).click();
      cy.getId("stage").then(
        dragTiles({
          startX: 2,
          startY: 1,
          endX: 3,
          endY: 1,
        }),
      );
      cy.getId({ name: "export-text", item: "dig" }).should(
        "have.value",
        `#dig\nd`,
      );
      cy.getId("undo").click();
      cy.getId({ name: "export-text", item: "dig" }).should(
        "have.value",
        `#dig\nd,d,d`,
      );
      cy.getId("redo").click();
      cy.getId({ name: "export-text", item: "dig" }).should(
        "have.value",
        `#dig\nd`,
      );
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
      cy.getId("export").click();
    });

    it("moves a selected area with undo/redo", () => {
      cy.getId({ name: "tool", item: "select" }).click();
      cy.getId("stage")
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
      cy.getId({ name: "export-text", item: "dig" }).should(
        "have.value",
        `#dig
d,~,~
~,d,d`,
      );
      cy.getId("undo").click();
      cy.getId({ name: "export-text", item: "dig" }).should(
        "have.value",
        "#dig\nd,d,d",
      );
      cy.getId("redo").click();
      cy.getId({ name: "export-text", item: "dig" }).should(
        "have.value",
        `#dig
d,~,~
~,d,d`,
      );
    });

    it("clones a selected area with undo/redo", () => {
      cy.getId({ name: "tool", item: "select" }).click();
      cy.getId("stage")
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

      cy.getId({ name: "export-text", item: "dig" }).should(
        "have.value",
        `#dig
d,d,d
~,d,d`,
      );
      cy.getId("undo").click();
      cy.getId({ name: "export-text", item: "dig" }).should(
        "have.value",
        "#dig\nd,d,d",
      );
      cy.getId("redo").click();
      cy.getId({ name: "export-text", item: "dig" }).should(
        "have.value",
        `#dig
d,d,d
~,d,d`,
      );
    });

    it("deletes a selected area with undo/redo", () => {
      cy.getId({ name: "tool", item: "select" }).click();
      cy.getId("stage")
        .then(
          dragTiles({
            startX: 2,
            startY: 1,
            endX: 3,
            endY: 1,
          }),
        )
        .then(triggerHotkeys("delete"));
      cy.getId({ name: "export-text", item: "dig" }).should(
        "have.value",
        `#dig\nd`,
      );
      cy.getId("undo").click();
      cy.getId({ name: "export-text", item: "dig" }).should(
        "have.value",
        `#dig\nd,d,d`,
      );
      cy.getId("redo").click();
      cy.getId({ name: "export-text", item: "dig" }).should(
        "have.value",
        `#dig\nd`,
      );
    });

    it("flips a selected area with undo/redo", () => {
      cy.getId({ name: "tool", item: "paint" }).click();
      cy.getId("stage").then(
        dragTiles({
          startX: 3,
          startY: 1,
          endX: 3,
          endY: 3,
        }),
      );
      cy.getId({ name: "tool", item: "select" }).click();
      cy.getId("stage").then(
        dragTiles({
          startX: 1,
          startY: 1,
          endX: 3,
          endY: 3,
        }),
      );
      cy.getId("selection-flip-horizontal").click();
      cy.getId({ name: "export-text", item: "dig" }).should(
        "have.value",
        `#dig
d,d,d
d,~,~
d,~,~`,
      );
      cy.getId("undo").click();
      cy.getId({ name: "export-text", item: "dig" }).should(
        "have.value",
        `#dig
d,d,d
~,~,d
~,~,d`,
      );
      cy.getId("redo").click();
      cy.getId({ name: "export-text", item: "dig" }).should(
        "have.value",
        `#dig
d,d,d
d,~,~
d,~,~`,
      );
      cy.getId("selection-flip-vertical").click();
      cy.getId({ name: "export-text", item: "dig" }).should(
        "have.value",
        `#dig
d,~,~
d,~,~
d,d,d`,
      );
      cy.getId("undo").click();
      cy.getId({ name: "export-text", item: "dig" }).should(
        "have.value",
        `#dig
d,d,d
d,~,~
d,~,~`,
      );
      cy.getId("redo").click();
      cy.getId({ name: "export-text", item: "dig" }).should(
        "have.value",
        `#dig
d,~,~
d,~,~
d,d,d`,
      );
    });
  });
});
