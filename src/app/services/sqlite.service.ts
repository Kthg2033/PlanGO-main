import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Todo } from '../models/todo.model';

@Injectable({ providedIn: 'root' })
export class SQLiteService {
  private sqlite = new SQLiteConnection(CapacitorSQLite);
  private db!: SQLiteDBConnection;

  private async open() {
    if (!this.db) {
      this.db = await this.sqlite.createConnection('todosDB', false, 'no-encryption', 1, false);
      await this.db.open();
      await this.db.execute(`
        CREATE TABLE IF NOT EXISTS todos (
          id INTEGER PRIMARY KEY,
          userId INTEGER,
          title TEXT,
          completed INTEGER
        )
      `);
    }
  }

  async saveTodos(todos: Todo[]) {
    await this.open();
    await this.db.execute('DELETE FROM todos');
    for (const t of todos) {
      await this.db.run(
        'INSERT INTO todos (id, userId, title, completed) VALUES (?, ?, ?, ?)',
        [t.id, t.userId, t.title, t.completed ? 1 : 0]
      );
    }
  }

  async getTodos(): Promise<Todo[]> {
    await this.open();
    const res = await this.db.query('SELECT * FROM todos');
    return (res.values ?? []) as Todo[];
  }
}
