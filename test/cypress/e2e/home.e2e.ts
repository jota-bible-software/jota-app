// pageTests.spec.ts

import { DriverInterface } from './DriverInterface'
import { CypressDriver } from './CypressDriver' // Or PlaywrightDriver if swapping

describe('Page Tests', () => {
  let driver: DriverInterface

  beforeEach(() => {
    driver = new CypressDriver()
  })

  it('should assert that <title> is correct', () => {
    driver.visit()

    driver.getTitle().should('include', 'Jota Bible App')

    // // Example of clicking list item
    // driver.findBySelector('li').first().click()
    // driver.findByText('Clicks on todos: 1').shouldContainText('Clicks on todos: 1')
  })
})
