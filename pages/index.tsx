/** @jsx jsx */
import { Global, jsx } from "@emotion/core";
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
            font-family: 'Open Sans', sans-serif;
          }`}
      />
      <div>
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
