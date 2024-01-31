const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://todomvc-vanillajs.test-targets.dev/',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
