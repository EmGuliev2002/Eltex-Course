import { Routes } from '@angular/router';
import { Home } from './ui/pages/home/home';
import { Blog } from './ui/pages/blog/blog';
import { PostDetail } from './ui/pages/post-detail/post-detail';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'blog', component: Blog },
  { path: 'blog/:id', component: PostDetail },
  { path: '**', redirectTo: '' },
];
