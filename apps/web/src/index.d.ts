import { JotaTestSupport } from './types'

export { }

declare global {
  interface Window {
    _jota_test_support: JotaTestSupport
  }
}
