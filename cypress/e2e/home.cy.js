describe('Home Page - Completar evento con horas y guardar', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8100/home');
    cy.wait(800);
  });

  it('crea un evento con fecha, notas, repetir, horas y guarda', () => {
    // Seleccionar el primer día visible en el calendario
    cy.contains('.fc-daygrid-day', /\b\d+\b/).first().click({ force: true });
    cy.wait(1000);

    // Esperar modal visible
    cy.get('ion-modal', { timeout: 10000 }).should('be.visible').wait(800);

    // Título
    cy.contains('Título').parent().find('input')
      .type('Evento Cypress', { force: true });
    cy.wait(800);

    // Ubicación
    cy.contains('Ubicación').parent().find('input')
      .type('Providencia', { force: true });
    cy.wait(800);

    // Notas
    cy.get('ion-modal').find('ion-textarea').first().find('textarea')
      .type('Reunión importante en Providencia.', { force: true });
    cy.wait(800);

    // Repetir
    cy.contains('Repetir').parent().find('ion-select').click({ force: true });
    cy.wait(800);
    cy.get('ion-alert').contains(/^Nunca$/i).click({ force: true });
    cy.get('ion-alert').contains(/OK|Aceptar|Cerrar/i).click({ force: true });
    cy.wait(800);

    // Hora Inicio usando dispatch manual (por nombre)
    cy.contains('Hora Inicio')
      .parents('ion-item')
      .find('ion-datetime')
      .then($el => {
        const datetimeEl = $el[0];
        datetimeEl.value = '2025-07-17T08:00:00';
        datetimeEl.dispatchEvent(new Event('ionChange', { bubbles: true }));
        datetimeEl.dispatchEvent(new Event('change', { bubbles: true }));
      });
    cy.wait(800);

    // Hora Fin
    cy.contains('Hora Fin')
      .parents('ion-item')
      .find('ion-datetime')
      .then($el => {
        const datetimeEl = $el[0];
        datetimeEl.value = '2025-07-17T09:00:00';
        datetimeEl.dispatchEvent(new Event('ionChange', { bubbles: true }));
        datetimeEl.dispatchEvent(new Event('change', { bubbles: true }));
      });
    cy.wait(800);

    // Guardar evento
    cy.get('ion-button').contains(/Guardar|Aceptar/i).click({ force: true });
    cy.wait(1200);

    // Validar que el evento aparece en el calendario
    cy.get('.fc-event').should('exist').and('contain.text', 'Evento Cypress');
  });
});
