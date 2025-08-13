import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4000', // укажи свой порт/хост, если он отличается
    setupNodeEvents(on, config) {
      // любые хендлеры плагинов можно указать здесь, если нужно
    },
    specPattern: 'cypress/e2e/**/*.cy.{js,ts,jsx,tsx}',
  },
});