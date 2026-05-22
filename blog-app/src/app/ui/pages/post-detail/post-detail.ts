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

  protected post = this.store.post;
  protected comments = this.store.comments;
  protected readonly maxRating = [1, 2, 3, 4, 5];

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

  private handleWebSocketEvent(eventName: string, data: any): void {
    if (!data || !data.payload) return;
    const payload = data.payload;

    switch (eventName) {
      case 'comment-created': {
        const currentComments = this.store.comments();
        if (!currentComments.some((c) => c.id.toString() === payload.commentId.toString())) {
          const newComment: PostComment = {
            id: payload.commentId,
            author: payload.username,
            text: payload.content,
            date: new Date(payload.createdAt).toLocaleDateString('ru-RU'),
            rating: 0,
          };
          this.store.setComments([newComment, ...currentComments]);
        }
        break;
      }

      case 'comment-rating-changed': {
        const currentComments = this.store.comments();
        const updated = currentComments.map((c) =>
          c.id.toString() === payload.commentId.toString() ? { ...c, rating: payload.rating } : c,
        );
        this.store.setComments(updated);
        break;
      }

      case 'article-rating-changed': {
        this.store.updatePostRating(payload.rating);
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
