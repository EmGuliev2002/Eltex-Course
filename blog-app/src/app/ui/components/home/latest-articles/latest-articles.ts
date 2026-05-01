import { Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ArticlesStoreService } from '../../../../services/articles/articles-store.service';
import { ArticleCard } from '../../article-card/article-card';

@Component({
  selector: 'app-latest-articles',
  standalone: true,
  imports: [ArticleCard, RouterLink],
  templateUrl: './latest-articles.html',
  styleUrl: './latest-articles.scss',
})
export class LatestArticles {
  private store = inject(ArticlesStoreService);
  protected latestArticles = computed(() => this.store.articles().slice(0, 2));
}
