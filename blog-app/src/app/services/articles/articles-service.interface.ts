import { Observable } from 'rxjs';
import { Post } from '../../models/post.model';

export interface ArticlesResponse {
  articles: Post[];
  totalCount: number;
}

export interface IArticlesService {
  getArticles(page: number, limit: number): Observable<ArticlesResponse>;
  getArticleById(id: number): Observable<Post | null>;
  addArticle(article: Omit<Post, 'id' | 'date'>): Observable<Post[]>;
  updateArticle(article: Post): Observable<Post[]>;
  deleteArticle(id: number): Observable<Post[]>;
}
