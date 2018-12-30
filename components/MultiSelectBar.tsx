/** @jsx jsx */
import { css, jsx } from "@emotion/core";

import { tilesActions } from "../store/tiles";
import { Button, ButtonGroup } from "./";

jsx; // tslint:disable-line

interface Props {
  flipSelection: typeof tilesActions.flipSelection;
}

export const MultiSelectBar: React.FunctionComponent<Props> = ({
  flipSelection,
}) => {
  return (
    <div>
      <ButtonGroup
        css={css`
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
        `}
      >
        <Button onClick={() => flipSelection("horizontal")}>
          Flip Horizontal
        </Button>
        <Button onClick={() => flipSelection("vertical")}>Flip Vertical</Button>
      </ButtonGroup>
    </div>
  );
};
