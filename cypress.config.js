const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://api.hubapi.com',
    
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    env:{
      HUB_BEARER_TOKEN: `pat-na1-3c7aa418-fe85-4c71-8754-608b92119efd`
    }
  },
});
