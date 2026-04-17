import { Component, Input } from '@angular/core';

export interface PortfolioItem {
  category: string;
  colorClass: string;
  title: string;
  text: string;
  img: string;
}

@Component({
  selector: 'app-portfolio-card',
  standalone: true,
  templateUrl: './portfolio-card.html',
  styleUrl: './portfolio-card.scss',
})
export class PortfolioCard {
  @Input({ required: true }) item!: PortfolioItem;
}
