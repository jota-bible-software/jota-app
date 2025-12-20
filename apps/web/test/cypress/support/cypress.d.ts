// cypress/support/index.d.ts or cypress/support/commands.d.ts
declare namespace Cypress {
  interface Chainable {
    /**
     * Mocks the clipboard functionality.
     * @param clipboard.value A string that represents the clipboard's value.
     */
    mockClipboard(clipboard: {value: string}): Chainable<void>;
  }
}
