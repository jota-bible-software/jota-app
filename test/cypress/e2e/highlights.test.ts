/**
 * Cypress runner for Highlights tests.
 *
 * This is a thin wrapper that runs the shared test specification
 * using the Cypress adapter.
 */
import { createCypressAPI } from '../adapter/CypressAdapter'
import { registerTests } from '../../shared/runner'
import { highlightsTests } from '../../shared/specs/highlights.spec'

const api = createCypressAPI()

registerTests(highlightsTests, () => api, describe, it, beforeEach, {
  isSync: true,
})
