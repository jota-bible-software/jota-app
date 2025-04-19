import * as u from '../e2e/CypressHelper'
import * as tags from 'src/tags'
import './commands'
// import fs from 'fs'

type TestUtil = typeof u
const g = globalThis as unknown as TestUtil & { tags: typeof tags }

// Attach to the global scope
g.assertChecked = u.assertChecked
g.assertClipboard = u.assertClipboard
g.assertCount = u.assertCount
g.assertDisabled = u.assertDisabled
g.assertEqual = u.assertEqual
g.assertEnabled = u.assertEnabled
g.assertErrorHint = u.assertErrorHint
g.assertHasClass = u.assertHasClass
g.assertHtmlContains = u.assertHtmlContains
g.assertHtmlNotContains = u.assertHtmlNotContains
g.assertLookDisabled = u.assertLookDisabled
g.assertLookEnabled = u.assertLookEnabled
g.assertNotChecked = u.assertNotChecked
g.assertNotShowing = u.assertNotShowing
g.assertShowing = u.assertShowing
g.assertText = u.assertText
g.assertTextContains = u.assertTextContains
g.assertTextNotContains = u.assertTextNotContains
g.assertValue = u.assertValue
g.assertValueContains = u.assertValueContains
g.assertValueNotContains = u.assertValueNotContains
g.click = u.click
g.clickDialogNo = u.clickDialogNo
g.clickDialogYes = u.clickDialogYes
g.containsText = u.containsText
g.errorHint = u.errorHint
g.find = u.find
g.first = u.first
g.focusOn = u.focusOn
g.forEach = u.forEach
g.last = u.last
g.mockClipboard = u.mockClipboard
g.navigate = u.navigate
g.nested = u.nested
g.nth = u.nth
g.pressKey = u.pressKey
g.second = u.second
g.select = u.select
g.setCaret = u.setCaret
g.t = u.t
g.tag = u.tag
g.third = u.third
g.title = u.title
g.tooltip = u.tooltip
g.type = u.type
g.visible = u.visible

g.tags = tags

beforeEach(() => {
  cy.intercept('GET', 'jota/data/*/*.json', (req) => {
    const names = req.url.split('/') // e.g., 'kjv.json' or 'niv.json'
    const fileName = names[names.length - 1].toLowerCase()
    const locale = names[names.length - 2]
    const fixture = `${locale}/${fileName}`

    req.reply({
      statusCode: 200, // default
      fixture
    })
  })
})
