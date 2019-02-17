import { connect } from "react-redux";
import { tilesActions } from "../store/tiles";
import { Button } from "./";
import { Flex } from "./Flex";

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
      <Flex flexDirection="column" flexWrap="nowrap">
        <Button
          onClick={() => flipSelection("horizontal")}
          mb={1}
          data-test="selection-flip-horizontal"
        >
          Flip Horizontal
        </Button>
        <Button
          onClick={() => flipSelection("vertical")}
          mb={1}
          data-test="selection-flip-vertical"
        >
          Flip Vertical
        </Button>
        <Button onClick={() => removeSelection()} data-test="selection-delete">
          Delete
        </Button>
      </Flex>
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
