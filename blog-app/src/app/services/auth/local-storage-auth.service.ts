import { Injectable, signal, computed } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { IAuthService } from './auth-service.interface';
import { User } from '../../models/user.model';

@Injectable()
export class LocalStorageAuthService implements IAuthService {
  private readonly tokenKey = 'mock_access_token';
  private readonly userKey = 'mock_current_user';
  private readonly usersListKey = 'mock_registered_users';

  private _currentUser = signal<User | null>(null);

  public currentUser = this._currentUser.asReadonly();
  public isLoggedIn = computed(() => this._currentUser() !== null);

  constructor() {
    this.loadUserFromStorage();
  }

  public login(login: string, password: string): Observable<any> {
    const users = this.getRegisteredUsers();
    const user = users.find((u) => u.username === login || u.email === login);

    if (!user) {
      return throwError(() => new Error('Неверный логин или пароль (Mock)'));
    }

    this.saveSession(user, 'mock-jwt-token-12345');
    return of({ message: 'Успешный вход (Mock)', user });
  }

  public register(
    username: string,
    email: string,
    password: string,
    isAdmin?: boolean,
  ): Observable<any> {
    const users = this.getRegisteredUsers();
    if (users.some((u) => u.username === username || u.email === email)) {
      return throwError(
        () => new Error('Пользователь с таким именем или email уже существует (Mock)'),
      );
    }

    const newUser: User = {
      id: `mock-uuid-${Date.now()}`,
      username,
      email,
      role: isAdmin ? 'admin' : 'user',
    };

    users.push(newUser);
    localStorage.setItem(this.usersListKey, JSON.stringify(users));
    this.saveSession(newUser, 'mock-jwt-token-12345');

    return of({ message: 'Пользователь успешно зарегистрирован (Mock)', user: newUser });
  }

  public logout(): Observable<void> {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this._currentUser.set(null);
    return of(void 0);
  }

  public getAccessToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private getRegisteredUsers(): User[] {
    const data = localStorage.getItem(this.usersListKey);
    if (data) {
      return JSON.parse(data);
    }
    const defaultUsers: User[] = [
      { id: 'mock-admin-id', username: 'admin', email: 'admin@gosling.com', role: 'admin' },
      { id: 'mock-user-id', username: 'user', email: 'user@gosling.com', role: 'user' },
    ];
    localStorage.setItem(this.usersListKey, JSON.stringify(defaultUsers));
    return defaultUsers;
  }

  private saveSession(user: User, token: string): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
    localStorage.setItem(this.tokenKey, token);
    this._currentUser.set(user);
  }

  private loadUserFromStorage(): void {
    const userStr = localStorage.getItem(this.userKey);
    if (userStr) {
      try {
        this._currentUser.set(JSON.parse(userStr));
      } catch {
        this.logout();
      }
    }
  }
}
