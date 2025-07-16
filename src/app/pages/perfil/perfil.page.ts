import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone:false,
})
export class PerfilPage implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  usuario: any = {};

  constructor(
    private storage: Storage,
    private toastController: ToastController
  ) {}

  async ngOnInit() {
    await this.storage.create();
    await this.cargarUsuario();
  }

  async cargarUsuario() {
    this.usuario = await this.storage.get('usuario') || {};
    if (this.usuario.fechaNacimiento) {
      this.usuario.fechaNacimiento = new Date(this.usuario.fechaNacimiento)
        .toISOString().substring(0, 10);
    }
  }

  async guardarCambios() {
    if (this.usuario.fechaNacimiento) {
      this.usuario.fechaNacimiento = new Date(this.usuario.fechaNacimiento)
        .toISOString().substring(0, 10);
    }
    await this.storage.set('usuario', this.usuario);
    this.mostrarToast('Datos actualizados correctamente', 'success');
  }

  seleccionarFoto() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = async () => {
      this.usuario.foto = reader.result as string;
      await this.storage.set('usuario', this.usuario);
      this.mostrarToast('Foto actualizada', 'success');
    };

    reader.readAsDataURL(file);
  }

  async mostrarToast(msg: string, color: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      color,
      position: 'bottom'
    });
    await toast.present();
  }
}
