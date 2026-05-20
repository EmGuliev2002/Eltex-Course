import { InjectionToken } from '@angular/core';
import { ICategoriesService } from './categories-service.interface';

export const CATEGORIES_SERVICE = new InjectionToken<ICategoriesService>('CATEGORIES_SERVICE');
