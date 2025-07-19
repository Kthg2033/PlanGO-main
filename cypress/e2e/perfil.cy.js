describe('Perfil Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8100/perfil');
  });

  it('llena y guarda los campos del perfil desde vacío', () => {
    cy.wait(800);
    cy.get('ion-input').eq(0).find('input', { includeShadowDom: true })
      .clear({ force: true }).should('have.value', '').type('Kathy', { force: true });
    cy.wait(800);

    cy.get('ion-input').eq(1).find('input', { includeShadowDom: true })
      .clear({ force: true }).should('have.value', '').type('Perez', { force: true });
    cy.wait(800);

    cy.get('ion-input').eq(2).find('input', { includeShadowDom: true })
      .clear({ force: true }).should('have.value', '').type('Gomez', { force: true });
    cy.wait(800);

    cy.get('ion-input').eq(3).find('input', { includeShadowDom: true })
      .clear({ force: true }).should('have.value', '').type('Femenino', { force: true });
    cy.wait(800);

    cy.get('ion-datetime').then($el => {
      $el[0].value = '1994-12-05';
      $el[0].dispatchEvent(new Event('ionChange', { bubbles: true }));
      $el[0].dispatchEvent(new Event('change', { bubbles: true }));
    });
    cy.wait(800);

    cy.get('ion-input').eq(4).find('input', { includeShadowDom: true })
      .clear({ force: true }).should('have.value', '').type('kathy@example.com', { force: true });
    cy.wait(800);

    cy.get('ion-input').eq(5).find('input', { includeShadowDom: true })
      .clear({ force: true }).should('have.value', '').type('912345678', { force: true });
    cy.wait(800);

    cy.get('ion-input').eq(6).find('input', { includeShadowDom: true })
      .clear({ force: true }).should('have.value', '').type('Chile', { force: true });
    cy.wait(800);

    cy.get('ion-button').contains('Guardar cambios').click({ force: true });
    cy.wait(1000);

    cy.url().should('include', '/home');
    cy.contains('Kathy').should('be.visible');
  });
});
