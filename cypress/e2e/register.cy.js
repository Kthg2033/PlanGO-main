describe('Register Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8100/register');
    cy.wait(800);
  });

  it('completa el formulario con número completo +56935969423 y selecciona Chile', () => {
    // Nombres
    cy.get('ion-input[name="nombres"]')
      .find('input', { includeShadowDom: true })
      .type('Kathy', { force: true });
    cy.wait(800);

    // Apellido paterno
    cy.get('ion-input[name="apellidoPaterno"]')
      .find('input', { includeShadowDom: true })
      .type('Perez', { force: true });
    cy.wait(800);

    // Apellido materno
    cy.get('ion-input[name="apellidoMaterno"]')
      .find('input', { includeShadowDom: true })
      .type('Gomez', { force: true });
    cy.wait(800);

    // Género
    cy.get('ion-select[name="genero"]').click({ force: true });
    cy.wait(800);
    cy.get('ion-alert, ion-popover').filter(':visible').within(() => {
      cy.contains('Femenino').click({ force: true });
      cy.contains('OK').click({ force: true });
    });
    cy.wait(800);

    // Fecha de nacimiento
    cy.get('ion-datetime[name="fechaNacimiento"]').then($el => {
      $el[0].value = '1994-12-05';
      $el[0].dispatchEvent(new Event('ionChange', { bubbles: true }));
      $el[0].dispatchEvent(new Event('change', { bubbles: true }));
    });
    cy.wait(800);

    // Email
    cy.get('ion-input[name="email"]')
      .find('input', { includeShadowDom: true })
      .type('kathy@example.com', { force: true });
    cy.wait(800);

    // Teléfono completo
    cy.get('ion-input[name="telefono"]')
      .find('input', { includeShadowDom: true })
      .type('+56935969423', { force: true });
    cy.wait(800);

    // País: Chile
    cy.get('ion-select[name="pais"]')
      .scrollIntoView()
      .should('exist')
      .click({ force: true });
    cy.wait(800);
    cy.get('ion-alert, ion-popover').filter(':visible').within(() => {
      cy.contains('Chile').click({ force: true });
      cy.contains('OK').click({ force: true });
    });
    cy.wait(800);

    // Contraseña
    cy.get('ion-input[name="contrasena"]')
      .find('input', { includeShadowDom: true })
      .type('K123456@', { force: true });
    cy.wait(800);

    // Confirmar contraseña
    cy.get('ion-input[name="confirmarContrasena"]')
      .find('input', { includeShadowDom: true })
      .type('K123456@', { force: true });
    cy.wait(800);

    // Registrar
    cy.get('ion-button[type="submit"]')
      .should('exist')
      .click({ force: true });
    cy.wait(1000);

    // Validar redirección
    cy.url({ timeout: 10000 }).should('include', '/login');
    cy.contains('Iniciar sesión', { timeout: 10000 }).should('be.visible');
  });
});
