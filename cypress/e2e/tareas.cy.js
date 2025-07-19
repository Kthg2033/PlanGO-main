describe('Tareas Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8100/tareas');
    cy.wait(800);
  });

  it('rellena el formulario y guarda la tarea', () => {
    // 1. Abrir formulario
    cy.get('ion-icon[name="add"]').click({ force: true });
    cy.wait(800);

    // 2. Nombre
    cy.get('ion-input[formControlName="nombre"] input')
      .type('Tarea Cypress', { force: true });
    cy.wait(800);

    // 3. Descripción
    cy.get('ion-textarea[formControlName="descripcion"] textarea')
      .type('Descripción Cypress', { force: true });
    cy.wait(800);

    // 4. Prioridad
    cy.get('ion-select[formControlName="prioridad"]').click({ force: true });
    cy.wait(500);
    cy.get('ion-alert, ion-popover').filter(':visible').within(() => {
      cy.contains('Alta').click({ force: true });
      cy.contains('OK').click({ force: true });
    });
    cy.wait(800);

    // 5. Categoría
    cy.get('ion-select[formControlName="categoria"]').click({ force: true });
    cy.wait(500);
    cy.get('ion-alert, ion-popover').filter(':visible').within(() => {
      cy.contains('Productividad').click({ force: true });
      cy.contains('OK').click({ force: true });
    });
    cy.wait(800);

    // 6. Fecha
    cy.get('ion-datetime[formControlName="fechaSugerida"]').then($el => {
      const datetimeEl = $el[0];
      datetimeEl.value = '2025-07-17';
      datetimeEl.dispatchEvent(new Event('ionChange', { bubbles: true }));
      datetimeEl.dispatchEvent(new Event('change', { bubbles: true }));
    });
    cy.wait(800);

    // 7. Notas
    cy.get('ion-textarea[formControlName="notas"] textarea')
      .type('Notas personales Cypress', { force: true });
    cy.wait(800);

    // 8. Toggle completada
    cy.get('ion-toggle[formControlName="completada"]').click({ force: true });
    cy.wait(800);

    // 9. Guardar
    cy.get('ion-button[type="submit"]', { timeout: 10000 })
      .should('exist')
      .should('not.be.disabled')
      .scrollIntoView()
      .click({ force: true });

    cy.wait(1200);

    // 10. Verifica que se muestra la tarea en la interfaz
    cy.contains('Descripción Cypress', { timeout: 10000 }).should('exist');
  });
});
