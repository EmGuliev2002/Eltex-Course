import { Component, signal } from '@angular/core';

import { Header } from './ui/components/header/header';
import { Home } from './ui/pages/home/home';
import { Footer } from './ui/components/footer/footer';

@Component({
  selector: 'app-root',
  imports: [Header, Home, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('blog-app');
}
