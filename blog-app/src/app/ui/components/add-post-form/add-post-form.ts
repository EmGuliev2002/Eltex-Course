import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-post-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-post-form.html',
  styleUrl: './add-post-form.scss',
})
export class AddPostForm {
  @Output() add = new EventEmitter<{ title: string; img: string; text: string }>();
  @Output() cancel = new EventEmitter<void>();

  formData = {
    title: '',
    img: '',
    text: '',
  };

  onSubmit() {
    this.add.emit({ ...this.formData });
    this.formData = { title: '', img: '', text: '' };
  }
}
