/**
 * Cypress runner for Home Page tests.
 *
 * This is a thin wrapper that runs the shared test specification
 * using the Cypress adapter.
 */
import { createCypressAPI } from '../adapter/CypressAdapter'
import { registerTests } from '../../shared/runner'
import { homePageTests } from '../../shared/specs/home.spec'

const api = createCypressAPI()

registerTests(homePageTests, () => api, describe, it, beforeEach, {
  isSync: true,
})
