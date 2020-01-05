import React from "react";
import { useSelector } from "react-redux";
import { selectSelectedTile } from "../store/selectors";
import { AdjustmentBar } from "./AdjustmentBar";
import { Box } from "./Box";
import { Flex } from "./Flex";
import { MultiSelectBar } from "./MultiSelectBar";

export const SelectBar = () => {
  const { command, tile, multiSelect } = useSelector(selectSelectedTile);
  return (
    <Flex p={2} flexDirection="column" flexWrap="nowrap">
      {tile && !command && (
        <Box data-test="adjustment-bar-no-item">No item selected.</Box>
      )}
      {tile && command && <AdjustmentBar tile={tile} />}
      {multiSelect && <MultiSelectBar />}
    </Flex>
  );
};
