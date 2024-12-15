// cypress/support/e2e.ts
import * as u from '../e2e/CypressHelper';
import * as tags from 'src/tags'

type TestUtil = typeof u
const g = global as unknown as TestUtil & { tags: typeof tags }

// Attach to the global scope
g.assertChecked = u.assertChecked
g.assertCount = u.assertCount
g.assertDisabled = u.assertDisabled
g.assertEqual = u.assertEqual
g.assertEnabled = u.assertEnabled
g.assertErrorHint = u.assertErrorHint
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
g.navigate = u.navigate
g.nested = u.nested
g.nth = u.nth
g.second = u.second
g.select = u.select
g.t = u.t
g.tag = u.tag
g.third = u.third
g.title = u.title
g.tooltip = u.tooltip
g.type = u.type
g.visible = u.visible

g.tags = tags
