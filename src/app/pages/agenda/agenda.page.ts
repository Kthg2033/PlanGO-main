import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-agenda',
  standalone:false,
  templateUrl: './agenda.page.html',
  styleUrls: ['./agenda.page.scss']
})
export class AgendaPage implements OnInit {
  eventos: any[] = [];

  ngOnInit() {
    const guardados = localStorage.getItem('eventos');
    if (guardados) {
      this.eventos = JSON.parse(guardados);

      // Ordenar por fecha y hora
      this.eventos.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
    }
  }
}
