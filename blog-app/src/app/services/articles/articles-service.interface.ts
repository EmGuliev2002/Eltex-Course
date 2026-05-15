import { Observable } from 'rxjs';
import { Post } from '../../models/post.model';

export interface ArticlesResponse {
  articles: Post[];
  totalCount: number;
}

export interface IArticlesService {
  getArticles(page: number, limit: number): Observable<ArticlesResponse>;
  getArticleById(id: string | number): Observable<Post | null>;
  addArticle(article: any): Observable<Post[]>;
  updateArticle(article: Post): Observable<Post[]>;
  deleteArticle(id: string | number): Observable<Post[]>;
}
