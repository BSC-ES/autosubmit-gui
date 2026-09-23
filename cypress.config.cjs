const { defineConfig } = require("cypress");
require("dotenv").config({ path: ".env.cypress" });

console.log({
  CYPRESS_BASE_URL: process.env.CYPRESS_BASE_URL,
});

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      require("@cypress/code-coverage/task")(on, config);
      config.baseUrl = process.env.CYPRESS_BASE_URL;

      return config;
    },
  },
});
