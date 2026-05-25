import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Post } from '../../../models/post.model';
import { HasRoleDirective } from '../../../directives/has-role.directive';

@Component({
  selector: 'app-article-card',
  standalone: true,
  imports: [RouterLink, MatIconModule, HasRoleDirective],
  templateUrl: './article-card.html',
  styleUrl: './article-card.scss',
})
export class ArticleCard {
  @Input({ required: true }) public post!: Post;
  @Output() public delete = new EventEmitter<string | number>();
  @Output() public edit = new EventEmitter<Post>();

  protected onDelete(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.delete.emit(this.post.id);
  }

  protected onEdit(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.edit.emit(this.post);
  }
}
