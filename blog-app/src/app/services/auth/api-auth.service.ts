import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of, switchMap } from 'rxjs';
import { IAuthService } from './auth-service.interface';
import { User } from '../../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable()
export class ApiAuthService implements IAuthService {
  private readonly tokenKey = 'access_token';
  private http = inject(HttpClient);

  private _currentUser = signal<User | null>(null);

  public currentUser = this._currentUser.asReadonly();
  public isLoggedIn = computed(() => this._currentUser() !== null);

  constructor() {
    this.loadMe();
  }

  public login(login: string, password: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/auth/login`, { login, password }).pipe(
      tap((res) => {
        if (res.access_token) {
          localStorage.setItem(this.tokenKey, res.access_token);
          this._currentUser.set(res.user);
        }
      }),
    );
  }

  public register(
    username: string,
    email: string,
    password: string,
    isAdmin?: boolean,
  ): Observable<any> {
    const payload: any = { username, email, password };
    if (isAdmin) {
      payload.isAdmin = true;
    }

    return this.http.post<any>(`${environment.apiUrl}/users/register`, payload).pipe(
      switchMap(() => this.login(username, password)),
    );
  }

  public logout(): Observable<void> {
    localStorage.removeItem(this.tokenKey);
    this._currentUser.set(null);

    return this.http
      .post<void>(`${environment.apiUrl}/auth/logout`, {})
      .pipe(catchError(() => of(void 0)));
  }

  public getAccessToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private loadMe(): void {
    const token = this.getAccessToken();
    if (!token) return;

    this.http
      .get<User>(`${environment.apiUrl}/auth/me`)
      .pipe(
        tap((user) => this._currentUser.set(user)),
        catchError(() => {
          this.logout().subscribe();
          return of(null);
        }),
      )
      .subscribe();
  }
}
