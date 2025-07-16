export interface Tarea {
  id: number;
  nombre: string;
  descripcion: string;
  prioridad: 'Alta' | 'Media' | 'Baja';
  categoria: 'Salud' | 'Productividad' | 'Hogar' | 'Finanzas' | 'Estudio';
  fechaSugerida: string; // formato ISO ej: "2025-07-01"
  puntos: number;        // puntos de gamificación
  racha: number;         // días consecutivos completados
  notas: string;         // notas personales del usuario
  completada: boolean;
}
