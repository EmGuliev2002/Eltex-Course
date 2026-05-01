import { Component } from '@angular/core';

interface HobbyItem {
  title: string;
  text: string;
  img: string;
  sizeClass: string;
}

@Component({
  selector: 'app-hobby',
  standalone: true,
  imports: [],
  templateUrl: './hobby.html',
  styleUrl: './hobby.scss',
})
export class Hobby {
  protected readonly hobbyItems: HobbyItem[] = [
    {
      title: "Dead Man's Bones",
      text: 'В 2009 году основал инди-рок группу. Мы выпустили альбом, где я пою, играю на фортепиано, гитаре и виолончели.',
      img: 'hobby 1.jpg',
      sizeClass: 'tall',
    },
    {
      title: 'Режиссура',
      text: 'Снял свой первый авторский фильм «Как поймать монстра» (Lost River) в 2014 году. Это нео-нуарная сказка.',
      img: 'hobby 2.jpg',
      sizeClass: 'tall',
    },
    {
      title: 'Столярное дело',
      text: 'Люблю работать руками. Кухонный стол, который мой персонаж делает в «Дневнике памяти», я смастерил сам.',
      img: 'hobby 3.jpg',
      sizeClass: 'wide',
    },
    {
      title: 'Любовь к танцам',
      text: 'В детстве я занимался балетом, что сильно помогло мне позже при подготовке к сложным хореографическим сценам.',
      img: 'hobby 4.jpg',
      sizeClass: 'wide',
    },
  ];
}
