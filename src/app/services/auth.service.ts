import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly USER_KEY = 'user';

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.USER_KEY);
  }

  login(username: string): void {
    localStorage.setItem(this.USER_KEY, username);
  }

  logout(): void {
    localStorage.removeItem(this.USER_KEY);
  }

  getUsername(): string | null {
    return localStorage.getItem(this.USER_KEY);
  }
}
