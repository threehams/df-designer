import keycode from "keycode";

type KeyCode = keyof typeof keycode.codes;
export const triggerHotkeys = (hotkeys: KeyCode | KeyCode[]) => (
  subject: JQuery<HTMLElement>,
) => {
  const hotkeyArray = Array.isArray(hotkeys) ? hotkeys : [hotkeys];
  for (const hotkey of hotkeyArray) {
    cy.wrap(subject).trigger("keydown", {
      keyCode: keycode.codes[hotkey],
      force: true,
    });
  }
  return cy.wrap(subject);
};
