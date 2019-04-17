import { useReduxDispatch } from "@mrwolfz/react-redux-hooks-poc";
import { useHotKey, useKeyHandler } from "../lib/useHotKey";
import {
  redo,
  removeSelection,
  undo,
  zLevelDown,
  zLevelUp,
} from "../store/actions/tilesActions";
import { cancel } from "../store/actions/toolActions";

export const Hotkeys: React.FunctionComponent = () => {
  const keysPressed = useHotKey();
  const dispatch = useReduxDispatch();
  useKeyHandler(
    key => {
      switch (key) {
        case "delete":
          dispatch(removeSelection());
          break;
        case "esc":
          dispatch(cancel());
          break;
        case ".":
          if (keysPressed.includes("shift")) {
            dispatch(zLevelDown());
          }
          break;
        case ",":
          if (keysPressed.includes("shift")) {
            dispatch(zLevelUp());
          }
          break;
        case "z":
          if (keysPressed.includes("shift") && keysPressed.includes("ctrl")) {
            dispatch(redo());
          } else if (keysPressed.includes("ctrl")) {
            dispatch(undo());
          }
      }
    },
    [keysPressed],
  );
  return null;
};
