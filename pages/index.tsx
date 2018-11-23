/** @jsx jsx */
import { css, Global, jsx } from "@emotion/core";
import { range } from "lodash";
import { connect } from "react-redux";

import { Tile, Toolbar } from "../components/";
import { redo, State, undo } from "../state/store";

jsx; // tslint:disable-line

interface Props {
  width: number;
  height: number;
}

const IndexBase: React.SFC<Props> = ({ width, height }) => {
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
  {},
)(IndexBase);

export default Index;
