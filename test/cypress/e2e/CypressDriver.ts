// Separate the tests from a test framework to make it easier to swap out
// the test framework in the future.

import { DriverInterface, DriverElement } from './DriverInterface'

// driverInterface.t
// cypressDriver.ts
class CypressElement implements DriverElement {
  constructor(private element: Cypress.Chainable<JQuery<HTMLElement>>) { }

  click(): DriverElement {
    this.element.click()
    return this
  }

  shouldContainText(text: string): DriverElement {
    this.element.should('contain.text', text)
    return this
  }

  should(assertion: string, value?: string): DriverElement {
    this.element.should(assertion, value)
    return this
  }

  and(assertion: string, value?: string | RegExp): DriverElement {
    this.element.and(assertion, value)
    return this
  }

  first(): DriverElement {
    return new CypressElement(this.element.first())
  }

  get(attribute: string): Cypress.Chainable<string> {
    return this.element.invoke('attr', attribute)
  }

  haveCss(property: string): Cypress.Chainable<string> {
    return this.element.invoke('css', property)
  }

  haveClass(className: string): DriverElement {
    this.element.should('have.class', className)
    return this
  }

  haveAttr(attr: string): DriverElement {
    this.element.should('have.attr', attr)
    return this
  }
}

export class CypressDriver implements DriverInterface {
  visit(path: string = '/'): DriverInterface {
    cy.visit(path)
    return this
  }

  getTitle(): Cypress.Chainable<string> {
    return cy.title()
  }

  findBySelector(selector: string): DriverElement {
    return new CypressElement(cy.get(selector))
  }

  findByText(text: string): DriverElement {
    return new CypressElement(cy.contains(text))
  }

  dataCy(selector: string): DriverElement {
    return new CypressElement(cy.get(`[data-cy=${selector}]`))
  }
}
