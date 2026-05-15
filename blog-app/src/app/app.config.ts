import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { ARTICLES_SERVICE } from './services/articles/articles-service.token';
import { ApiArticlesService } from './services/articles/api-articles.service';
import { LocalStorageArticlesService } from './services/articles/local-storage-articles.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    {
      provide: ARTICLES_SERVICE,
      useClass: environment.useLocalStorage ? LocalStorageArticlesService : ApiArticlesService,
    },
  ],
};
