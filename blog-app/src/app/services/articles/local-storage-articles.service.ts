import { Injectable, inject } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { Post } from '../../models/post.model';
import { IArticlesService, ArticlesResponse } from './articles-service.interface';
import { ArticlesStoreService } from './articles-store.service';
import { INITIAL_POSTS } from '../../data/initial-posts';

@Injectable()
export class LocalStorageArticlesService implements IArticlesService {
  private readonly storageKey = 'ryan_gosling_blog';
  private readonly pageKey = 'blog_active_page';
  private store = inject(ArticlesStoreService);

  constructor() {
    this.initStore();
  }

  public getArticles(page: number, limit: number): Observable<ArticlesResponse> {
    const allArticles = this.getFromStorage();
    const endIndex = page * limit;
    const paginatedArticles = allArticles.slice(0, endIndex);

    const response: ArticlesResponse = {
      articles: paginatedArticles,
      totalCount: allArticles.length,
    };
    return of(response).pipe(tap((res) => this.updateStore(res, page)));
  }

  public getArticleById(id: number | string): Observable<Post | null> {
    const allArticles = this.getFromStorage();
    const article = allArticles.find((p) => p.id.toString() === id.toString()) || null;
    return of(article);
  }

  public addArticle(data: any): Observable<Post[]> {
    const allArticles = this.getFromStorage();
    const newPost: Post = {
      ...data,
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('ru-RU'),
      img: data.img || 'rickroll.jpg',
      rating: 0,
    };

    const updated = [newPost, ...allArticles];
    this.saveToStorage(updated);
    return of(updated).pipe(tap(() => this.refresh()));
  }

  public updateArticle(updatedPost: Post): Observable<Post[]> {
    const allArticles = this.getFromStorage();
    const updated = allArticles.map((p) => (p.id === updatedPost.id ? updatedPost : p));
    this.saveToStorage(updated);
    return of(updated).pipe(tap(() => this.refresh()));
  }

  public deleteArticle(id: number | string): Observable<Post[]> {
    const allArticles = this.getFromStorage();
    const updated = allArticles.filter((p) => p.id.toString() !== id.toString());
    this.saveToStorage(updated);
    return of(updated).pipe(tap(() => this.refresh()));
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

  private getFromStorage(): Post[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : INITIAL_POSTS.map((p) => ({ ...p, id: p.id.toString() }));
  }

  private saveToStorage(posts: Post[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(posts));
  }

  private initStore(): void {
    const savedPage = localStorage.getItem(this.pageKey);
    const page = savedPage ? Number(savedPage) : 1;
    this.getArticles(page, 7).subscribe();
  }
}
