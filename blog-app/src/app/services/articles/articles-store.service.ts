import { Injectable, signal } from '@angular/core';
import { Post } from '../../models/post.model';

@Injectable({
  providedIn: 'root',
})
export class ArticlesStoreService {
  private _articles = signal<Post[]>([]);
  private _totalCount = signal<number>(0);
  private _currentPage = signal<number>(1);

  public readonly articles = this._articles.asReadonly();
  public readonly totalCount = this._totalCount.asReadonly();
  public readonly currentPage = this._currentPage.asReadonly();

  public setArticles(posts: Post[]): void {
    this._articles.set(posts);
  }

  public setTotalCount(count: number): void {
    this._totalCount.set(count);
  }

  public setCurrentPage(page: number): void {
    this._currentPage.set(page);
  }
}
