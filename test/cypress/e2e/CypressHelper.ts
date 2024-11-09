
import { createI18n } from 'vue-i18n'
import messages from 'src/i18n'
import { getDefaultLocale } from 'src/util'
import 'cypress-real-events'

const i18n = createI18n({
  locale: getDefaultLocale(),
  legacy: false,
  messages,
})

export function navigate(url: string) {
  cy.visit(url)
}

export function tag(name: string) {
  return `[data-tag=${name}]`
}

type Target = string | Cypress.Chainable<any> // Cypress.Chainable<JQuery<HTMLElement>> | Cypress.Chainable<string> | Cypress.Chainable<undefined>
type HTMLElementWrapper = Cypress.Chainable<JQuery<HTMLElement>>

export function find(target: Target): HTMLELementWrapper {
  return typeof target === 'string' ? cy.get(target) : target
}

export function errorHint(target: Target): HTMLELementWrapper {
  // This throws Syntax error, unrecognized expression: ...
  // return `('.q-field:has(${tag}) div[role=alert]')`

  return find(target).parents('.q-field').find('div[role="alert"]')
}

export function tooltip(target: Target): HTMLELementWrapper {
  return find(target).realHover().then(() => {
    cy.get('.q-tooltip')
  })
}

export function assertNoErrorHint(target: Target) {
  return find(target).parents('.q-field').find('div[role="alert"]').should('not.exist')
}

// Call i18n.global.t() to get the translated string
export function t(key: string, options?: Record<string, unknown>) {
  return i18n.global.t(key, options ?? {})
}

export function first(target: Target): HTMLELementWrapper {
  return find(target).first()
}

/** Position is 1-based */
export function nth(target: Target, position: number): HTMLELementWrapper {
  return find(target).eq(position - 1)
}

export function last(target: Target): HTMLELementWrapper {
  return find(target).last()
}

export function containsText(selector: string) {
  return cy.contains(selector)
}

export function title() {
  return cy.title()
}

export function click(target: Target) {
  return find(target).click()
}

export function focusOn(target: Target) {
  return find(target).focus()
}

// Function to type into an input within the found target
export function type(target: Target, text: string, replace: boolean = false) {
  return find(target).then(($el) => {
    // // Check if the target is already an input element
    // if ($el.is('input, textarea')) {
    //   // Type directly in the input; clear if replace is true
    //   cy.wrap($el).clear({ force: replace }).type(text)
    // } else {
    //   // Otherwise, find the input within the target; clear if replace is true
    //   cy.wrap($el).find('input, textarea').clear({ force: replace }).type(text)
    // }

    const found = $el.is('input, textarea') ? cy.wrap($el) : cy.wrap($el).find('input, textarea')
    const maybeCleared = replace ? found.clear({ force: replace }) : found
    if (text.length > 0) maybeCleared.type(text)
  })
}

export function select(target: Target, value: string) {
  return find(target).click().then(() => cy.get('.q-menu').contains(value).click())
}

export function forEach<T>(target: Target, items: T[], assertFn: (element: HTMLELementWrapper, expected: T) => void) {
  find(target).each(($el, index: number) => {
    const element = cy.wrap($el) // Wrap each element to keep Cypress chainable
    const expectedValue = items[index] // Get corresponding value from items array
    assertFn(element, expectedValue) // Call the custom assertion function
  })
}

export function assertNotShowing(target: Target) {
  if (typeof target === 'string') {
    // For string selectors, use cy.$$ to check if elements exist in the DOM
    const elements = cy.$$(target)
    if (elements.length > 0) {
      // If elements exist, assert they are not visible
      return find(target).should('not.be.visible')
    }
  } else {
    // For Cypress.Chainable targets, check both existence and visibility
    return target.then(($el) => {
      if ($el.length === 0) {
        // Element does not exist
        cy.wrap(null).should('not.exist')
      } else {
        // Element exists, check visibility
        cy.wrap($el).should('not.be.visible')
      }
    })
  }

  // If no elements found for a string selector, return an assertion that passes
  return cy.wrap(null).should('not.exist')
}

export function assertShowing(target: Target) {
  return find(target).should('be.visible')
}

export function assertText(target: Target, text: string) {
  return find(target).should('have.text', text)
}

export function assertTextContains(target: Target, text: string) {
  return find(target).should('contain', text)
}

export function assertTextNotContains(target: Target, text: string) {
  return find(target).should('not.contain', text)
}

export function assertValue(target: Target, text: string) {
  return find(target).should('have.value', text)
}

export function assertValueContains(target: Target, value: string) {
  return find(target).should(($element) => {
    const text = $element.val() // Get the text content of the element
    expect(text).to.include(value) // Check if the text contains the expected string
  })
}

export function assertValueNotContains(target: Target, value: string) {
  return find(target).should(($element) => {
    const text = $element.val() // Get the text content of the element
    expect(text).to.not.include(value) // Check if the text does not contain the expected string
  })
}

export function assertEqual(target: Target, text: string) {
  return find(target).should('equal', text)
}

export function assertCount(target: Target, length: number) {
  return find(target).should('have.length', length)
}

export function assertLookDisabled(target: Target) {
  return find(target).should('have.class', 'text-disabled')
}

export function assertLookEnabled(target: Target) {
  return find(target).should('not.have.class', 'text-disabled')
}

export function assertDisabled(target: Target) {
  return find(target).should('be.disabled')
}

export function assertEnabled(target: Target) {
  return find(target).should('not.be.disabled')
}

