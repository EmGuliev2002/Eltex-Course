import { Observable } from 'rxjs';
import { Post } from '../../models/post.model';

export interface ArticlesResponse {
  articles: Post[];
  totalCount: number;
}

export interface IArticlesService {
  /**
   * Получить список статей с учетом пагинации
   * @param page номер страницы
   * @param limit количество статей на страницу
   */
  getArticles(page: number, limit: number): Observable<ArticlesResponse>;
  addArticle(article: Omit<Post, 'id' | 'date'>): Observable<Post[]>;
  updateArticle(article: Post): Observable<Post[]>;
  deleteArticle(id: number): Observable<Post[]>;
}
