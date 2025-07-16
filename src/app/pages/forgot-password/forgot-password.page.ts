import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone:false,
})
export class ForgotPasswordPage {
  email: string = '';

  constructor(private router: Router) {}

  recuperar() {
    console.log('Simulando envío email de recuperación a', this.email);
    alert('Te hemos enviado un correo para recuperar tu contraseña');
    this.router.navigate(['/login']);
  }
}
