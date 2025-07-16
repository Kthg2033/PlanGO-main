import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Tarea } from '../../models/tarea.model';

@Component({
  selector: 'app-tarea-form',
  templateUrl: './tarea-form.page.html',
  styleUrls: ['./tarea-form.page.scss'],
  standalone:false,
})
export class TareaFormPage implements OnInit {
  tareaForm!: FormGroup;
  tareaId: number | null = null;
  editMode: boolean = false;

  prioridades = ['Alta', 'Media', 'Baja'];
  categorias = ['Salud', 'Productividad', 'Hogar', 'Finanzas', 'Estudio'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService
  ) {}

  ngOnInit() {
    // Inicializa el formulario con validaciones
    this.tareaForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      prioridad: ['', Validators.required],
      categoria: ['', Validators.required],
      fechaSugerida: [''],
      notas: [''],
      completada: [false]
    });

    // Revisar si hay ID para modo edición
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.tareaId = +idParam;
      this.editMode = true;

      // Cargar tarea y setear valores en formulario
      this.api.getTarea(this.tareaId).subscribe({
        next: (data: Tarea) => {
          this.tareaForm.patchValue(data);
        },
        error: (error) => {
          console.error('Error al cargar la tarea:', error);
        }
      });
    }
  }

  guardar(): void {
    console.log('Guardar fue presionado');

    if (!this.tareaForm.valid) {
      console.log('Formulario inválido:', this.tareaForm.value);
      return;
    }

    if (this.editMode && this.tareaId !== null) {
      // Actualizar tarea existente
      const tareaActualizada: Tarea = {
        ...this.tareaForm.value,
        id: this.tareaId,
        puntos: 0,
        racha: 0
      };
      console.log('Actualizando tarea:', tareaActualizada);

      this.api.actualizarTarea(this.tareaId, tareaActualizada).subscribe({
        next: () => {
          console.log('Tarea actualizada con éxito');
          this.router.navigate(['/tareas']);
        },
        error: (error) => {
          console.error('Error al actualizar:', error);
        }
      });
    } else {
      // Crear nueva tarea
      const nuevaTarea: Omit<Tarea, 'id'> = {
        ...this.tareaForm.value,
        puntos: 0,
        racha: 0
      };
      console.log('Creando nueva tarea:', nuevaTarea);

      this.api.crearTarea(nuevaTarea).subscribe({
        next: () => {
          console.log('Tarea creada con éxito');
          this.router.navigate(['/tareas']);
        },
        error: (error) => {
          console.error('Error al crear tarea:', error);
        }
      });
    }
  }
}
