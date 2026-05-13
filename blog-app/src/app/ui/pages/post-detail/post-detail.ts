import { Component, inject, OnInit, DestroyRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

import { PostDetailService } from '../../../services/post-detail/post-detail.service';
import { PostDetailStoreService } from '../../../services/post-detail/post-detail-store.service';
import { AddCommentForm } from '../../components/add-comment-form/add-comment-form';

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
  providers: [PostDetailService, PostDetailStoreService],
  templateUrl: './post-detail.html',
  styleUrl: './post-detail.scss',
})
export class PostDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private postDetailService = inject(PostDetailService);
  private destroyRef = inject(DestroyRef);
  private titleService = inject(Title);
  private store = inject(PostDetailStoreService);

  protected post = this.store.post;
  protected comments = this.store.comments;
  protected readonly maxRating = [1, 2, 3, 4, 5];

  public ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.postDetailService
        .getPostWithComments(id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((res) => {
          if (res.post) {
            this.titleService.setTitle(`${res.post.title} - Райан Гослинг`);
          }
        });
    }
  }

  protected onCommentSubmit(data: { author: string; text: string }): void {
    const id = this.post()?.id;
    if (id) {
      this.postDetailService
        .addComment(id, data.author, data.text)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe();
    }
  }

  protected setPostRating(rating: number): void {
    const id = this.post()?.id;
    if (id) {
      this.postDetailService.updatePostRating(id, rating).subscribe();
    }
  }

  protected changeCommentRating(commentId: number, currentRating: number, delta: number): void {
    const postId = this.post()?.id;
    if (postId) {
      this.postDetailService
        .updateCommentRating(postId, commentId, currentRating + delta)
        .subscribe();
    }
  }
}
