import { Component, ElementRef, ViewChild, inject, OnInit, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Post } from '../../../models/post.model';
import { ArticleCard } from '../../components/article-card/article-card';
import { AddPostForm } from '../../components/add-post-form/add-post-form';
import { ARTICLES_SERVICE } from '../../../services/articles/articles-service.token';
import { ArticlesStoreService } from '../../../services/articles/articles-store.service';
import { HasRoleDirective } from '../../../directives/has-role.directive';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, ArticleCard, AddPostForm, MatIconModule, MatButtonModule, HasRoleDirective,],
  templateUrl: './blog.html',
  styleUrl: './blog.scss',
})
export class Blog implements OnInit {
  @ViewChild('statsDialog') private statsDialog!: ElementRef<HTMLDialogElement>;

  private articlesService = inject(ARTICLES_SERVICE);
  private destroyRef = inject(DestroyRef);
  private titleService = inject(Title);
  private store = inject(ArticlesStoreService);

  protected isFormVisible = false;
  protected editingPost: Post | null = null;

  protected posts = this.store.articles;
  protected totalCount = this.store.totalCount;
  protected readonly limit = 7;

  public ngOnInit(): void {
    this.titleService.setTitle('Фильмография - Райан Гослинг');
    this.loadArticles();
  }

  protected loadArticles(): void {
    this.articlesService
      .getArticles(this.store.currentPage(), this.limit)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  protected onShowMore(): void {
    const nextPage = this.store.currentPage() + 1;
    this.articlesService
      .getArticles(nextPage, this.limit)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  protected onAddPost(data: any): void {
    this.articlesService
      .addArticle(data)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.isFormVisible = false;
      });
  }

  protected onEditPost(post: Post): void {
    this.editingPost = post;
    this.isFormVisible = true;
    this.scrollToForm();
  }

  protected onUpdatePost(updatedPost: Post): void {
    this.articlesService
      .updateArticle(updatedPost)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.isFormVisible = false;
        this.editingPost = null;
      });
  }

  protected onDeletePost(id: string | number): void {
    this.articlesService
      .deleteArticle(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (this.editingPost?.id.toString() === id.toString()) {
          this.onCancelForm();
        }
      });
  }

  protected toggleForm(): void {
    if (this.isFormVisible && this.editingPost) {
      this.editingPost = null;
    } else {
      this.isFormVisible = !this.isFormVisible;
      this.editingPost = null;
    }
    if (this.isFormVisible) {
      this.scrollToForm();
    }
  }

  protected toggleStats(): void {
    const dialog = this.statsDialog.nativeElement;
    dialog.open ? dialog.close() : dialog.showModal();
  }

  protected onCancelForm(): void {
    this.isFormVisible = false;
    this.editingPost = null;
  }

  private scrollToForm(): void {
    setTimeout(() => {
      document
        .getElementById('formSection')
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  }
}
