import { useReduxActions } from "@mrwolfz/react-redux-hooks-poc";
import { useHotKey, useKeyHandler } from "../lib/useHotKey";
import { toolActions, tilesActions } from "../store/actions";

export const Hotkeys: React.FunctionComponent = () => {
  const keysPressed = useHotKey();
  const {
    removeSelection,
    cancel,
    zLevelDown,
    zLevelUp,
    redo,
    undo,
  } = useReduxActions({ ...toolActions, ...tilesActions });
  useKeyHandler(
    key => {
      switch (key) {
        case "delete":
          removeSelection();
          break;
        case "esc":
          cancel();
          break;
        case ".":
          if (keysPressed.includes("shift")) {
            zLevelDown();
          }
          break;
        case ",":
          if (keysPressed.includes("shift")) {
            zLevelUp();
          }
          break;
        case "z":
          if (keysPressed.includes("shift") && keysPressed.includes("ctrl")) {
            redo();
          } else if (keysPressed.includes("ctrl")) {
            undo();
          }
      }
    },
    [keysPressed],
  );
  return null;
};
