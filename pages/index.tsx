/** @jsx jsx */
import { Global, jsx } from "@emotion/core";
import dynamic from "next/dynamic";

import { Toolbar } from "../components/";

jsx; // tslint:disable-line

// @ts-ignore bad library type definition
const Stage = dynamic(() => import("../components/Stage"), {
  ssr: false,
});

const Index: React.SFC<{}> = () => {
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
        <Stage />
      </div>
    </>
  );
};

export default Index;
