// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

const apiUrl = () => Cypress.env("apiUrl") || "http://localhost:8000";

Cypress.Commands.add(
  "loginAsTestUser",
  ({
    email = "e2e-volunteer@example.com",
    name = "E2E Volunteer",
    role = "volunteer",
  } = {}) => {
    cy.request({
      method: "POST",
      url: `${apiUrl()}/auth/test-login/`,
      body: { email, name, role },
    }).then((res) => {
      expect(res.status).to.eq(200);
    });
  }
);

Cypress.Commands.add(
  "seedSlotRule",
  ({ start_time, repeat_until = null, group = "all" }) => {
    cy.request(`${apiUrl()}/auth/csrf/`).then((csrfRes) => {
      const token = csrfRes.body.csrfToken;
      cy.request({
        method: "POST",
        url: `${apiUrl()}/api/slot-rules/`,
        body: { start_time, repeat_until, group },
        headers: { "X-CSRFToken": token },
      }).then((res) => {
        expect(res.status).to.eq(201);
      });
    });
  }
);

Cypress.Commands.add("clearSlotRules", () => {
  cy.request(`${apiUrl()}/auth/csrf/`).then((csrfRes) => {
    const token = csrfRes.body.csrfToken;
    cy.request(`${apiUrl()}/api/slot-rules/`).then((listRes) => {
      listRes.body.forEach((slot) => {
        cy.request({
          method: "DELETE",
          url: `${apiUrl()}/api/slot-rules/${slot.id}/`,
          headers: { "X-CSRFToken": token },
        });
      });
    });
  });
});
