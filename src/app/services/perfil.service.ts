import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PerfilService {
  private fotoPerfilSubject = new BehaviorSubject<string>('assets/perfil_foto.png');
  fotoPerfil$ = this.fotoPerfilSubject.asObservable();

  private nombreSubject = new BehaviorSubject<string>('Usuario');
  nombre$ = this.nombreSubject.asObservable();

  setFotoPerfil(url: string) {
    this.fotoPerfilSubject.next(url);
  }

  setNombre(nombre: string) {
    this.nombreSubject.next(nombre);
  }
}

