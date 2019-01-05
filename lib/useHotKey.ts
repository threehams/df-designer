import keycode from "keycode";
import { useEffect, useState } from "react";

type Keycode = keyof typeof keycode.codes;

export const useHotKey = () => {
  const [keys, setKeys] = useState<Array<Keycode>>([]);

  useEffect(() => {
    const set = (event: KeyboardEvent) => {
      if (event.keyCode) {
        setKeys([
          ...keys.filter(key => key !== keycode(event)),
          keycode(event) as Keycode,
        ]);
      }
    };
    const reset = (event: KeyboardEvent) => {
      setKeys(keys.filter(key => key !== keycode(event)));
    };
    window.addEventListener("keydown", set);
    window.addEventListener("keyup", reset);
    return () => {
      window.removeEventListener("keydown", set);
      window.removeEventListener("keyup", reset);
    };
  });
  return keys;
};

export const useKeyHandler = (
  handler: (keyPressed: Keycode) => void,
  watched?: any[],
) => {
  useEffect(() => {
    const set = (event: KeyboardEvent) => {
      const keyPressed = keycode(event);
      if (keyPressed) {
        handler(keyPressed as Keycode);
      }
    };
    window.addEventListener("keydown", set);
    return () => {
      window.removeEventListener("keydown", set);
    };
  }, watched);
};
