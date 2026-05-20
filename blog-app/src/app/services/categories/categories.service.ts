import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Category } from '../../models/category.model';
import { ICategoriesService } from './categories-service.interface';

@Injectable()
export class ApiCategoriesService implements ICategoriesService {
  private http = inject(HttpClient);

  public getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(`${environment.apiUrl}/categories`);
  }

  public create(name: string): Observable<Category> {
    return this.http.post<Category>(`${environment.apiUrl}/categories`, { name });
  }
}
