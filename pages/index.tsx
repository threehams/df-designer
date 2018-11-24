/** @jsx jsx */
import { Global, jsx, css } from "@emotion/core";
import dynamic from "next/dynamic";

import { connect } from "react-redux";
import { Toolbar } from "../components/";
import { State } from "../store";

jsx; // tslint:disable-line

// @ts-ignore incorrect library type definition on next/dynamic
const Stage = dynamic(() => import("../components/Stage"), {
  ssr: false,
});

const IndexBase: React.SFC<{ version: number }> = ({ version }) => {
  return (
    <>
      <Toolbar />
      <Global
        styles={`
          body {
            margin: 0;
            height: 100vh;
            font-family: 'Open Sans', sans-serif;
          }
          canvas {
            display: block;
          }
          `}
      />
      {/*
       * may want to scroll within PIXI
       * https://medium.com/game-development-stuff/how-to-block-the-page-scroll-while-scrolling-inside-a-pixi-js-canvas-8981306583e6
       */}
      <div
        css={css`
          height: calc(100vh - 53px);
          overflow-x: auto;
          overflow-y: auto;
        `}
      >
        <Stage key={version} />
      </div>
    </>
  );
};

const Index = connect((state: State) => {
  return {
    version: state.tiles.version,
  };
})(IndexBase);
export default Index;
