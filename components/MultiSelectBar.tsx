/** @jsx jsx */
import { css, jsx } from "@emotion/core";

import { tilesActions } from "../store/tiles";
import { Button } from "./Button";

jsx; // tslint:disable-line

interface Props {
  flipSelection: typeof tilesActions.flipSelection;
}

export const MultiSelectBar: React.FunctionComponent<Props> = ({
  flipSelection,
}) => {
  return (
    <div>
      <Button onClick={() => flipSelection("horizontal")}>
        Flip Horizontal
      </Button>
      <Button onClick={() => flipSelection("vertical")}>Flip Vertical</Button>
    </div>
  );
};
