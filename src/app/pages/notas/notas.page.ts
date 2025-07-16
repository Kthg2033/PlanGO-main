import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

interface Nota {
  id: number;
  fecha: string;
  titulo: string;
  cuerpo: string;
  color: string;
}

@Component({
  selector: 'app-notas',
  standalone: false,
  templateUrl: './notas.page.html',
  styleUrls: ['./notas.page.scss']
})
export class NotasPage {
  fechaSeleccionada = '';
  readonly palette = ['#ffadad', '#ffd6a5', '#fdffb6', '#caffbf', '#9bf6ff', '#a0c4ff', '#bdb2ff', '#ffc6ff'];
  notas: Nota[] = [];
  nuevaNota: Partial<Nota> = { titulo: '', cuerpo: '', color: this.palette[0] };
  selectedId: number | null = null;

  // Fecha dividida
  fecha = { dia: '', mes: '', anio: '' };
  dias = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  meses = [
    { nombre: 'Enero', valor: '01' }, { nombre: 'Febrero', valor: '02' },
    { nombre: 'Marzo', valor: '03' }, { nombre: 'Abril', valor: '04' },
    { nombre: 'Mayo', valor: '05' }, { nombre: 'Junio', valor: '06' },
    { nombre: 'Julio', valor: '07' }, { nombre: 'Agosto', valor: '08' },
    { nombre: 'Septiembre', valor: '09' }, { nombre: 'Octubre', valor: '10' },
    { nombre: 'Noviembre', valor: '11' }, { nombre: 'Diciembre', valor: '12' }
  ];
  anios = Array.from({ length: 10 }, (_, i) => (2025 + i).toString());

  constructor(private route: ActivatedRoute) {
    const guardadas = localStorage.getItem('notas');
    this.notas = guardadas ? JSON.parse(guardadas) : this.notasPorDefecto();
    this.route.queryParams.subscribe(p => {
      this.fechaSeleccionada = p['fecha'] || '';
      this.filtrarNotasPorFecha();
    });
  }

  private notasPorDefecto(): Nota[] {
    return [
      { id: 1, fecha: '17-06-2025', titulo: 'Resumen reunión', cuerpo: 'Anotaciones importantes de la reunión.', color: this.palette[0] },
      { id: 2, fecha: '18-06-2025', titulo: 'Clase de estrategia', cuerpo: 'Ideas clave discutidas en clase.', color: this.palette[3] },
      { id: 3, fecha: '19-06-2025', titulo: 'Tareas pendientes', cuerpo: 'Revisar entregables del equipo.', color: this.palette[5] }
    ];
  }

  private syncStorage() {
    localStorage.setItem('notas', JSON.stringify(this.notas));
  }

  filtrarNotasPorFecha() {
    if (!this.fechaSeleccionada) return;
    this.notas = this.notas.filter(n => n.fecha === this.fechaSeleccionada);
  }

  guardarNota() {
    if (!this.nuevaNota.titulo?.trim()) return;

    const fechaFormateada = this.fecha.dia && this.fecha.mes && this.fecha.anio
      ? `${this.fecha.dia}-${this.fecha.mes}-${this.fecha.anio}`
      : this.fechaSeleccionada || new Date().toISOString().slice(0, 10);

    const nota: Nota = {
      id: Date.now(),
      fecha: fechaFormateada,
      titulo: this.nuevaNota.titulo!.trim(),
      cuerpo: this.nuevaNota.cuerpo || '',
      color: this.nuevaNota.color || this.palette[0]
    };

    this.notas.unshift(nota);
    this.syncStorage();
    this.nuevaNota = { titulo: '', cuerpo: '', color: this.palette[0] };
    this.fecha = { dia: '', mes: '', anio: '' };
  }

  eliminarNota(id?: number) {
    const targetId = id || this.selectedId;
    if (!targetId) return;
    this.notas = this.notas.filter(n => n.id !== targetId);
    this.syncStorage();
    this.selectedId = null;
  }

  seleccionarNota(id: number) {
    this.selectedId = this.selectedId === id ? null : id;
  }
}
