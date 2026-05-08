import { Component, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
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
export class Home implements OnInit {
  private titleService = inject(Title);

  public ngOnInit(): void {
    this.titleService.setTitle('Райан Гослинг - Портфолио');
  }
}
