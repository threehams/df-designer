/** @jsx jsx */
import { jsx } from "@emotion/core";
import css from "@emotion/css";
import { connect } from "react-redux";
import { selectTile, startSelection, clickTile } from "../state/store";

import { State, TileStatus } from "../state/store";
jsx;

interface Props {
  x: number;
  y: number;
  status: TileStatus;
  clickTile: typeof clickTile;
  startSelection: typeof startSelection;
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
        if (event.buttons === 1) {
          clickTile(x, y);
        }
      }}
      css={css`
        background-color: ${background};
        display: inline-block;
        height: 32px;
        width: 32px;
      `}
    />
  );
};

export const Tile = connect(
  (state: State, props: Pick<Props, "x" | "y">) => {
    return selectTile(state, { x: props.x, y: props.y });
  },
  { clickTile, startSelection },
)(TileBase);
