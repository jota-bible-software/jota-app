// import registerCodeCoverageTasks from '@cypress/code-coverage/task'
// import { injectQuasarDevServerConfig } from '@quasar/quasar-app-extension-testing-e2e-cypress/cct-dev-server'
import { defineConfig } from 'cypress'

export default defineConfig({
  fixturesFolder: false, // 'test/cypress/fixtures',
  screenshotsFolder: 'test/cypress/screenshots',
  videosFolder: 'test/cypress/videos',
  video: true,
  watchForFileChanges: true,
  e2e: {
    // setupNodeEvents(on, config) {
    //   registerCodeCoverageTasks(on, config);
    //   return config;
    // },
    baseUrl: 'http://localhost:8080/',
    
    supportFile: 'test/cypress/support/e2e.ts',
    specPattern: 'test/cypress/e2e/**/*.{cy,test}.{js,jsx,ts,tsx}',
    viewportWidth: 1080, // Set the desired width
    viewportHeight: 768, // Set the desired height
  },
})
