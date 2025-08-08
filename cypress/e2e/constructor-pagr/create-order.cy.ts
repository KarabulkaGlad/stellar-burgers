
describe('Создание заказа', () => {
  const mockAccessToken = 'fake-access-token';
  const mockRefreshToken = 'fake-refresh-token';

  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.setItem('accessToken', mockAccessToken);
    });
    cy.setCookie('refreshToken', mockRefreshToken);

    cy.intercept('GET', '**/auth/user', { fixture: 'user.json' }).as('user');
    cy.intercept('POST', '**/orders', { fixture: 'order.json' }).as('createOrder');
    cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');

    cy.visit('/');
    cy.wait('@getIngredients');
    cy.wait('@user');
  });

  afterEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('должен создать заказ', () => {
    cy.get('[data-testid="category-buns"] [data-testid="ingredient-7"]')
      .first()
      .within(() => {
        cy.get('button').first().click();
      });

    cy.get('[data-testid="category-mains"] [data-testid="ingredient-1"]')
      .first()
      .within(() => {
        cy.get('button').first().click();
      });

    cy.get('[data-testid="order-button"] button').first().click();
    cy.wait('@createOrder');
    cy.get('[data-testid="order-number"]').should('exist');
    
    cy.fixture('order.json').then((order) => {
      cy.get('[data-testid="order-number"]')
        .should('exist')
        .and('have.text', order.order.number.toString());
    });

    cy.get('[data-testid="modal-close"]').click();
    cy.get('.constructor-bun-top').should('not.exist');
    cy.get('.constructor-bun-bottom').should('not.exist');
    cy.get('[data-testid="constructor-element"]').should('not.exist');
  });
});