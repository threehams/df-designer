import { Locators } from "../locators";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable<Subject> {
      /**
       * Get an element by data-test attribute.
       * @example
       * cy.getId("print-button")
       */
      getId<S = any>(
        id: Locators | Locators[],
        options?: Partial<Loggable & Timeoutable & { item?: string }>,
      ): Chainable<S>;
      getId<S = any>(
        id: Locators | Locators[],
        item: string,
        options?: Partial<Loggable & Timeoutable>,
      ): Chainable<S>;
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
      .map(parent => `"${parent.dataset.test}"`)
      .join(", ");

    const base = parents ? `[${parents}, "${test}"]` : `"${test}"`;
    const testItem = element.data("test-item");
    if (testItem) {
      return `${base}, "${testItem}"`;
    }
    return base;
  },
});
Cypress.Commands.add("getId", (ids: string | string[], item, options = {}) => {
  if (typeof item !== "string") {
    options = item;
  }
  ids = Array.isArray(ids) ? ids : [ids];
  const itemSelector = item ? `[data-test-item=${item}]` : "";
  return cy.get(
    `${ids.map(id => `[data-test=${id}]`).join(" ")}${itemSelector}`,
    options,
  );
});
