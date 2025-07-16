import { Injectable } from '@angular/core';

export interface Habito {
  id: string;
  nombre: string;
  prioridad: 'Alta' | 'Media' | 'Baja';
  frecuencia: 'Diario' | 'Semanal';
  completado: boolean;
  fecha: string; // última fecha de completado
  racha: number;
}

@Injectable({ providedIn: 'root' })
export class HabitosService {
  private STORAGE_KEY = 'habitos';
  private habitos: Habito[] = [];

  constructor() {
    this.cargar();
  }

  private cargar() {
    const data = localStorage.getItem(this.STORAGE_KEY);
    this.habitos = data ? JSON.parse(data) : [];
  }

  private guardar() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.habitos));
  }

  getAll(): Habito[] {
    return [...this.habitos]; 
  }

  add(h: Habito) {
    this.habitos.push(h);
    this.guardar();
  }

  update(h: Habito) {
    const index = this.habitos.findIndex(x => x.id === h.id);
    if (index > -1) {
      this.habitos[index] = { ...h };
      this.guardar();
    }
  }

  remove(id: string) {
    this.habitos = this.habitos.filter(h => h.id !== id);
    this.guardar();
  }

  saveAll() {
    this.guardar();
  }
}
