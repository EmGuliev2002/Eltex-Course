import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Post } from '../../models/post.model';
import { IArticlesService, ArticlesResponse } from './articles-service.interface';
import { ArticlesStoreService } from './articles-store.service';

export interface BackendArticle {
  id: string;
  title: string;
  content: string;
  imgSrc: string | null;
  categoryId: string | null;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface BackendArticlesResponse {
  items: BackendArticle[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateArticleData {
  title: string;
  text: string;
  categoryId?: string;
  imageFile?: File | null;
  img?: string;
}

@Injectable()
export class ApiArticlesService implements IArticlesService {
  private readonly pageKey = 'blog_active_page';

  private http = inject(HttpClient);
  private store = inject(ArticlesStoreService);

  constructor() {
    this.initStore();
  }

  public getArticles(page: number, limit: number): Observable<ArticlesResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('cumulative', 'true');

    return this.http
      .get<BackendArticlesResponse>(`${environment.apiUrl}/articles`, { params })
      .pipe(
        map((res: BackendArticlesResponse) => ({
          articles: res.items.map((item: BackendArticle) => this.mapPost(item)),
          totalCount: res.total,
        })),
        tap((res: ArticlesResponse) => this.updateStore(res, page)),
      );
  }

  public getArticleById(id: number | string): Observable<Post | null> {
    return this.http
      .get<BackendArticle>(`${environment.apiUrl}/articles/${id}`)
      .pipe(map((item: BackendArticle) => this.mapPost(item)));
  }

  public addArticle(data: CreateArticleData): Observable<Post[]> {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('content', data.text);

    if (data.categoryId) {
      formData.append('categoryId', data.categoryId);
    }

    if (data.imageFile) {
      formData.append('image', data.imageFile);
    } else if (data.img) {
      formData.append('imgSrc', data.img);
    }

    return this.http.post<BackendArticle>(`${environment.apiUrl}/articles`, formData).pipe(
      tap(() => this.refresh()),
      map(() => []),
    );
  }

  public updateArticle(updatedPost: Post): Observable<Post[]> {
    return this.http
      .patch<BackendArticle>(`${environment.apiUrl}/articles/${updatedPost.id}`, {
        title: updatedPost.title,
        content: updatedPost.text,
        categoryId: updatedPost.categoryId,
      })
      .pipe(
        tap(() => this.refresh()),
        map(() => []),
      );
  }

  public deleteArticle(id: number | string): Observable<Post[]> {
    return this.http.delete<void>(`${environment.apiUrl}/articles/${id}`).pipe(
      tap(() => this.refresh()),
      map(() => []),
    );
  }

  private mapPost(item: BackendArticle): Post {
    return {
      id: item.id,
      title: item.title,
      text: item.content,
      date: new Date(item.createdAt).toLocaleDateString('ru-RU'),
      img: item.imgSrc ? item.imgSrc : 'rickroll.jpg',
      rating: item.rating,
      categoryId: item.categoryId || undefined,
    };
  }

  private updateStore(res: ArticlesResponse, page: number): void {
    this.store.setArticles(res.articles);
    this.store.setTotalCount(res.totalCount);
    this.store.setCurrentPage(page);
    localStorage.setItem(this.pageKey, page.toString());
  }

  private refresh(): void {
    this.getArticles(this.store.currentPage(), 7).subscribe();
  }

  private initStore(): void {
    const savedPage = localStorage.getItem(this.pageKey);
    const page = savedPage ? Number(savedPage) : 1;
    this.getArticles(page, 7).subscribe();
  }
}
