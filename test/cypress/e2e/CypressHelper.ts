
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
  // Use an empty path for Cypress tests as they run in development mode
  const publicPath = ''
  const fullUrl = `${publicPath}${url}`
  cy.visit(fullUrl)
}

export function tag(name: string) {
  return `[data-tag=${name}]`
}
type SingleTarget = string | Cypress.Chainable<JQuery<HTMLElement>> | Cypress.Chainable<string> | Cypress.Chainable<undefined>
type NestedTarget = { head: SingleTarget, tail: string[] }
type Target = SingleTarget | NestedTarget // Cypress.Chainable<JQuery<HTMLElement>> | Cypress.Chainable<string> | Cypress.Chainable<undefined>
// type Target = string | Cypress.Chainable<JQuery<HTMLElement>>;
type HtmlElementWrapper = Cypress.Chainable<JQuery<HTMLElement>>
type PositionType = 'topLeft' | 'top' | 'topRight' | 'left' | 'center' | 'right' | 'bottomLeft' | 'bottom' | 'bottomRight'

export function nested(head: SingleTarget, ...tail: string[]): NestedTarget {
  return { head, tail }
}
// export function find3(target: Target): HtmlElementWrapper {
//   return typeof target === 'string' ? cy.get(target) : target
// }

// export function find2(target: Target, ...nested: string[]): HtmlElementWrapper {
//   return nested.reduce((acc, cur) => acc.find(cur), typeof target === 'string' ? cy.get(target) : target)
// }

export function find(target: Target, options = {}): HtmlElementWrapper {
  function findNested(target: Target): HtmlElementWrapper {
    const t = target as NestedTarget
    return t.tail.reduce((acc, cur) => acc.find(cur), find(t.head, options))
  }
  return typeof target === 'string' ? cy.get(target, options) : target.hasOwnProperty('head') ? findNested(target) : target as HtmlElementWrapper
}

export function errorHint(target: Target): HtmlElementWrapper {
  // This throws Syntax error, unrecognized expression: ...
  // return `('.q-field:has(${tag}) div[role=alert]')`

  return find(target).closest('.q-field').find('div[role="alert"]')
}

export function tooltip(target: Target): HtmlElementWrapper {
  return find(target).realHover().then(() => {
    cy.get('.q-tooltip')
  })
}

// export function text(target: Target): string {
//   return find(target).invoke('text')
// }

export function assertNoErrorHint(target: Target) {
  return find(target).parents('.q-field').find('div[role="alert"]').should('not.exist')
}

// Call i18n.global.t() to get the translated string
export function t(key: string, options?: Record<string, unknown>) {
  return i18n.global.t(key, options ?? {})
}

export function first(target: Target): HtmlElementWrapper {
  return find(target).first()
}

/** Position is 1-based */
export function nth(target: Target, position: number): HtmlElementWrapper {
  return find(target).eq(position - 1)
}

export function second(target: Target): HtmlElementWrapper {
  return find(target).eq(1)
}

export function third(target: Target): HtmlElementWrapper {
  return find(target).eq(2)
}

export function last(target: Target): HtmlElementWrapper {
  return find(target).last()
}

export function visible(target: Target): HtmlElementWrapper {
  return find(target).filter(':visible')
}

export function containsText(selector: string) {
  return cy.contains(selector)
}

export function title() {
  return cy.title()
}

export function click(target: Target, position: PositionType = 'center') {
  return find(target).click(position)
}

export const clipboard = { value: '' }

export function mockClipboard() {
  return cy.mockClipboard(clipboard)
}

export function assertClipboard(text: string) {
  cy.window().should(() => expect(clipboard.value).to.equal(text))
}

export function setCaret(target: Target) {
  return find(target).click().then(($el) => {
    const walk = document.createTreeWalker($el[0], NodeFilter.SHOW_TEXT, null)
    const node = walk.nextNode()
    if (!node) return

    document.getSelection()?.removeAllRanges()
    const range = new Range()
    range.setStart(node, 0)
    range.setEnd(node, 0)
    range.collapse(true)
    cy.window().then(win => win._jota_test_support.getSelectionRange = () => range)

    // This does not work. The selection is not updated.
    // document.getSelection()?.collapse(node, 0)

    cy.document().trigger('selectionchange')
  })
}

export function focusOn(target: Target) {
  return find(target).focus()
}

export function focused() {
  return cy.focused()
}

export function pressKey(key: string) {
  return focused().type(key)
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
  return find(target).click().then(() => {
    //  cy.get('.q-menu').contains(value).click()
    cy.get('.q-menu').find('.q-item')
      .each((option) => {
        const text = Cypress.$(option).text().trim()
        if (!value && text === '' || value && text.includes(value)) {
          cy.wrap(option).click()
        }
      })
  })
}

export function clickDialogNo() {
  cy.get('.q-dialog').contains(t('settingsFormatTemplates.no')).click()
}

export function clickDialogYes() {
  cy.get('.q-dialog').contains(t('settingsFormatTemplates.yes')).click()
}

export function forEach<T>(target: Target, items: T[], assertFn: (element: HtmlElementWrapper, expected: T) => void) {
  find(target).each(($el, index: number) => {
    const element = cy.wrap($el) // Wrap each element to keep Cypress chainable
    const expectedValue = items[index] // Get corresponding value from items array
    assertFn(element, expectedValue) // Call the custom assertion function
  })
}

export function assertNotShowing(target: Target) {
  if (typeof target === 'string') {
    return cy.window().then((win) => {
      const elements = win.document.querySelectorAll(target) // Check if the element exists
      if (elements.length === 0) {
        cy.log(`Element '${target}' does not exist`)
        return cy.get(target).should('not.exist') // Assert non-existence
      } else {
        cy.log(`Element '${target}' exists but should not be visible`)
        return cy.get(target).should('not.be.visible') // Assert it’s not visible
      }
    })
  } else if (Cypress.isCy(target)) {
    return target.then(($el) => {
      if ($el.length === 0) {
        cy.log(`Target does not exist`)
        return cy.wrap($el).should('not.exist') // Assert non-existence
      } else {
        cy.log(`Target exists but should not be visible`)
        return cy.wrap($el).should('not.be.visible') // Assert it’s not visible
      }
    })
  } else {
    throw new Error('Invalid target type')
  }
}

export function assertShowing(target: Target, options = {}) {
  return find(target, options).should('be.visible')
}

// export function assertText(target: Target, text: string) {
//   return find(target).should('have.text', text)
// }

// export function assertText(target: Target, text: string) {
//   return find(target).then(($el) => {
//     const isInput = $el.is('input, textarea') // Check if the element is an input or textarea

//     if (isInput) {
//       const value = $el.val() // Get the input value
//       if (value) {
//         // Assert the input value if it's not empty
//         expect(value).to.equal(text)
//       } else {
//         // Assert the text of the parent element if the input value is empty
//         const parentText = $el.parent().text().trim()
//         expect(parentText).to.equal(text)
//       }
//     } else {
//       // Assert the text if the element is not an input
//       const elementText = $el.text().trim()
//       expect(elementText).to.equal(text)
//     }
//   })
// }

export function assertText(target: Target, text: string) {
  return find(target).should(($el) => {
    const isInput = $el.is('input, textarea') // Check if the element is an input or textarea

    if (isInput) {
      const value = $el.val() // Get the input value
      if (value) {
        // Assert the input value if it's not empty
        expect(value).to.equal(text)
      } else {
        // Assert the text of the parent element if the input value is empty
        const parentText = $el.parent().text().trim()
        expect(parentText).to.equal(text)
      }
    } else {
      // Assert the text if the element is not an input
      const elementText = $el.text().trim()
      expect(elementText).to.equal(text)
    }
  })
}

export function assertHtmlContains(target: Target, htmlFragment: string) {
  return find(target).should(($el) => {
    const elementHtml = $el.html(); // Get the HTML content of the element
    expect(elementHtml).to.include(htmlFragment); // Assert that the HTML contains the fragment
  });
}

export function assertHtmlNotContains(target: Target, htmlFragment: string) {
  return find(target).should(($el) => {
    const elementHtml = $el.html(); // Get the HTML content of the element
    expect(elementHtml).to.not.include(htmlFragment); // Assert that the HTML does not contain the fragment
  });
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

export function assertChecked(target: Target) {
  return find(target).find('.q-toggle__inner--truthy').should('exist')
}

export function assertNotChecked(target: Target) {
  return find(target).find('.q-toggle__inner--falsy').should('exist')
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

export function assertHasClass(target: Target, className: string) {
  return find(target).should('have.class', className)
}

export function assertErrorHint(target: Target, text: string): HtmlElementWrapper {
  // This throws Syntax error, unrecognized expression: ...
  // return `('.q-field:has(${tag}) div[role=alert]')`

  cy.wait(500)
  const el = find(target).closest('.q-field').find('div[role="alert"]')
  return assertText(el, text)
}

