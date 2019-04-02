import { useSelect } from "@epeli/redux-hooks";
import { selectSelectedTile } from "../store/selectors";
import { State } from "../store/types";
import { AdjustmentBar } from "./AdjustmentBar";
import { Box } from "./Box";
import { Flex } from "./Flex";
import { MultiSelectBar } from "./MultiSelectBar";

export const SelectBar: React.FunctionComponent = () => {
  const { command, tile, multiSelect } = useSelect((state: State) => {
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
