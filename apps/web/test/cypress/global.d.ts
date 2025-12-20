import { JotaTestSupport } from 'src/types'
import * as u from './e2e/CypressHelper'
import * as importedTags from 'src/tags'

declare global {
  const assertChecked: typeof u.assertChecked
  const assertClipboard: typeof u.assertClipboard
  const assertCount: typeof u.assertCount
  const assertDisabled: typeof u.assertDisabled
  const assertEqual: typeof u.assertEqual
  const assertEnabled: typeof u.assertEnabled
  const assertErrorHint: typeof u.assertErrorHint
  const assertHasClass: typeof u.assertHasClass
  const assertHtmlContains: typeof u.assertHtmlContains
  const assertHtmlNotContains: typeof u.assertHtmlNotContains
  const assertLookDisabled: typeof u.assertLookDisabled
  const assertLookEnabled: typeof u.assertLookEnabled
  const assertNotChecked: typeof u.assertNotChecked
  const assertNotShowing: typeof u.assertNotShowing
  const assertShowing: typeof u.assertShowing
  const assertText: typeof u.assertText
  const assertTextContains: typeof u.assertTextContains
  const assertTextNotContains: typeof u.assertTextNotContains
  const assertValue: typeof u.assertValue
  const assertValueContains: typeof u.assertValueContains
  const assertValueNotContains: typeof u.assertValueNotContains
  const click: typeof u.click
  const clickDialogNo: typeof u.clickDialogNo
  const clickDialogYes: typeof u.clickDialogYes
  const containsText: typeof u.containsText
  const errorHint: typeof u.errorHint
  const find: typeof u.find
  const first: typeof u.first
  const focusOn: typeof u.focusOn
  const forEach: typeof u.forEach
  const last: typeof u.last
  const mockClipboard: typeof u.mockClipboard
  const navigate: typeof u.navigate
  const nested: typeof u.nested
  const nth: typeof u.nth
  const pressKey: typeof u.pressKey
  const second: typeof u.second
  const select: typeof u.select
  const setCaret: typeof u.setCaret
  const t: typeof u.t
  const tag: typeof u.tag
  const third: typeof u.third
  const title: typeof u.title
  const tooltip: typeof u.tooltip
  const type: typeof u.type
  const visible: typeof u.visible

  const tags: typeof importedTags

  interface Window {
    _jota_test_support: JotaTestSupport
  }
}

declare namespace Cypress {
  interface Chainable {
    /**
     * Mocks the clipboard API to capture clipboard data.
     * @param clipboard.value A string reference to hold the clipboard content.
     */
    mockClipboard(clipboard: { value: string }): void
  }
}

export { }
