import { Component, ElementRef, ViewChild } from '@angular/core';
import { ArticleCard, Post } from '../../components/article-card/article-card';
import { AddPostForm } from '../../components/add-post-form/add-post-form';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [ArticleCard, AddPostForm],
  templateUrl: './blog.html',
  styleUrl: './blog.scss',
})
export class Blog {
  isFormVisible = false;
  isStatsVisible = false;

  @ViewChild('statsDialog') statsDialog!: ElementRef<HTMLDialogElement>;

  // Посты
  posts: Post[] = [
    {
      id: 1,
      title: 'Бегущий по лезвию 2049 (2017)',
      text: 'Роль офицера Кея (К) стала для меня одним из самых глубоких погружений в атмосферу киберпанка. Работа с визионером Дени Вильнёвом, оператором Роджером Дикинсом и легендарным Харрисоном Фордом — это незабываемый опыт, который навсегда изменил мой взгляд на кинопроизводство.',
      date: '6 Октября, 2017',
      img: 'photo 3.jpg',
    },
    {
      id: 2,
      title: 'Славные парни (2016)',
      text: 'Комедийный детектив, где мы с Расселом Кроу расследуем дело в Лос-Анджелесе 70-х. Играть нелепого детектива Холланда Марча было сплошным удовольствием.',
      date: '15 Мая, 2016',
      img: 'photo 4.jpg',
    },
    {
      id: 3,
      title: 'Место под соснами (2012)',
      text: 'История о мотокаскадере Люке, который решает грабить банки ради своей семьи. Эмоционально тяжелая, но невероятно важная для меня роль.',
      date: '7 Сентября, 2012',
      img: 'photo 5.jpg',
    },
    {
      id: 4,
      title: 'Игра на понижение (2015)',
      text: 'Роль Джареда Веннетта позволила мне примерить костюм циничного брокера с Уолл-стрит. Отличный сценарий, основанный на реальных событиях.',
      date: '11 Декабря, 2015',
      img: 'photo 6.jpg',
    },
    {
      id: 5,
      title: 'Человек на Луне (2018)',
      text: 'Сыграть Нила Армстронга — огромная ответственность. Мы постарались показать не только исторический полет, но и глубокую личную драму человека.',
      date: '12 Октября, 2018',
      img: 'photo 7.jpg',
    },
    {
      id: 6,
      title: 'Мартовские иды (2011)',
      text: 'Напряженный политический триллер режиссера Джорджа Клуни. Мой персонаж, Стивен Майерс, проходит путь от идеалиста до жесткого политтехнолога.',
      date: '31 Августа, 2011',
      img: 'photo 8.jpg',
    },
    {
      id: 7,
      title: 'Каскадёры (2024)',
      text: 'Прекрасная дань уважения всем каскадерам Голливуда. Много экшена, трюков и искрометного юмора в дуэте с невероятной Эмили Блант.',
      date: '3 Мая, 2024',
      img: 'photo 9.jpg',
    },
  ];

  toggleForm() {
    this.isFormVisible = !this.isFormVisible;
    if (this.isFormVisible) {
      setTimeout(() => {
        document
          .getElementById('formSection')
          ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
    }
  }

  toggleStats() {
    const dialog = this.statsDialog.nativeElement;
    if (dialog.open) {
      dialog.close();
    } else {
      dialog.showModal();
    }
  }

  // Метод для добавления новой статьи
  onAddPost(data: { title: string; img: string; text: string }) {
    const newPost: Post = {
      id: Date.now(),
      title: data.title,
      text: data.text,
      img: data.img || 'rickroll.jpg',
      date: new Date().toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    };

    this.posts.unshift(newPost);
    this.isFormVisible = false;
  }

  onDeletePost(id: number) {
    this.posts = this.posts.filter((post) => post.id !== id);
  }
}
