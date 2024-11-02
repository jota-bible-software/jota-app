export interface DriverInterface {
  visit(path?: string): DriverInterface
  getTitle(): Cypress.Chainable<string>
  findBySelector(selector: string): DriverElement
  findByText(text: string): DriverElement
  dataCy(selector: string): DriverElement
}

export interface DriverElement {
  click(): DriverElement
  shouldContainText(text: string): DriverElement
  should(assertion: string, value?: string): DriverElement
  and(assertion: string, value?: string | RegExp): DriverElement
  first(): DriverElement
  get(attribute: string): Cypress.Chainable<string>
  haveCss(property: string): Cypress.Chainable<string>
  haveClass(className: string): DriverElement
  haveAttr(attr: string): DriverElement
}
