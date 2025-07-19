describe('Agenda Page', () => {
  beforeEach(() => {
    cy.visit('/agenda');  // Ruta a la página Agenda en tu app
  });

  it('should show Agenda title', () => {
    cy.get('ion-title').should('contain', 'Agenda');
  });

  it('should show no events text or a list', () => {
    cy.get('ion-content').then(content => {
      if (content.text().includes('No hay eventos')) {
        cy.get('ion-text').should('contain', 'No hay eventos');
      } else {
        cy.get('ion-list ion-item').should('exist');
      }
    });
  });
});
