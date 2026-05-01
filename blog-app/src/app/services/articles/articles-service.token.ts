import { InjectionToken } from '@angular/core';
import { IArticlesService } from './articles-service.interface';

export const ARTICLES_SERVICE = new InjectionToken<IArticlesService>('ARTICLES_SERVICE');
