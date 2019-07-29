import { useDispatch } from "react-redux";
import { tilesActions } from "../store/actions";
import { Button } from "./";
import { Flex } from "./Flex";

export const MultiSelectBar: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  return (
    <Flex flexDirection="column" flexWrap="nowrap">
      <Button
        onClick={() => dispatch(tilesActions.flipSelection("horizontal"))}
        mb={1}
        data-test="selection-flip-horizontal"
      >
        Flip Horizontal
      </Button>
      <Button
        onClick={() => dispatch(tilesActions.flipSelection("vertical"))}
        mb={1}
        data-test="selection-flip-vertical"
      >
        Flip Vertical
      </Button>
      <Button
        onClick={() => dispatch(tilesActions.removeSelection())}
        data-test="selection-delete"
      >
        Delete
      </Button>
    </Flex>
  );
};
