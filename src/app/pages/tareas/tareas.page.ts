import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { Tarea } from 'src/app/models/tarea.model';
import { NavController } from '@ionic/angular';  // <-- importar NavController

@Component({
  selector: 'app-tareas',
  templateUrl: './tareas.page.html',
  styleUrls: ['./tareas.page.scss'],
  standalone: false,
})
export class TareasPage implements OnInit {
  tareas: Tarea[] = [];

  constructor(
    private api: ApiService,
    private router: Router,
    private navCtrl: NavController  // <-- inyectar NavController
  ) {}

  ngOnInit() {
    this.cargarTareas();
  }

  ionViewWillEnter() {
    this.cargarTareas();
  }

  cargarTareas() {
    this.api.getTareas().subscribe(data => {
      this.tareas = data;
    });
  }

  editarTarea(id: number) {
    this.router.navigate(['/tarea-form', id]);
  }

  agregarTarea() {
    this.router.navigate(['/tarea-form']);
  }

  eliminarTarea(id: number) {
    this.api.eliminarTarea(id).subscribe(() => {
      this.cargarTareas();
    });
  }

  toggleCompletada(tarea: Tarea) {
    tarea.completada = !tarea.completada;
    if (tarea.completada) {
      tarea.puntos += 10;
      tarea.racha += 1;
    } else {
      tarea.racha = 0;
    }
    this.api.actualizarTarea(tarea.id, tarea).subscribe();
  }

  // <-- Aquí el método para volver atrás
  volverAtras() {
    this.navCtrl.back();
  }
}
