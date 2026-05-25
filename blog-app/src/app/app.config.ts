import { ApplicationConfig, provideBrowserGlobalErrorListeners, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { ARTICLES_SERVICE } from './services/articles/articles-service.token';
import { ApiArticlesService } from './services/articles/api-articles.service';
import { LocalStorageArticlesService } from './services/articles/local-storage-articles.service';
import { CATEGORIES_SERVICE } from './services/categories/categories-service.token';
import { ApiCategoriesService } from './services/categories/categories.service';
import { LocalStorageCategoriesService } from './services/categories/local-storage-categories.service';
import { AUTH_SERVICE } from './services/auth/auth-service.token';
import { ApiAuthService } from './services/auth/api-auth.service';
import { LocalStorageAuthService } from './services/auth/local-storage-auth.service';
import { authInterceptor } from './interceptors/auth.interceptor';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    {
      provide: ARTICLES_SERVICE,
      useClass: environment.useLocalStorage ? LocalStorageArticlesService : ApiArticlesService,
    },
    {
      provide: CATEGORIES_SERVICE,
      useClass: environment.useLocalStorage ? LocalStorageCategoriesService : ApiCategoriesService,
    },
    {
      provide: AUTH_SERVICE,
      useClass: environment.useLocalStorage ? LocalStorageAuthService : ApiAuthService,
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
