import { Component } from '@angular/core';
import { Hero } from '../../components/home/hero/hero';
import { LatestArticles } from '../../components/home/latest-articles/latest-articles';
import { Skills } from '../../components/home/skills/skills';
import { Career } from '../../components/home/career/career';
import { Hobby } from '../../components/home/hobby/hobby';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Hero, LatestArticles, Skills, Career, Hobby],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
}
