import { Global } from "@emotion/core";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import {
  Box,
  CommandBar,
  ExportBar,
  Grid,
  SelectBar,
  Toolbar,
} from "../components/";
import { useHotkeys } from "../components/useHotkeys";
import { selectTool } from "../store/reducers/toolReducer";
import React from "react";

const Loading = () => <Box width="100vh" height="100vh" background="black" />;

const Artboard = dynamic(import("../components/Artboard"), {
  ssr: false,
  loading: Loading,
});

export const Index: React.FunctionComponent = () => {
  useHotkeys();
  const tool = useSelector(selectTool);
  const MainSidebar = tool === "select" ? SelectBar : CommandBar;
  return (
    <>
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
      <Grid
        height="100vh"
        gridTemplateAreas={`"header header header"
                          "leftbar main rightbar"`}
      >
        <Box gridArea="header">
          <Toolbar />
        </Box>
        {/*
         * may want to scroll within PIXI
         * https://medium.com/game-development-stuff/how-to-block-the-page-scroll-while-scrolling-inside-a-pixi-js-canvas-8981306583e6
         */}
        <Box overflow="auto" gridArea="main">
          <Artboard />
        </Box>
        <Box gridArea="leftbar" width={300} overflow="visible auto">
          <MainSidebar />
        </Box>
        <Box gridArea="rightbar" width={300} overflow="visible auto">
          <ExportBar />
        </Box>
      </Grid>
    </>
  );
};

export default Index;
