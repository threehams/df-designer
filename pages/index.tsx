/** @jsx jsx */
import { Global, jsx, css } from "@emotion/core";
import dynamic from "next/dynamic";

import { connect } from "react-redux";
import { Toolbar, CommandBar, ExportBar, SelectBar } from "../components/";
import { State } from "../store";
import { selectTool, Tool } from "../store/tool";

jsx; // tslint:disable-line

// @ts-ignore incorrect library type definition on next/dynamic
const Artboard = dynamic(() => import("../components/Artboard"), {
  ssr: false,
});

interface Props {
  tool: Tool;
}
const IndexBase: React.SFC<Props> = ({ tool }) => {
  const MainSidebar = tool === "select" ? SelectBar : CommandBar;
  return (
    <div
      css={css`
        display: grid;
        grid-template-areas:
          "header header header"
          "leftbar main rightbar";
        height: 100vh;
      `}
    >
      <Global
        styles={`
          body {
            margin: 0;
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
        <Artboard />
      </div>
      <div
        css={css`
          grid-area: leftbar;
          width: 300px;
          overflow-y: auto;
        `}
      >
        <MainSidebar />
      </div>
      <div
        css={css`
          grid-area: rightbar;
          width: 300px;
          overflow-y: auto;
        `}
      >
        <ExportBar />
      </div>
    </div>
  );
};

const Index = connect((state: State) => {
  return {
    tool: selectTool(state),
  };
})(IndexBase);
export default Index;
