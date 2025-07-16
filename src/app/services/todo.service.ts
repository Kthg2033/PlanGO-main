import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SQLiteService } from './sqlite.service';
import { Todo } from '../models/todo.model';
import { catchError, of, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TodoService {

  constructor(
    private http: HttpClient,
    private sqlite: SQLiteService
  ) {}

  cargarTareasDesdeApi() {
    return this.http.get<Todo[]>('https://jsonplaceholder.typicode.com/todos?_limit=5').pipe(
      tap(async todos => {
        console.log('✅ API OK, guardando en SQLite');
        await this.sqlite.saveTodos(todos);
      }),
      catchError(async err => {
        console.error('⚠️ Error al cargar API, usando SQLite:', err);
        const storedTodos = await this.sqlite.getTodos();
        return of(storedTodos);
      })
    );
  }
}
