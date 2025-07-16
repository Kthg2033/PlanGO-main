import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class EventosService {
  private eventos: any[] = [];
  private notas: any[] = [];

  agregarEvento(evento: any) {
    this.eventos.push(evento);
  }

  obtenerEventos(): any[] {
    return this.eventos;
  }

  obtenerEventosPorFecha(fecha: string): any[] {
    return this.eventos.filter(e => e.fecha === fecha);
  }

  agregarNota(nota: any) {
    this.notas.push(nota);
  }

  obtenerNotas(): any[] {
    return this.notas;
  }

  obtenerNotasPorFecha(fecha: string): any[] {
    return this.notas.filter(n => n.fecha === fecha);
  }
}
