import { Component, EventEmitter, Output, inject, effect } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { AUTH_SERVICE } from '../../../services/auth/auth-service.token';

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
  private authService = inject(AUTH_SERVICE);

  @Output() public submitted = new EventEmitter<{ author: string; text: string }>();

  protected commentForm: FormGroup;
  protected currentUser = this.authService.currentUser;
  protected isLoggedIn = this.authService.isLoggedIn;

  constructor() {
    this.commentForm = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2)]],
      text: ['', [Validators.required, Validators.minLength(5)]],
    });
    effect(() => {
      const user = this.currentUser();
      const authorControl = this.commentForm.get('author');

      if (user) {
        authorControl?.setValue(user.username, { emitEvent: false });
        authorControl?.clearValidators();
      } else {
        authorControl?.setValue('', { emitEvent: false });
        authorControl?.setValidators([Validators.required, Validators.minLength(2)]);
      }
      authorControl?.updateValueAndValidity();
    });
  }

  protected onSubmit(): void {
    if (this.commentForm.valid) {
      const val = this.commentForm.value;
      this.submitted.emit(val);
      this.commentForm.get('text')?.reset();
      if (this.isLoggedIn()) {
        this.commentForm
          .get('author')
          ?.setValue(this.currentUser()?.username, { emitEvent: false });
      }
    }
  }
}
