import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface Post {
  id: number;
  title: string;
  text: string;
  date: string;
  img: string;
}

@Component({
  selector: 'app-article-card',
  standalone: true,
  templateUrl: './article-card.html',
  styleUrl: './article-card.scss',
})
export class ArticleCard {
  @Input({ required: true }) post!: Post;
  @Output() delete = new EventEmitter<number>();

  onDelete(event: Event) {
    event.preventDefault();
    this.delete.emit(this.post.id);
  }
}
