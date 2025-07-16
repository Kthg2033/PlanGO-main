import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Storage } from '@ionic/storage-angular';

interface Usuario {
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  genero: string;
  fechaNacimiento: string;
  email: string;
  telefono: string;
  pais: string;
  contrasena: string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone:false,
})
export class RegisterPage {
  usuario: Usuario = {
    nombres: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    genero: '',
    fechaNacimiento: '',
    email: '',
    telefono: '',
    pais: '',
    contrasena: ''
  };

  confirmarContrasena = '';
  fechaFormateada = '';

  constructor(
    private toastController: ToastController,
    private router: Router,
    private storage: Storage
  ) {}

  async ngOnInit() {
    await this.storage.create();
  }

  async registrar(formulario: NgForm) {
    if (formulario.invalid) return;

    if (this.usuario.contrasena !== this.confirmarContrasena) {
      this.mostrarToast('Las contraseñas no coinciden', 'danger');
      return;
    }

    await this.storage.set('usuario', this.usuario);
    console.log('Usuario registrado y guardado en Storage:', this.usuario);

    this.mostrarToast('¡Registro exitoso!', 'success');
    this.router.navigate(['/login']);
  }

  guardarFecha(event: CustomEvent) {
    const valor = event.detail.value;
    this.usuario.fechaNacimiento = valor;

    const fecha = new Date(valor);
    this.fechaFormateada = fecha.toLocaleDateString('es-CL', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }

  async mostrarToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'bottom'
    });
    await toast.present();
  }
}
