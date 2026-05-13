import { Component, inject, computed, OnInit, DestroyRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ArticlesStoreService } from '../../../../services/articles/articles-store.service';
import { ARTICLES_SERVICE } from '../../../../services/articles/articles-service.token';
import { ArticleCard } from '../../article-card/article-card';

@Component({
  selector: 'app-latest-articles',
  standalone: true,
  imports: [ArticleCard, RouterLink],
  templateUrl: './latest-articles.html',
  styleUrl: './latest-articles.scss',
})
export class LatestArticles implements OnInit {
  private readonly store = inject(ArticlesStoreService);
  private readonly articlesService = inject(ARTICLES_SERVICE);
  private readonly destroyRef = inject(DestroyRef);

  protected latestArticles = computed(() => this.store.articles().slice(0, 2));

  public ngOnInit(): void {
    this.articlesService
      .getArticles(this.store.currentPage(), 7)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
