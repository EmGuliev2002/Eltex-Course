import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { ARTICLES_SERVICE } from './services/articles/articles-service.token';
import { ArticlesService } from './services/articles/articles.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    {
      provide: ARTICLES_SERVICE,
      useClass: ArticlesService,
    },
  ],
};
