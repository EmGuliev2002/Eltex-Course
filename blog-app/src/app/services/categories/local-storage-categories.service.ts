import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Category } from '../../models/category.model';
import { ICategoriesService } from './categories-service.interface';

@Injectable()
export class LocalStorageCategoriesService implements ICategoriesService {
  private mockCategories: Category[] = [
    { id: 'cat-1', name: 'Драма' },
    { id: 'cat-2', name: 'Боевик' },
    { id: 'cat-3', name: 'Комедия' },
    { id: 'cat-4', name: 'Триллер' },
    { id: 'cat-5', name: 'Фантастика' },
  ];

  public getAll(): Observable<Category[]> {
    return of(this.mockCategories);
  }

  public create(name: string): Observable<Category> {
    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      name: name,
    };
    this.mockCategories.push(newCategory);
    return of(newCategory);
  }
}
