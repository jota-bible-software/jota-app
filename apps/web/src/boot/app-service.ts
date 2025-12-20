/**
 * App Service Boot File
 * Initializes the app service and sets up notifications
 */

import { boot } from 'quasar/wrappers'
import { Notify } from 'quasar'
import { initializeAppService } from '../services/app-service'

export default boot(async ({ app }) => {
  // Initialize the app service
  const appService = initializeAppService()

  // Register Quasar notification handler
  appService.notifications.setHandler((options) => {
    Notify.create({
      message: options.message,
      type: options.type,
      caption: options.caption,
      timeout: options.timeout,
    })
  })

  // Initialize (loads highlights, etc.)
  await appService.initialize()

  // Make app service available globally via provide/inject
  app.provide('appService', appService)
})
