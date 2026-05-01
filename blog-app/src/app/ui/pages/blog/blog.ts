import { Component, ElementRef, ViewChild, inject, OnInit } from '@angular/core';
import { Post } from '../../../models/post.model';
import { ArticleCard } from '../../components/article-card/article-card';
import { AddPostForm } from '../../components/add-post-form/add-post-form';
import { ARTICLES_SERVICE } from '../../../services/articles/articles-service.token';
import { ArticlesStoreService } from '../../../services/articles/articles-store.service';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [ArticleCard, AddPostForm],
  templateUrl: './blog.html',
  styleUrl: './blog.scss',
})
export class Blog implements OnInit {
  @ViewChild('statsDialog') private statsDialog!: ElementRef<HTMLDialogElement>;

  private articlesService = inject(ARTICLES_SERVICE);
  protected store = inject(ArticlesStoreService);

  protected isFormVisible = false;
  protected editingPost: Post | null = null;

  // Состояние страницы
  protected posts: Post[] = [];
  protected totalArticles = 0;
  protected readonly limit = 7;

  public ngOnInit(): void {
    this.loadArticles();
  }

  protected loadArticles(): void {
    const page = this.store.currentPage();
    this.articlesService.getArticles(page, this.limit).subscribe((res) => {
      this.posts = res.articles;
      this.totalArticles = res.totalCount;
    });
  }

  // Логика пагинации
  protected onShowMore(): void {
    const nextPage = this.store.currentPage() + 1;
    this.store.saveActivePage(nextPage);
    this.loadArticles();
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

  protected onAddPost(data: any): void {
    this.articlesService.addArticle(data).subscribe(() => {
      this.loadArticles();
      this.isFormVisible = false;
    });
  }

  protected onEditPost(post: Post): void {
    this.editingPost = post;
    this.isFormVisible = true;
    this.scrollToForm();
  }

  protected onUpdatePost(updatedPost: Post): void {
    this.articlesService.updateArticle(updatedPost).subscribe(() => {
      this.loadArticles();
      this.isFormVisible = false;
      this.editingPost = null;
    });
  }

  protected onDeletePost(id: number): void {
    this.articlesService.deleteArticle(id).subscribe(() => {
      this.loadArticles();
      if (this.editingPost?.id === id) {
        this.isFormVisible = false;
        this.editingPost = null;
      }
    });
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
