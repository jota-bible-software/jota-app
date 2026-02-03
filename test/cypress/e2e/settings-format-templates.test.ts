/**
 * Cypress runner for Settings Format Templates tests.
 *
 * This is a thin wrapper that runs the shared test specification
 * using the Cypress adapter.
 */
import { createCypressAPI } from '../adapter/CypressAdapter'
import { registerTests } from '../../shared/runner'
import { settingsFormatTemplatesTests } from '../../shared/specs/settings-format-templates.spec'

const api = createCypressAPI()

registerTests(
  settingsFormatTemplatesTests,
  () => api,
  describe,
  it,
  beforeEach,
  { isSync: true }
)
