import { Component } from '@angular/core';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [],
  templateUrl: './skills.html',
  styleUrl: './skills.scss',
})
export class Skills {
  protected readonly skills: string[] = [
    'Актёрское мастерство',
    'Экстремальное вождение (Драйв)',
    'Игра на джазовом фортепиано',
    'Продюсирование и режиссура',
    'Вокал и игра на гитаре',
    'Молчаливая харизма',
  ];
}
