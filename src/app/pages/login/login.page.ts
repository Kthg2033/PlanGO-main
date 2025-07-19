import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { PerfilService } from 'src/app/services/perfil.service';
import { Storage } from '@ionic/storage-angular';
import { ToastController, AnimationController } from '@ionic/angular';

@Component({
  standalone: false,
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  usuario = '';
  password = '';
  mostrarContrasena = false;

  @ViewChild('btnLogin', { read: ElementRef }) btnLogin!: ElementRef;

  constructor(
    private router: Router,
    private perfilService: PerfilService,
    private storage: Storage,
    private toastController: ToastController,
    private animationCtrl: AnimationController
  ) {}

  async ngOnInit() {
    await this.storage.create();
  }

  async login(): Promise<void> {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.usuario.trim())) {
      this.presentToast('Por favor ingresa un correo electrónico válido', 'danger');
      return;
    }

    const usuarioGuardado = await this.storage.get('usuario');

    if (!usuarioGuardado) {
      this.presentToast('No hay usuario registrado aún', 'danger');
      return;
    }

    const emailIngresado = this.usuario.trim().toLowerCase();
    const emailGuardado = usuarioGuardado.email.trim().toLowerCase();
    const passIngresado = this.password.trim();
    const passGuardado = usuarioGuardado.contrasena.trim();

    if (emailIngresado === emailGuardado && passIngresado === passGuardado) {
      this.perfilService.setNombre(usuarioGuardado.nombres);
      await this.storage.set('isLoggedIn', true);
      this.router.navigate(['/home']);
      this.presentToast('Login correcto, redirigiendo...', 'success');
    } else {
      this.presentToast('Correo o contraseña incorrectos', 'danger');
    }
  }

  togglePasswordVisibility() {
    this.mostrarContrasena = !this.mostrarContrasena;
  }

  async presentToast(msg: string, color: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      color,
      position: 'bottom'
    });
    await toast.present();
  }

  recuperarPassword() {
    this.router.navigate(['/forgot-password']);
  }

  animarLogin() {
    const anim = this.animationCtrl.create()
      .addElement(this.btnLogin.nativeElement)
      .duration(250)
      .iterations(1)
      .keyframes([
        { offset: 0, transform: 'scale(1)' },
        { offset: 0.5, transform: 'scale(1.05)' },
        { offset: 1, transform: 'scale(1)' }
      ]);

    anim.play().then(() => {
      this.login();
    });
  }
}
