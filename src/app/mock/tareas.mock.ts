import { Tarea } from '../models/tarea.model';

export const TAREAS_MOCK: Tarea[] = [
  {
    id: 1,
    nombre: 'Salir a caminar 🚶‍♀️',
    descripcion: '10.000 pasos hoy',
    prioridad: 'Alta',
    categoria: 'Salud',
    fechaSugerida: '2025-07-01',
    puntos: 0,
    racha: 0,
    notas: 'Llevar botella de agua',
    completada: false
  },
  {
    id: 2,
    nombre: 'Leer un libro 📚',
    descripcion: '30 min de lectura',
    prioridad: 'Media',
    categoria: 'Estudio',
    fechaSugerida: '2025-07-02',
    puntos: 0,
    racha: 0,
    notas: 'Empezar con el capítulo 4',
    completada: false
  },
  {
    id: 3,
    nombre: 'Revisar finanzas 💰',
    descripcion: 'Organizar gastos del mes',
    prioridad: 'Baja',
    categoria: 'Finanzas',
    fechaSugerida: '2025-07-03',
    puntos: 0,
    racha: 0,
    notas: 'Ver movimientos bancarios',
    completada: false
  }
];
