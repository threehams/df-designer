import keycode from "keycode";
import { useEffect, useState } from "react";

export const useHotKey = () => {
  const [key, setKey] = useState<keyof typeof keycode.codes | null>(null);

  useEffect(() => {
    const set = (event: KeyboardEvent) => {
      if (event.keyCode) {
        setKey(keycode(event) as keyof typeof keycode.codes);
      }
    };
    const reset = () => {
      setKey(null);
    };
    window.addEventListener("keydown", set);
    window.addEventListener("keyup", reset);
    return () => {
      window.removeEventListener("keydown", set);
      window.removeEventListener("keyup", reset);
    };
  });
  return key;
};

export const useKeyHandler = (
  handler: (keyPressed: keyof typeof keycode.codes) => void,
) => {
  useEffect(() => {
    const set = (event: KeyboardEvent) => {
      const keyPressed = keycode(event);
      if (keyPressed) {
        handler(keyPressed as keyof typeof keycode.codes);
      }
    };
    window.addEventListener("keydown", set);
    return () => {
      window.removeEventListener("keydown", set);
    };
  });
};
