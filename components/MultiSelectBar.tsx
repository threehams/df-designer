import { Button } from "./";
import { Flex } from "./Flex";
import { tilesActions } from "../store/actions";
import { bindActionCreators } from "redux";
import { useDispatch } from "react-redux";

export const MultiSelectBar: React.FunctionComponent = () => {
  const { flipSelection, removeSelection } = bindActionCreators(
    tilesActions,
    useDispatch(),
  );
  return (
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
  );
};
