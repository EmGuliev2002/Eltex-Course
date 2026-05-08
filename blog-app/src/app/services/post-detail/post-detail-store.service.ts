import { Injectable, signal } from '@angular/core';
import { Post } from '../../models/post.model';
import { PostComment } from '../../models/comment.model';

@Injectable()
export class PostDetailStoreService {
  private _post = signal<Post | null>(null);
  private _comments = signal<PostComment[]>([]);

  public readonly post = this._post.asReadonly();
  public readonly comments = this._comments.asReadonly();

  public setPost(post: Post | null): void {
    this._post.set(post);
  }

  public setComments(comments: PostComment[]): void {
    this._comments.set(comments);
  }

  public updatePostRating(newRating: number): void {
    const current = this._post();
    if (current) {
      this._post.set({ ...current, rating: newRating });
    }
  }
}
