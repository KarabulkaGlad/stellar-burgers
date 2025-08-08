describe('Burger Constructor Page', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('должен отобразить хотя бы один ингредиент в каждой категории', () => {
    cy.get('[data-testid="category-buns"] [data-testid^="ingredient-"]').should('have.length.at.least', 1);
    cy.get('[data-testid="category-mains"] [data-testid^="ingredient-"]').should('have.length.at.least', 1);
    cy.get('[data-testid="category-sauces"] [data-testid^="ingredient-"]').should('have.length.at.least', 1);
  });

  it('добавление ингредиента в конструктор', () => {
    cy.get('[data-testid="category-mains"] [data-testid^="ingredient-"]')
      .first()
      .within(() => {
        cy.get('button').first().click();
      });

    cy.get('[data-testid="constructor-element"]').should('exist');
  });

  it('добавление булки в конструктор', () => {
    cy.get('[data-testid="category-buns"] [data-testid^="ingredient-7"]')
      .first()
      .within(() => {
        cy.get('button').first().click();
      });

    cy.get('.constructor-bun-top').should('exist');
    cy.get('.constructor-bun-bottom').should('exist');
  });

  it('открытие модального окна ингредиента', () => {
    cy.get('[data-testid^="ingredient-"]')
      .first()
      .find('a')
      .click();

    cy.contains('Детали ингредиента').should('exist');
    cy.get('[data-testid="ingredient-details"]').should('exist');
  });
  
  it('закрытие модального окна по крестику', () => {

    cy.get('[data-testid^="ingredient-"]')
      .first()
      .find('a')
      .click();

    cy.get('[data-testid="modal-close"]').click();
    cy.contains('Детали ингредиента').should('not.exist');
  });

  it('закрытие модального окна по клику на оверлей', () => {
  cy.get('[data-testid^="ingredient-"]')
    .first()
    .find('a')
    .click();

  cy.get('[data-testid="modal-overlay"]').click({ force: true });
  cy.contains('Детали ингредиента').should('not.exist');
});
});