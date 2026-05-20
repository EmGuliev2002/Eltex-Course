import { Observable } from 'rxjs';
import { Category } from '../../models/category.model';

export interface ICategoriesService {
  getAll(): Observable<Category[]>;
  create(name: string): Observable<Category>;
}
