import { Component, ElementRef, ViewChild } from '@angular/core';
import { Post } from '../../../models/post.model';
import { ArticleCard } from '../../components/article-card/article-card';
import { AddPostForm } from '../../components/add-post-form/add-post-form';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [ArticleCard, AddPostForm],
  templateUrl: './blog.html',
  styleUrl: './blog.scss',
})
export class Blog {
  @ViewChild('statsDialog') private statsDialog!: ElementRef<HTMLDialogElement>;

  protected isFormVisible = false;
  protected editingPost: Post | null = null;

  protected posts: Post[] = [
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

  protected toggleForm(): void {
    if (this.isFormVisible && this.editingPost) {
      this.editingPost = null;
    } else {
      this.isFormVisible = !this.isFormVisible;
      this.editingPost = null;
    }
    if (this.isFormVisible) {
      this.scrollToForm();
    }
  }

  protected toggleStats(): void {
    const dialog = this.statsDialog.nativeElement;
    dialog.open ? dialog.close() : dialog.showModal();
  }

  protected onAddPost(data: any): void {
    const newPost: Post = {
      ...data,
      id: Date.now(),
      date: new Date().toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      img: data.img || 'assets/rickroll.jpg',
    };
    this.posts.unshift(newPost);
    this.isFormVisible = false;
  }

  protected onEditPost(post: Post): void {
    this.editingPost = post;
    this.isFormVisible = true;
    this.scrollToForm();
  }

  protected onUpdatePost(updatedPost: Post): void {
    this.posts = this.posts.map((p) => (p.id === updatedPost.id ? updatedPost : p));
    this.isFormVisible = false;
    this.editingPost = null;
  }

  protected onDeletePost(id: number): void {
    this.posts = this.posts.filter((post) => post.id !== id);
    if (this.editingPost?.id === id) {
      this.isFormVisible = false;
      this.editingPost = null;
    }
  }

  protected onCancelForm(): void {
    this.isFormVisible = false;
    this.editingPost = null;
  }

  private scrollToForm(): void {
    setTimeout(() => {
      document
        .getElementById('formSection')
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  }
}
