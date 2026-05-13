import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-add-comment-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
  ],
  templateUrl: './add-comment-form.html',
  styleUrl: './add-comment-form.scss',
})
export class AddCommentForm {
  private fb = inject(FormBuilder);

  @Output() public submitted = new EventEmitter<{ author: string; text: string }>();

  protected commentForm: FormGroup;

  constructor() {
    this.commentForm = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2)]],
      text: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  protected onSubmit(): void {
    if (this.commentForm.valid) {
      this.submitted.emit(this.commentForm.value);
      this.commentForm.reset();
    }
  }
}
