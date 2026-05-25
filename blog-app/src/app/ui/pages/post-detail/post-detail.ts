import { Component, inject, OnInit, OnDestroy, DestroyRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

import { PostDetailService } from '../../../services/post-detail/post-detail.service';
import { ApiPostDetailService } from '../../../services/post-detail/api-post-detail.service';
import { LocalStoragePostDetailService } from '../../../services/post-detail/local-storage-post-detail.service';
import { PostDetailStoreService } from '../../../services/post-detail/post-detail-store.service';
import { AddCommentForm } from '../../components/add-comment-form/add-comment-form';
import { WebsocketService } from '../../../services/websocket/websocket.service';
import { environment } from '../../../../environments/environment';
import { PostComment } from '../../../models/comment.model';
import { AUTH_SERVICE } from '../../../services/auth/auth-service.token';
import {
  WebSocketEventData,
  CommentCreatedPayload,
  CommentRatingChangedPayload,
  ArticleRatingChangedPayload,
} from '../../../services/websocket/websocket.types';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    AddCommentForm,
  ],
  providers: [
    {
      provide: PostDetailService,
      useClass: environment.useLocalStorage ? LocalStoragePostDetailService : ApiPostDetailService,
    },
    PostDetailStoreService,
  ],
  templateUrl: './post-detail.html',
  styleUrl: './post-detail.scss',
})
export class PostDetail implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private postDetailService = inject(PostDetailService);
  private websocketService = inject(WebsocketService);
  private destroyRef = inject(DestroyRef);
  private titleService = inject(Title);
  private store = inject(PostDetailStoreService);
  private authService = inject(AUTH_SERVICE);

  protected post = this.store.post;
  protected comments = this.store.comments;
  protected readonly maxRating = [1, 2, 3, 4, 5];

  protected currentUser = this.authService.currentUser;
  protected isLoggedIn = this.authService.isLoggedIn;

  private articleId: string | null = null;

  public ngOnInit(): void {
    this.articleId = this.route.snapshot.paramMap.get('id');

    if (this.articleId) {
      this.postDetailService
        .getPostWithComments(this.articleId)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((res) => {
          if (res.post) {
            this.titleService.setTitle(`${res.post.title} - Райан Гослинг`);
          }
        });

      this.websocketService.subscribeToArticle(this.articleId);

      this.websocketService.events$
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(({ eventName, data }) => {
          this.handleWebSocketEvent(eventName, data);
        });
    }
  }

  public ngOnDestroy(): void {
    if (this.articleId) {
      this.websocketService.unsubscribeFromArticle(this.articleId);
    }
  }

  private handleWebSocketEvent(
    eventName: 'comment-created' | 'comment-rating-changed' | 'article-rating-changed',
    data: WebSocketEventData,
  ): void {
    if (!data || !data.payload) return;
    const payload = data.payload;

    switch (eventName) {
      case 'comment-created': {
        const p = payload as CommentCreatedPayload;
        if (p.articleId !== this.articleId) return;

        const currentComments = this.store.comments();
        if (!currentComments.some((c) => c.id.toString() === p.commentId.toString())) {
          const newComment: PostComment = {
            id: p.commentId,
            author: p.username,
            text: p.content,
            date: new Date(p.createdAt).toLocaleDateString('ru-RU'),
            rating: 0,
          };
          this.store.setComments([newComment, ...currentComments]);
        }
        break;
      }

      case 'comment-rating-changed': {
        const p = payload as CommentRatingChangedPayload;
        if (p.articleId !== this.articleId) return;

        const currentComments = this.store.comments();
        const updated = currentComments.map((c) =>
          c.id.toString() === p.commentId.toString() ? { ...c, rating: p.rating } : c,
        );
        this.store.setComments(updated);
        break;
      }

      case 'article-rating-changed': {
        const p = payload as ArticleRatingChangedPayload;
        if (p.articleId !== this.articleId) return;

        this.store.updatePostRating(p.rating);
        break;
      }
    }
  }

  protected onCommentSubmit(data: { author: string; text: string }): void {
    if (this.articleId) {
      this.postDetailService
        .addComment(this.articleId, data.author, data.text)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe();
    }
  }

  protected setPostRating(rating: number): void {
    if (this.articleId) {
      this.postDetailService.updatePostRating(this.articleId, rating).subscribe();
    }
  }

  protected changeCommentRating(
    commentId: number | string,
    currentRating: number,
    delta: number,
  ): void {
    if (this.articleId) {
      this.postDetailService
        .updateCommentRating(this.articleId, commentId, currentRating + delta)
        .subscribe();
    }
  }
}
