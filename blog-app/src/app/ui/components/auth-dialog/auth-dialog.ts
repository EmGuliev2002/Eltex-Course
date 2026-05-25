import { Component, inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { AUTH_SERVICE } from '../../../services/auth/auth-service.token';

@Component({
  selector: 'app-auth-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
  ],
  templateUrl: './auth-dialog.html',
  styleUrl: './auth-dialog.scss',
  encapsulation: ViewEncapsulation.None,
})
export class AuthDialog {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<AuthDialog>);
  private authService = inject(AUTH_SERVICE);

  protected authForm: FormGroup;
  protected isLoginMode = true;
  protected errorMessage = '';

  constructor() {
    this.authForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
      isAdmin: [false],
    });
  }

  protected toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = '';

    const emailControl = this.authForm.get('email');
    if (this.isLoginMode) {
      emailControl?.clearValidators();
    } else {
      emailControl?.setValidators([Validators.required, Validators.email]);
    }
    emailControl?.updateValueAndValidity();
  }

  protected onSubmit(): void {
    if (this.authForm.invalid) return;

    const val = this.authForm.value;
    this.errorMessage = '';

    if (this.isLoginMode) {
      this.authService.login(val.username, val.password).subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.errorMessage = err.message || 'Ошибка входа';
        },
      });
    } else {
      this.authService.register(val.username, val.email, val.password, val.isAdmin).subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.errorMessage = err.message || 'Ошибка регистрации';
        },
      });
    }
  }
}
