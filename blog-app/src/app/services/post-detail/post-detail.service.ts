import { Injectable, inject } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { PostComment } from '../../models/comment.model';
import { PostDetailStoreService } from './post-detail-store.service';
import { ArticlesStoreService } from '../articles/articles-store.service';
import { Post } from '../../models/post.model';
import { INITIAL_POSTS } from '../../data/initial-posts';

@Injectable()
export class PostDetailService {
  private readonly commentsPrefix = 'comments_post_';
  private readonly storageKey = 'ryan_gosling_blog';

  private store = inject(PostDetailStoreService);
  private globalArticlesStore = inject(ArticlesStoreService);

  /* Получает пост по ID и его комментарии */
  public getPostWithComments(
    id: number,
  ): Observable<{ post: Post | null; comments: PostComment[] }> {
    let allArticles = this.globalArticlesStore.articles();
    if (allArticles.length === 0) {
      const data = localStorage.getItem(this.storageKey);
      allArticles = data ? JSON.parse(data) : INITIAL_POSTS;
    }

    const post = allArticles.find((p) => p.id === id) || null;
    const comments = this.getCommentsFromLS(id);

    return of({ post, comments }).pipe(
      tap((res) => {
        this.store.setPost(res.post);
        this.store.setComments(res.comments);
      }),
    );
  }

  /* Добавление нового комментария */
  public addComment(postId: number, author: string, text: string): Observable<PostComment[]> {
    const comments = this.getCommentsFromLS(postId);
    const newComment: PostComment = {
      id: Date.now(),
      author: author || 'Анонимный режиссер',
      text,
      date: new Date().toLocaleDateString('ru-RU'),
      rating: 0,
    };

    const updated = [...comments, newComment];
    this.saveCommentsToLS(postId, updated);

    return of(updated).pipe(tap((res) => this.store.setComments(res)));
  }

  /* Изменение рейтинга комментария */
  public updateCommentRating(
    postId: number,
    commentId: number,
    newRating: number,
  ): Observable<PostComment[]> {
    const comments = this.getCommentsFromLS(postId);
    const updated = comments.map((c) => (c.id === commentId ? { ...c, rating: newRating } : c));

    this.saveCommentsToLS(postId, updated);
    return of(updated).pipe(tap((res) => this.store.setComments(res)));
  }

  /* Изменение рейтинга статьи */
  public updatePostRating(postId: number, newRating: number): Observable<void> {
    const data = localStorage.getItem(this.storageKey);
    if (data) {
      const posts = JSON.parse(data);
      const updatedPosts = posts.map((p: Post) =>
        p.id === postId ? { ...p, rating: newRating } : p,
      );
      localStorage.setItem(this.storageKey, JSON.stringify(updatedPosts));
    }
    this.store.updatePostRating(newRating);
    return of(void 0);
  }

  private getCommentsFromLS(postId: number): PostComment[] {
    const data = localStorage.getItem(`${this.commentsPrefix}${postId}`);
    return data ? JSON.parse(data) : [];
  }

  private saveCommentsToLS(postId: number, comments: PostComment[]): void {
    localStorage.setItem(`${this.commentsPrefix}${postId}`, JSON.stringify(comments));
  }
}
