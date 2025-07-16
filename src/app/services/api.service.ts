import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Tarea } from '../models/tarea.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private tareasUrl = 'https://64b67812df0839c97e1622ea.mockapi.io/api/v1/tareas';

  constructor(private http: HttpClient) {}

  getTareas(): Observable<Tarea[]> {
    return this.http.get<Tarea[]>(this.tareasUrl);
  }

  getTarea(id: number): Observable<Tarea> {
    return this.http.get<Tarea>(`${this.tareasUrl}/${id}`);
  }

  crearTarea(tarea: Omit<Tarea, 'id'>): Observable<Tarea> {
    // NO mandamos el id porque lo crea el backend
    return this.http.post<Tarea>(this.tareasUrl, tarea);
  }

  actualizarTarea(id: number, tarea: Tarea): Observable<Tarea> {
    return this.http.put<Tarea>(`${this.tareasUrl}/${id}`, tarea);
  }

  eliminarTarea(id: number): Observable<void> {
    return this.http.delete<void>(`${this.tareasUrl}/${id}`);
  }
}
