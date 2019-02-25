import { connect } from "react-redux";
import { useHotKey, useKeyHandler } from "../../lib/useHotKey";
import { tilesActions, toolActions } from "../../store/actions";

interface HotkeysProps {
  cancel: typeof toolActions.cancel;
  redo: typeof tilesActions.redo;
  removeSelection: () => any;
  undo: typeof tilesActions.undo;
  zLevelDown: () => any;
  zLevelUp: () => any;
}
const HotkeysBase: React.FunctionComponent<HotkeysProps> = ({
  cancel,
  redo,
  removeSelection,
  zLevelUp,
  zLevelDown,
  undo,
}) => {
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

export const Hotkeys = connect(
  null,
  {
    cancel: toolActions.cancel,
    redo: tilesActions.redo,
    removeSelection: tilesActions.removeSelection,
    undo: tilesActions.undo,
    zLevelDown: tilesActions.zLevelDown,
    zLevelUp: tilesActions.zLevelUp,
  },
)(HotkeysBase);
