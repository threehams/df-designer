import { Coords, SelectedCoords } from "../../store/types";

const TILE_SIZE = 16;

const coordinates = (x: number, y: number) => {
  return {
    x: (x + 0.5) * TILE_SIZE,
    y: (y + 0.5) * TILE_SIZE,
  };
};

const path = (selection: SelectedCoords) => {
  const steps = [];
  for (let x = selection.startX; x <= selection.endX; x++) {
    steps.push({ x, y: selection.startY });
  }
  for (let y = selection.startY; y <= selection.endY; y++) {
    steps.push({ x: selection.endX, y });
  }
  return steps;
};

export const clickTile = ({ x, y }: Coords) => (
  subject: JQuery<HTMLElement>,
) => {
  cy.wrap(subject)
    .invoke("width")
    .should("be.greaterThan", 0);
  cy.wrap(subject)
    .trigger("pointerdown", {
      ...coordinates(x, y),
      buttons: 1,
    })
    .trigger("pointerup", coordinates(x, y));
};

export const dragTiles = (selection: SelectedCoords) => (
  subject: JQuery<HTMLElement>,
) => {
  cy.wrap(subject)
    .invoke("width")
    .should("be.greaterThan", 0);
  cy.wrap(subject).trigger("pointerdown", {
    ...coordinates(selection.startX, selection.startY),
    buttons: 1,
  });
  cy.wrap(path(selection)).each((coords: Coords) => {
    cy.wrap(subject).trigger("pointermove", {
      ...coordinates(coords.x, coords.y),
      buttons: 1,
    });
  });
  cy.wrap(subject).trigger(
    "pointerup",
    coordinates(selection.endX, selection.endY),
  );
};
