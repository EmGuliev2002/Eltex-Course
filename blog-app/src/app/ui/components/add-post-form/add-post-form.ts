import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  OnChanges,
  SimpleChanges,
  input,
  computed,
} from '@angular/core';
import { ReactiveFormsModule, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Post } from '../../../models/post.model';

@Component({
  selector: 'app-add-post-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-post-form.html',
  styleUrl: './add-post-form.scss',
})
export class AddPostForm implements OnInit, OnChanges {
  // Перевод Input на сигналы
  public editPost = input<Post | null>(null);

  @Output() public add = new EventEmitter<Omit<Post, 'id' | 'date'>>();
  @Output() public update = new EventEmitter<Post>();
  @Output() public cancel = new EventEmitter<void>();

  // Вычисляемые свойства для заголовка и кнопки
  protected formTitle = computed(() =>
    this.editPost() ? 'Изменить статью' : 'Добавить запись в дневник (памяти)',
  );

  protected saveButtonTitle = computed(() => (this.editPost() ? 'Сохранить' : 'Добавить'));

  protected postForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(25)]],
      text: ['', [Validators.required]],
      img: [''],
    });
  }

  public ngOnInit(): void {
    this.initFormData();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['editPost']) {
      this.initFormData();
    }
  }

  private initFormData(): void {
    const post = this.editPost();
    if (post) {
      this.postForm.patchValue({
        title: post.title,
        text: post.text,
        img: post.img,
      });
    } else {
      this.postForm.reset();
    }
  }

  protected onSubmit(): void {
    if (this.postForm.invalid) return;

    const formValue = this.postForm.value;
    const currentEditPost = this.editPost();

    if (currentEditPost) {
      this.update.emit({
        ...currentEditPost,
        ...formValue,
      });
    } else {
      this.add.emit(formValue);
    }

    this.postForm.reset();
  }

  // Методы для обработки ошибок валидации
  protected hasError(controlName: string): boolean {
    const control = this.postForm.get(controlName);
    return !!(control?.invalid && (control?.dirty || control?.touched));
  }

  protected getControlErrors(controlName: string): string[] {
    const control = this.postForm.get(controlName);
    const errors = control?.errors;

    if (errors) {
      return Object.entries(errors).map(([key, value]) =>
        this.getErrorStr(key, value, controlName),
      );
    }
    return [];
  }

  private getErrorStr(errorCode: string, errorData: any, controlName: string): string {
    switch (errorCode) {
      case 'required':
        return controlName === 'title'
          ? 'Наименование обязательно для заполнения'
          : 'Текст статьи обязателен';
      case 'minlength':
        return `Минимальное количество символов в названии: ${errorData.requiredLength}`;
      default:
        return 'Ошибка при заполнении поля';
    }
  }
}
