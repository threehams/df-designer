import { Global } from "@emotion/core";
import dynamic from "next/dynamic";
import { connect } from "react-redux";
import {
  Box,
  CommandBar,
  ExportBar,
  Grid,
  SelectBar,
  Toolbar,
} from "../components/";
import { selectTool } from "../store/reducers/toolReducer";
import { State, Tool } from "../store/types";

const Loading = () => <Box width="100vh" height="100vh" background="black" />;

// @ts-ignore I have no idea how to make these two libraries agree
// react-redux and react-loadable
const Artboard = dynamic(import("../components/Artboard"), {
  ssr: false,
  loading: Loading,
});

interface Props {
  tool: Tool;
}
const IndexBase: React.FunctionComponent<Props> = ({ tool }) => {
  const MainSidebar = tool === "select" ? SelectBar : CommandBar;
  return (
    <Grid
      height="100vh"
      gridTemplateAreas={`"header header header"
                          "leftbar main rightbar"`}
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
  );
};

const Index = connect((state: State) => {
  return {
    tool: selectTool(state),
  };
})(IndexBase);
export default Index;
