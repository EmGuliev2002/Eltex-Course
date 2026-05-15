import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Post } from '../../models/post.model';
import { IArticlesService, ArticlesResponse } from './articles-service.interface';
import { ArticlesStoreService } from './articles-store.service';

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

    return this.http.get<any>(`${environment.apiUrl}/articles`, { params }).pipe(
      map((res) => ({
        articles: res.items.map((item: any) => this.mapPost(item)),
        totalCount: res.total,
      })),
      tap((res) => this.updateStore(res, page)),
    );
  }

  public getArticleById(id: number | string): Observable<Post | null> {
    return this.http
      .get<any>(`${environment.apiUrl}/articles/${id}`)
      .pipe(map((item) => this.mapPost(item)));
  }

  public addArticle(data: any): Observable<Post[]> {
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

    return this.http.post<any>(`${environment.apiUrl}/articles`, formData).pipe(
      tap(() => this.refresh()),
      map(() => []),
    );
  }

  public updateArticle(updatedPost: Post): Observable<Post[]> {
    return this.http
      .patch(`${environment.apiUrl}/articles/${updatedPost.id}`, {
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
    return this.http.delete(`${environment.apiUrl}/articles/${id}`).pipe(
      tap(() => this.refresh()),
      map(() => []),
    );
  }

  private mapPost(item: any): Post {
    return {
      id: item.id,
      title: item.title,
      text: item.content,
      date: new Date(item.createdAt).toLocaleDateString('ru-RU'),
      img: item.imgSrc ? item.imgSrc : 'rickroll.jpg',
      rating: item.rating,
      categoryId: item.categoryId,
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
