import { Locators } from "../locators";

interface ItemLocator<T> {
  name: T;
  item: string;
  index?: never;
}
interface IndexLocator<T> {
  name: T;
  index: number;
  item?: never;
}
type Locator<T> = string | ItemLocator<T> | IndexLocator<T>;
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable<Subject> {
      /**
       * Get an element by data-test attribute.
       * @example
       * cy.getId("print-button")
       */
      getId<T = Locators>(
        id: Locator<T> | Locator<T>[],
        options?: Partial<Loggable & Timeoutable>,
      ): Chainable<JQuery<HTMLElement>>;
    }
  }
}

// @ts-ignore
Cypress.SelectorPlayground.defaults({
  selectorPriority: ["data-test"],
  onElement: (element: JQuery) => {
    const test = element.data("test");
    if (!test) {
      return "";
    }

    const parents = Array.from(element.parents("[data-test]"))
      .reverse()
      .map(parent => {
        const id = parent.dataset["test"];
        const itemId = parent.dataset["test-item"];
        if (itemId) {
          return `{ name: "${id}", item: "${itemId}" }`;
        }
        return `"${id}"`;
      })
      .join(", ");

    const testItem = element.data("test-item");
    const selector = testItem
      ? `{ name: "${test}", item: "${testItem}" }`
      : `"${test}"`;
    return parents ? `[${parents}, ${selector}]` : `${selector}`;
  },
});
Cypress.Commands.add(
  "getId",
  <T = Locators>(
    locators: Locator<T> | Locator<T>[],
    options: Partial<Cypress.Loggable & Cypress.Timeoutable> = {},
  ) => {
    locators = Array.isArray(locators) ? locators : [locators];

    return cy.get(
      locators
        .map(locator => {
          if (typeof locator === "string") {
            return `[data-test=${locator}]`;
          }
          if (locator.item !== undefined) {
            return `[data-test=${locator.name}][data-test-item=${locator.item}]`;
          }
          return `[data-test=${locator.name}]:eq(${locator.index})`;
        })
        .join(" "),
      options,
    );
  },
);
