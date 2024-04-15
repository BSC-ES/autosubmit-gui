const { defineConfig } = require("cypress");
require("dotenv").config({ path: ".env.cypress" });

console.log({
  CYPRESS_BASE_URL: process.env.CYPRESS_BASE_URL,
  CYPRESS_EXTERNAL_API: process.env.CYPRESS_EXTERNAL_API,
});

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      require("@cypress/code-coverage/task")(on, config);
      config.baseUrl = process.env.CYPRESS_BASE_URL;
      config.env.EXTERNAL_API = process.env.CYPRESS_EXTERNAL_API;

      return config;
    },
  },
});
