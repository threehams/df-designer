import { useActionCreators } from "@epeli/redux-hooks";
import { useHotKey, useKeyHandler } from "../lib/useHotKey";
import { tilesActions, toolActions } from "../store/actions";

export const Hotkeys: React.FunctionComponent = () => {
  const {
    cancel,
    redo,
    removeSelection,
    undo,
    zLevelDown,
    zLevelUp,
  } = useActionCreators({
    ...toolActions,
    ...tilesActions,
  });
  const keysPressed = useHotKey();
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
