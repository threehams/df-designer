/** @jsx jsx */
import { css, Global, jsx } from "@emotion/core";
import { connect } from "react-redux";

import { Tile, Toolbar } from "../components/";
import { State } from "../store";

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
            font-family: 'Open Sans', sans-serif;
          }`}
      />
      <div>
        {Array.from(Array(height).keys()).map(y => {
          return (
            <div
              key={y}
              css={css`
                display: flex;
                flex-flow: row nowrap;
              `}
            >
              {Array.from(Array(width).keys()).map(x => {
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
