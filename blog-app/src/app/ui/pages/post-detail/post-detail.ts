import { Component, inject, OnInit, DestroyRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';

import { PostDetailService } from '../../../services/post-detail/post-detail.service';
import { PostDetailStoreService } from '../../../services/post-detail/post-detail-store.service';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
  ],
  providers: [PostDetailService, PostDetailStoreService],
  templateUrl: './post-detail.html',
  styleUrl: './post-detail.scss',
})
export class PostDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private postDetailService = inject(PostDetailService);
  private destroyRef = inject(DestroyRef);
  private fb = inject(FormBuilder);
  private titleService = inject(Title);

  protected store = inject(PostDetailStoreService);
  protected commentForm: FormGroup;
  protected readonly maxRating = [1, 2, 3, 4, 5];

  constructor() {
    this.commentForm = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2)]],
      text: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

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

  protected onSubmitComment(): void {
    if (this.commentForm.invalid) return;
    const id = this.store.post()?.id;
    if (id) {
      const { author, text } = this.commentForm.value;
      this.postDetailService
        .addComment(id, author, text)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.commentForm.reset());
    }
  }

  protected setPostRating(rating: number): void {
    const id = this.store.post()?.id;
    if (id) {
      this.postDetailService.updatePostRating(id, rating).subscribe();
    }
  }

  protected changeCommentRating(commentId: number, currentRating: number, delta: number): void {
    const postId = this.store.post()?.id;
    if (postId) {
      this.postDetailService
        .updateCommentRating(postId, commentId, currentRating + delta)
        .subscribe();
    }
  }
}
