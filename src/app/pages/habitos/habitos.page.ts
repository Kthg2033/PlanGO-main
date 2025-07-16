import { Component } from '@angular/core';

interface Habito {
  icono: string;
  nombre: string;
  color: string;
  dias: boolean[];
  racha: number;
}

@Component({
  selector: 'app-habitos',
  templateUrl: './habitos.page.html',
  styleUrls: ['./habitos.page.scss'],
  standalone:false,
})
export class HabitosPage {
  habitTemplates: Omit<Habito, 'dias' | 'racha'>[] = [
    { icono: '🚶', nombre: 'Caminar 30 min', color: '#4caf50' },
    { icono: '🚰', nombre: 'Beber 2L de agua', color: '#2196f3' },
    { icono: '🧘', nombre: 'Meditar 10 min', color: '#9c27b0' },
    { icono: '📖', nombre: 'Leer 15 min', color: '#ff9800' },
    { icono: '💤', nombre: 'Dormir 7h', color: '#3f51b5' },
    { icono: '🏃', nombre: 'Correr 20 min', color: '#f44336' },
    { icono: '🙏', nombre: 'Gratitud diaria', color: '#795548' },
  ];

  habitosFiltrados: Habito[] = [];

  agregarHabito(template: Omit<Habito, 'dias' | 'racha'>): void {
    const nuevoHabito: Habito = {
      icono: template.icono,
      nombre: template.nombre,
      color: template.color,
      dias: [false, false, false, false, false, false, false],
      racha: 0
    };
    this.habitosFiltrados.push(nuevoHabito);
  }

  toggleDia(habito: Habito, index: number): void {
    habito.dias[index] = !habito.dias[index];
    habito.racha = habito.dias.filter((d: boolean) => d).length;
  }

  progreso(habito: Habito): number {
    return habito.dias.filter((d: boolean) => d).length;
  }
}
