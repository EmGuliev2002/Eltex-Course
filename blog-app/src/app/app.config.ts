import { ApplicationConfig, provideBrowserGlobalErrorListeners, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { ARTICLES_SERVICE } from './services/articles/articles-service.token';
import { ApiArticlesService } from './services/articles/api-articles.service';
import { LocalStorageArticlesService } from './services/articles/local-storage-articles.service';
import { CATEGORIES_SERVICE } from './services/categories/categories-service.token';
import { ApiCategoriesService } from './services/categories/categories.service';
import { LocalStorageCategoriesService } from './services/categories/local-storage-categories.service';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    {
      provide: ARTICLES_SERVICE,
      useClass: environment.useLocalStorage ? LocalStorageArticlesService : ApiArticlesService,
    },
    {
      provide: CATEGORIES_SERVICE,
      useClass: environment.useLocalStorage ? LocalStorageCategoriesService : ApiCategoriesService,
    },
    provideApollo(() => {
      const httpLink = inject(HttpLink);
      return {
        link: httpLink.create({ uri: '/graphql' }),
        cache: new InMemoryCache(),
      };
    }),
  ],
};
