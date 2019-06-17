import { selectSelectedTile } from "../store/selectors";
import { AdjustmentBar } from "./AdjustmentBar";
import { Box } from "./Box";
import { Flex } from "./Flex";
import { MultiSelectBar } from "./MultiSelectBar";
import { useMemoizedState } from "../lib/useMemoizedState";

export const SelectBar: React.FunctionComponent = () => {
  const { command, tile, multiSelect } = useMemoizedState(state => {
    return selectSelectedTile(state);
  });
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
