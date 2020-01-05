import React from "react";
import { useDispatch } from "react-redux";
import { tilesActions } from "../store/actions";
import { Button } from "./";
import { Flex } from "./Flex";

export const MultiSelectBar = () => {
  const dispatch = useDispatch();
  return (
    <Flex flexDirection="column" flexWrap="nowrap">
      <Button
        onClick={() => dispatch(tilesActions.flipSelection("horizontal"))}
        mb={1}
      >
        Flip Horizontal
      </Button>
      <Button
        onClick={() => dispatch(tilesActions.flipSelection("vertical"))}
        mb={1}
      >
        Flip Vertical
      </Button>
      <Button onClick={() => dispatch(tilesActions.removeSelection())}>
        Delete
      </Button>
    </Flex>
  );
};
