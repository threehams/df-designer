/** @jsx jsx */
import { jsx, Global } from "@emotion/core";
import css from "@emotion/css";
import { connect } from "react-redux";
import { range } from "lodash";

import { Tile, Toolbar } from "../components/";
import { State } from "state/store";
import { undo, redo } from "../state/store";

jsx;

interface Props {
  width: number;
  height: number;
  undo: typeof undo;
  redo: typeof redo;
}

const IndexBase: React.SFC<Props> = ({ width, height, undo, redo }) => {
  return (
    <>
      <Toolbar />
      <Global
        styles={`
          body {
            margin: 0;
          }`}
      />
      <div
        css={css`
          line-height: 0;
        `}
      >
        {range(0, width).map(y => {
          return (
            <div key={y}>
              {range(0, height).map(x => {
                return <Tile key={x} x={x} y={y} />;
              })}
            </div>
          );
        })}
      </div>
    </>
  );
};

const Index = connect(
  (state: State) => {
    return {
      width: state.tiles.width,
      height: state.tiles.height,
    };
  },
  { undo, redo },
)(IndexBase);

export default Index;
