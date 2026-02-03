/**
 * Cypress runner for Settings Copy Templates tests.
 *
 * This is a thin wrapper that runs the shared test specification
 * using the Cypress adapter.
 */
import { createCypressAPI } from '../adapter/CypressAdapter'
import { registerTests } from '../../shared/runner'
import { settingsCopyTemplatesTests } from '../../shared/specs/settings-copy-templates.spec'

const api = createCypressAPI()

registerTests(settingsCopyTemplatesTests, () => api, describe, it, beforeEach, {
  isSync: true,
})
