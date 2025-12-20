

Cypress.Commands.add('mockClipboard', (clipboard: { value: string }) => {
  cy.window().then((win: Window) => {
    const clipboardStub = cy.stub(win.navigator.clipboard, 'writeText').callsFake((text: string) => {
      return new Promise<void>((resolve, reject) => {
        if (!text) {
          reject(new Error('Clipboard value is empty'));
        } else {
          clipboard.value = text;
          resolve();
        }
      });
    });

    return clipboardStub;
  });
});
