/**
 * Cypress runner for Settings Translations tests.
 *
 * This is a thin wrapper that runs the shared test specification
 * using the Cypress adapter.
 */
import { createCypressAPI } from '../adapter/CypressAdapter'
import { registerTests } from '../../shared/runner'
import { settingsTranslationsTests } from '../../shared/specs/settings-translations.spec'

const api = createCypressAPI()

registerTests(settingsTranslationsTests, () => api, describe, it, beforeEach, {
  isSync: true,
})
