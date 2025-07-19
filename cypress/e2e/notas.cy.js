describe('Notas Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8100/notas');
    cy.wait(800);
  });

  it('crea y elimina una nota seleccionando día 15, mes Julio, año 2025', () => {
    // ✅ Título
    cy.get('ion-input')
      .find('input', { includeShadowDom: true })
      .type('Mi primera nota', { force: true });
    cy.wait(800);

    // ✅ Contenido
    cy.get('ion-textarea')
      .find('textarea')
      .type('Nota con fecha seleccionada', { force: true });
    cy.wait(800);

    // ✅ Día 15
    cy.get('ion-select[placeholder="Día"]').click({ force: true });
    cy.get('ion-alert, ion-popover')
      .should('be.visible')
      .within(() => {
        cy.contains(/^15$/).click({ force: true });
      });
    cy.wait(800);

    // ✅ Mes Julio
    cy.get('ion-select[placeholder="Mes"]').click({ force: true });
    cy.get('ion-alert, ion-popover')
      .should('be.visible')
      .within(() => {
        cy.contains(/^Julio$/i).click({ force: true });
      });
    cy.wait(800);

    // ✅ Año 2025
    cy.get('ion-select[placeholder="Año"]').click({ force: true });
    cy.get('ion-alert, ion-popover')
      .should('be.visible')
      .within(() => {
        cy.contains(/^2025$/).click({ force: true });
      });
    cy.wait(800);

    // ✅ Guardar
    cy.contains('ion-button', /guardar/i)
      .scrollIntoView()
      .should('be.visible')
      .click({ force: true });
    cy.wait(1000);

    // ✅ Verificar que la nota fue guardada
    cy.contains('Mi primera nota').should('exist');
    cy.wait(800);

    // ✅ Eliminar la nota
    cy.contains('Mi primera nota').click({ force: true });
    cy.wait(800);
    cy.contains('ion-button', /eliminar nota/i)
      .scrollIntoView()
      .click({ force: true });
    cy.wait(800);

    // ✅ Confirmar que ya no aparece
    cy.contains('Mi primera nota').should('not.exist');
  });
});
