import { Observable } from 'rxjs';
import { Signal } from '@angular/core';
import { User } from '../../models/user.model';

export interface IAuthService {
  currentUser: Signal<User | null>;
  isLoggedIn: Signal<boolean>;
  login(login: string, password: string): Observable<any>;
  register(username: string, email: string, password: string, isAdmin?: boolean): Observable<any>;
  logout(): Observable<void>;
  getAccessToken(): string | null;
}
