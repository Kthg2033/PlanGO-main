import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { filter } from 'rxjs/operators';

interface AppPage {
  title: string;
  url: string;
  icon: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  fotoPerfil: string = '';
  nombreUsuario: string = '';
  direccion: string = '';
  showMenu = true;

  appPages: AppPage[] = [
    { title: 'Inicio',  url: '/home',    icon: 'home' },
    { title: 'Agenda',  url: '/agenda',  icon: 'calendar' },
    { title: 'Tareas',  url: '/tareas',  icon: 'list' },
    { title: 'Hábitos', url: '/habitos', icon: 'checkmark-circle' },
    { title: 'Notas',   url: '/notas',   icon: 'document' },
    { title: 'Perfil',  url: '/perfil',  icon: 'person' },
  ];

  constructor(
    private router: Router,
    private storage: Storage
  ) {}

  async ngOnInit() {
    await this.storage.create();
    await this.cargarUsuario();
    await this.obtenerUbicacion();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(async (event: NavigationEnd) => {
        const url = event.urlAfterRedirects;
        this.showMenu = !url.includes('/login') && !url.includes('/register');
        await this.cargarUsuario();
      });

    // 👉 NUEVO: detecta cuando se pierde internet
    window.addEventListener('offline', () => {
      console.warn('Sin conexión, redirigiendo a /offline');
      this.router.navigate(['/offline']);
    });
  }

  async cargarUsuario() {
    const usuario = await this.storage.get('usuario');
    this.fotoPerfil = usuario?.foto || '';
    this.nombreUsuario = usuario?.nombres || 'Usuario';
  }

  async obtenerUbicacion() {
    try {
      this.direccion = ''; // 🔄 fuerza actualización inmediata del binding
      const { Geolocation } = await import('@capacitor/geolocation');
      const position = await Geolocation.getCurrentPosition();
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`);
      const data = await response.json();

      const suburb = data.address.suburb || '';
      const city = data.address.city || data.address.town || data.address.village || '';

      this.direccion = suburb
        ? `${suburb} - ${city}`
        : (city || 'Ubicación no disponible');

    } catch (err) {
      console.error('Error obteniendo ubicación', err);
      this.direccion = 'Ubicación no disponible';
    }
  }

  logout() {
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }
}
