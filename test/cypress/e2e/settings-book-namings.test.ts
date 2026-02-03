/**
 * Cypress runner for Settings Book Namings tests.
 *
 * This is a thin wrapper that runs the shared test specification
 * using the Cypress adapter.
 */
import { createCypressAPI } from '../adapter/CypressAdapter'
import { registerTests } from '../../shared/runner'
import { settingsBookNamingsTests } from '../../shared/specs/settings-book-namings.spec'

const api = createCypressAPI()

registerTests(settingsBookNamingsTests, () => api, describe, it, beforeEach, {
  isSync: true,
})
