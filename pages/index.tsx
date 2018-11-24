/** @jsx jsx */
import { Global, jsx, css } from "@emotion/core";
import dynamic from "next/dynamic";

import { connect } from "react-redux";
import { Toolbar, Sidebar } from "../components/";
import { State } from "../store";

jsx; // tslint:disable-line

// @ts-ignore incorrect library type definition on next/dynamic
const Stage = dynamic(() => import("../components/Stage"), {
  ssr: false,
});

const IndexBase: React.SFC<{ version: number }> = ({ version }) => {
  return (
    <div
      css={css`
        display: grid;
        grid-template-areas:
          "header header"
          "main sidebar";
        height: 100vh;
      `}
    >
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

      <div
        css={css`
          grid-area: header;
        `}
      >
        <Toolbar />
      </div>
      {/*
       * may want to scroll within PIXI
       * https://medium.com/game-development-stuff/how-to-block-the-page-scroll-while-scrolling-inside-a-pixi-js-canvas-8981306583e6
       */}
      <div
        css={css`
          overflow-x: auto;
          overflow-y: auto;
          grid-area: main;
        `}
      >
        <Stage key={version} />
      </div>
      <div
        css={css`
          grid-area: sidebar;
          width: 300px;
        `}
      >
        <Sidebar />
      </div>
    </div>
  );
};

const Index = connect((state: State) => {
  return {
    version: state.tiles.version,
  };
})(IndexBase);
export default Index;
