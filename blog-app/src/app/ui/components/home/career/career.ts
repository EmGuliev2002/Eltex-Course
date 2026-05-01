import { Component } from '@angular/core';

interface CareerItem {
  meta: string;
  title: string;
  text: string;
  iconClass: string;
}

@Component({
  selector: 'app-career',
  standalone: true,
  imports: [],
  templateUrl: './career.html',
  styleUrl: './career.scss',
})
export class Career {
  protected readonly careerItems: CareerItem[] = [
    {
      meta: 'The Mickey Mouse Club - (1993 - 1995)',
      title: 'Старт карьеры',
      text: 'Выступал в знаменитом детском шоу на канале Disney вместе с будущими мировыми звездами: Джастином Тимберлейком, Бритни Спирс и Кристиной Агилерой.',
      iconClass: 'circle-orange-blue',
    },
    {
      meta: 'Дневник памяти - (2004)',
      title: 'Мировой прорыв',
      text: 'Сыграл Ноя Кэлхуна в культовой романтической драме. Эта роль принесла мне первую широкую мировую известность и статус романтического героя.',
      iconClass: 'diamond-orange',
    },
    {
      meta: 'Ла-Ла Ленд - (2016)',
      title: 'Признание критиков',
      text: 'Роль джазового пианиста Себастьяна. Ради фильма я научился играть на фортепиано с нуля. Получил «Золотой глобус» и номинацию на «Оскар» за лучшую мужскую роль.',
      iconClass: 'circle-blue',
    },
  ];
}
