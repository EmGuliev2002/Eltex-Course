import { Component, Input } from '@angular/core';
import { PortfolioItem } from '../../../models/portfolio-item.model'; 

@Component({
  selector: 'app-portfolio-card',
  standalone: true,
  templateUrl: './portfolio-card.html',
  styleUrl: './portfolio-card.scss',
})
export class PortfolioCard {
  @Input({ required: true }) public item!: PortfolioItem;
}
