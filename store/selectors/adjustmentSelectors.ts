import { selectAdjustmentMap } from "../reducers/toolReducer";
import { CommandSlug, State } from "../types";

interface SelectAdjustmentProps {
  item: CommandSlug | null;
}
export const selectAdjustments = (_: State, props: SelectAdjustmentProps) => {
  const adjustmentMap = selectAdjustmentMap();
  return Object.values(adjustmentMap).filter(adjustment => {
    return adjustment.requires === props.item;
  });
};
