import { useHotKey, useKeyHandler } from "../lib/useHotKey";
import { toolActions, tilesActions } from "../store/actions";
import { bindActionCreators } from "redux";
import { useDispatch } from "react-redux";

export const useHotkeys = () => {
  const keysPressed = useHotKey();
  const {
    removeSelection,
    cancel,
    zLevelDown,
    zLevelUp,
    redo,
    undo,
  } = bindActionCreators({ ...toolActions, ...tilesActions }, useDispatch());
  useKeyHandler(key => {
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
  });
};
