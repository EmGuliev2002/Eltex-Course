import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Post } from '../../models/post.model';
import { IArticlesService, ArticlesResponse } from './articles-service.interface';
import { ArticlesStoreService } from './articles-store.service';

@Injectable({
  providedIn: 'root',
})
export class ArticlesService implements IArticlesService {
  private store = inject(ArticlesStoreService);

  public getArticles(page: number, limit: number): Observable<ArticlesResponse> {
    const allArticles = this.store.articles();
    const startIndex = 0;
    const endIndex = page * limit;
    const paginatedArticles = allArticles.slice(startIndex, endIndex);

    return of({
      articles: paginatedArticles,
      totalCount: allArticles.length,
    });
  }

  public addArticle(data: Omit<Post, 'id' | 'date'>): Observable<Post[]> {
    const newPost: Post = {
      ...data,
      id: Date.now(),
      date: new Date().toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      img: data.img || 'rickroll.jpg',
    };

    const updatedArticles = [newPost, ...this.store.articles()];
    this.store.saveArticles(updatedArticles);

    return of(updatedArticles);
  }

  public updateArticle(updatedPost: Post): Observable<Post[]> {
    const updatedArticles = this.store
      .articles()
      .map((p) => (p.id === updatedPost.id ? updatedPost : p));

    this.store.saveArticles(updatedArticles);
    return of(updatedArticles);
  }

  public deleteArticle(id: number): Observable<Post[]> {
    const updatedArticles = this.store.articles().filter((p) => p.id !== id);

    this.store.saveArticles(updatedArticles);
    return of(updatedArticles);
  }
}
