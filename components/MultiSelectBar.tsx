/** @jsx jsx */
import { css, jsx } from "@emotion/core";

import { connect } from "react-redux";
import { State } from "../store";
import { tilesActions } from "../store/tiles";
import { Button, ButtonGroup } from "./";

jsx; // tslint:disable-line

interface Props {
  flipSelection: (direction: "horizontal" | "vertical") => any;
  removeSelection: () => any;
}

export const MultiSelectBarBase: React.FunctionComponent<Props> = ({
  flipSelection,
  removeSelection,
}) => {
  return (
    <div>
      <ButtonGroup
        css={css`
          display: flex;
          flex-flow: column nowrap;
        `}
        block
      >
        <Button onClick={() => flipSelection("horizontal")}>
          Flip Horizontal
        </Button>
        <Button onClick={() => flipSelection("vertical")}>Flip Vertical</Button>
        <Button onClick={() => removeSelection()}>Delete</Button>
      </ButtonGroup>
    </div>
  );
};

export const MultiSelectBar = connect(
  null,
  {
    flipSelection: tilesActions.flipSelection,
    removeSelection: tilesActions.removeSelection,
  },
)(MultiSelectBarBase);
