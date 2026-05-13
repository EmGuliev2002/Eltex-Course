import { Injectable, inject } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { Post } from '../../models/post.model';
import { IArticlesService } from './articles-service.interface';
import { ArticlesResponse } from './types/articles-response';
import { ArticlesStoreService } from './articles-store.service';
import { INITIAL_POSTS } from '../../data/initial-posts';

@Injectable({
  providedIn: 'root',
})
export class ArticlesService implements IArticlesService {
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

    return of(response).pipe(
      tap((res) => {
        this.store.setArticles(res.articles);
        this.store.setTotalCount(res.totalCount);
        this.store.setCurrentPage(page);
        localStorage.setItem(this.pageKey, page.toString());
      }),
    );
  }

  public getArticleById(id: number): Observable<Post | null> {
    const allArticles = this.getFromStorage();
    const article = allArticles.find((p) => p.id === id) || null;
    return of(article);
  }

  public addArticle(data: Omit<Post, 'id' | 'date'>): Observable<Post[]> {
    const allArticles = this.getFromStorage();
    const newPost: Post = {
      ...data,
      id: Date.now(),
      date: new Date().toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      img: data.img || 'rickroll.jpg',
      rating: 0,
    };

    const updated = [newPost, ...allArticles];
    this.saveToStorage(updated);

    return of(updated).pipe(tap(() => this.getArticles(this.store.currentPage(), 7).subscribe()));
  }

  public updateArticle(updatedPost: Post): Observable<Post[]> {
    const allArticles = this.getFromStorage();
    const updated = allArticles.map((p) => (p.id === updatedPost.id ? updatedPost : p));

    this.saveToStorage(updated);
    return of(updated).pipe(tap(() => this.getArticles(this.store.currentPage(), 7).subscribe()));
  }

  public deleteArticle(id: number): Observable<Post[]> {
    const allArticles = this.getFromStorage();
    const updated = allArticles.filter((p) => p.id !== id);

    this.saveToStorage(updated);
    return of(updated).pipe(tap(() => this.getArticles(this.store.currentPage(), 7).subscribe()));
  }

  private getFromStorage(): Post[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : INITIAL_POSTS;
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
