import { addEventListener } from "consolidated-events";
import keycode from "keycode";
import { useEffect, useState } from "react";

type Keycode = keyof typeof keycode.codes;

export const useHotKey = () => {
  const [keys, setKeys] = useState<Keycode[]>([]);

  useEffect(() => {
    const removeKeydown = addEventListener(
      window,
      "keydown",
      (event: KeyboardEvent) => {
        const keyCode = keycode(event) as Keycode;
        if (event.keyCode && !keys.includes(keyCode)) {
          setKeys([...keys.filter(key => key !== keyCode), keyCode]);
        }
      },
    );
    const removeKeyup = addEventListener(
      window,
      "keyup",
      (event: KeyboardEvent) => {
        setKeys(keys.filter(key => key !== keycode(event)));
      },
    );
    return () => {
      removeKeydown();
      removeKeyup();
    };
  }, [keys]);
  return keys;
};

export const useKeyHandler = (handler: (keyPressed: Keycode) => void) => {
  useEffect(() => {
    const removeKeydown = addEventListener(
      window,
      "keydown",
      (event: KeyboardEvent) => {
        const keyPressed = keycode(event);
        if (keyPressed) {
          handler(keyPressed as Keycode);
        }
      },
    );
    return () => {
      removeKeydown();
    };
  }, [handler]);
};
