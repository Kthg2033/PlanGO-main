describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8100/login');
    cy.wait(800);
  });

  it('inicia sesión con correo y contraseña válidos', () => {
    // Correo
    cy.get('ion-input[name="usuario"] input', { timeout: 5000 })
      .should('exist')
      .type('kathy@example.com', { force: true });
    cy.wait(800);

    // Contraseña
    cy.get('ion-input[name="password"] input', { timeout: 5000 })
      .should('exist')
      .type('K123456@', { force: true });
    cy.wait(800);

    // Ingresar
    cy.contains('ion-button', /ingresar/i)
      .scrollIntoView()
      .click({ force: true });
    cy.wait(800);

    // Verificación
    cy.contains(/bienvenido/i, { timeout: 10000 }).should('be.visible');
    cy.wait(800);
  });
});
