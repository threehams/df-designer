import { addEventListener } from "consolidated-events";
import keycode from "keycode";
import { useEffect, useState } from "react";

type Keycode = keyof typeof keycode.codes;

export const useHotKey = () => {
  const [keys, setKeys] = useState<Keycode[]>([]);

  useEffect(() => {
    const set = (event: KeyboardEvent) => {
      const keyCode = keycode(event) as Keycode;
      if (event.keyCode && !keys.includes(keyCode)) {
        setKeys([...keys.filter(key => key !== keyCode), keyCode]);
      }
    };
    const reset = (event: KeyboardEvent) => {
      setKeys(keys.filter(key => key !== keycode(event)));
    };
    const removeKeydown = addEventListener(window, "keydown", set);
    const removeKeyup = addEventListener(window, "keyup", reset);
    return () => {
      removeKeydown();
      removeKeyup();
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
    const removeKeydown = addEventListener(window, "keydown", set);
    return () => {
      removeKeydown();
    };
  }, watched);
};
