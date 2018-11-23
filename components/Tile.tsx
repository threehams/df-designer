/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import React, { useState } from "react";
import { connect } from "react-redux";
import { State } from "../store";
import { selectTile, TileStatus } from "../store/tiles";
import * as tilesActions from "../store/tiles/actions";

jsx; // tslint:disable-line

interface Props {
  x: number;
  y: number;
  status: TileStatus;
  clickTile: typeof tilesActions.clickTile;
  startSelection: typeof tilesActions.startSelection;
}

const colors: { [key in TileStatus]: string } = {
  undug: "black",
  dug: "darkgray",
  smoothed: "lightgray",
  engraved: "white",
};

const TileBase: React.SFC<Props> = ({
  clickTile,
  x,
  y,
  status,
  startSelection,
}) => {
  const background = colors[status];
  const [active, setActive] = useState(false);
  return (
    <div
      onMouseDown={event => {
        // prevent drag event
        event.preventDefault();
        startSelection();
        clickTile(x, y);
      }}
      onMouseEnter={event => {
        event.stopPropagation();
        setActive(true);
        if (event.buttons === 1) {
          clickTile(x, y);
        }
      }}
      onMouseLeave={event => {
        event.stopPropagation();
        setActive(false);
      }}
      css={css`
        background-color: ${background};
        display: inline-flex;
        align-items: center;
        justify-content: center;
        height: 32px;
        position: relative;
        width: 32px;
      `}
    >
      {active && (
        <div
          css={css`
            pointer-events: none;
            color: yellow;
          `}
        >
          X
        </div>
      )}
    </div>
  );
};

export const Tile = connect(
  (state: State, props: Pick<Props, "x" | "y">) => {
    return selectTile(state, { x: props.x, y: props.y });
  },
  {
    clickTile: tilesActions.clickTile,
    startSelection: tilesActions.startSelection,
  },
)(TileBase);
