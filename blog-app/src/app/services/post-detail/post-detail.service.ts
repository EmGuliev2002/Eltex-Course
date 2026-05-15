import { Injectable, inject } from '@angular/core';
import { Observable, of, tap, map } from 'rxjs';
import { PostComment } from '../../models/comment.model';
import { PostDetailStoreService } from './post-detail-store.service';
import { ARTICLES_SERVICE } from '../articles/articles-service.token';
import { Post } from '../../models/post.model';

@Injectable()
export class PostDetailService {
  private readonly commentsPrefix = 'comments_post_';
  private readonly storageKey = 'ryan_gosling_blog';

  private store = inject(PostDetailStoreService);
  private articlesService = inject(ARTICLES_SERVICE);

  public getPostWithComments(
    id: string,
  ): Observable<{ post: Post | null; comments: PostComment[] }> {
    return this.articlesService.getArticleById(id).pipe(
      map((post) => {
        const comments = this.getCommentsFromLS(id);
        return { post, comments };
      }),
      tap((res) => {
        this.store.setPost(res.post);
        this.store.setComments(res.comments);
      }),
    );
  }

  public addComment(postId: string, author: string, text: string): Observable<PostComment[]> {
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

  public updateCommentRating(
    postId: string,
    commentId: number,
    newRating: number,
  ): Observable<PostComment[]> {
    const comments = this.getCommentsFromLS(postId);
    const updated = comments.map((c) => (c.id === commentId ? { ...c, rating: newRating } : c));

    this.saveCommentsToLS(postId, updated);
    return of(updated).pipe(tap((res) => this.store.setComments(res)));
  }

  public updatePostRating(postId: string, newRating: number): Observable<void> {
    const data = localStorage.getItem(this.storageKey);
    if (data) {
      const posts = JSON.parse(data);
      const updatedPosts = posts.map((p: Post) =>
        p.id.toString() === postId.toString() ? { ...p, rating: newRating } : p,
      );
      localStorage.setItem(this.storageKey, JSON.stringify(updatedPosts));
    }
    this.store.updatePostRating(newRating);
    return of(void 0);
  }

  private getCommentsFromLS(postId: string): PostComment[] {
    const data = localStorage.getItem(`${this.commentsPrefix}${postId}`);
    return data ? JSON.parse(data) : [];
  }

  private saveCommentsToLS(postId: string, comments: PostComment[]): void {
    localStorage.setItem(`${this.commentsPrefix}${postId}`, JSON.stringify(comments));
  }
}
