import { useReduxDispatch } from "@mrwolfz/react-redux-hooks-poc";
import { flipSelection, removeSelection } from "../store/actions/tilesActions";
import { Button } from "./";
import { Flex } from "./Flex";

export const MultiSelectBar: React.FunctionComponent = () => {
  const dispatch = useReduxDispatch();
  return (
    <Flex flexDirection="column" flexWrap="nowrap">
      <Button
        onClick={() => dispatch(flipSelection("horizontal"))}
        mb={1}
        data-test="selection-flip-horizontal"
      >
        Flip Horizontal
      </Button>
      <Button
        onClick={() => dispatch(flipSelection("vertical"))}
        mb={1}
        data-test="selection-flip-vertical"
      >
        Flip Vertical
      </Button>
      <Button
        onClick={() => dispatch(removeSelection())}
        data-test="selection-delete"
      >
        Delete
      </Button>
    </Flex>
  );
};
