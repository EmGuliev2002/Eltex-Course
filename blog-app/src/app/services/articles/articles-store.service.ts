import { Injectable, signal, effect } from '@angular/core';
import { Post } from '../../models/post.model';
import { INITIAL_POSTS } from '../../data/initial-posts';

@Injectable({
  providedIn: 'root',
})
export class ArticlesStoreService {
  private readonly storageKey = 'ryan_gosling_blog';
  private readonly pageKey = 'blog_active_page';

  private _articles = signal<Post[]>(this.loadInitialArticles());
  private _currentPage = signal<number>(this.loadInitialPage());

  public readonly articles = this._articles.asReadonly();
  public readonly currentPage = this._currentPage.asReadonly();

  constructor() {
    effect(() => {
      localStorage.setItem(this.storageKey, JSON.stringify(this._articles()));
    });

    effect(() => {
      localStorage.setItem(this.pageKey, this._currentPage().toString());
    });
  }

  public saveArticles(posts: Post[]): void {
    this._articles.set(posts);
  }

  public saveActivePage(page: number): void {
    this._currentPage.set(page);
  }

  private loadInitialArticles(): Post[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : INITIAL_POSTS;
  }

  private loadInitialPage(): number {
    const page = localStorage.getItem(this.pageKey);
    return page ? Number(page) : 1;
  }
}
