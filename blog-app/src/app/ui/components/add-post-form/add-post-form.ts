import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  OnChanges,
  SimpleChanges,
  input,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ReactiveFormsModule, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { startWith } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { Post } from '../../../models/post.model';
import { CategoriesService, Category } from '../../../services/categories/categories.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-add-post-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
  ],
  templateUrl: './add-post-form.html',
  styleUrl: './add-post-form.scss',
})
export class AddPostForm implements OnInit, OnChanges {
  public editPost = input<Post | null>(null);

  @Output() public add = new EventEmitter<any>();
  @Output() public update = new EventEmitter<Post>();
  @Output() public cancel = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private categoriesService = inject(CategoriesService);

  protected postForm: FormGroup;
  protected allCategories = signal<Category[]>([]);
  protected selectedFileName = signal<string>('');

  protected filteredCategories = computed(() => {
    const query = (this.categoryValue() || '').toLowerCase();
    return this.allCategories().filter((c) => c.name.toLowerCase().includes(query));
  });

  private categoryValue = toSignal(this.fb.control('').valueChanges.pipe(startWith('')), {
    initialValue: '',
  });

  protected formTitle = computed(() =>
    this.editPost() ? 'Изменить статью' : 'Добавить запись в дневник (памяти)',
  );

  protected saveButtonTitle = computed(() => (this.editPost() ? 'Сохранить' : 'Добавить'));

  constructor() {
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(25)]],
      text: ['', [Validators.required]],
      img: [''],
      imageFile: [null],
      categoryName: [''],
    });

    this.postForm.get('categoryName')?.valueChanges.subscribe((v) => {
      (this as any).categoryValue.set(v);
    });
  }

  public ngOnInit(): void {
    this.initFormData();
    this.loadCategories();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['editPost']) {
      this.initFormData();
    }
  }

  private loadCategories(): void {
    if (!environment.useLocalStorage) {
      this.categoriesService.getAll().subscribe((list) => this.allCategories.set(list));
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
      this.selectedFileName.set('');
    } else {
      this.postForm.reset();
      this.selectedFileName.set('');
    }
  }

  protected onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.postForm.patchValue({ imageFile: file });
      this.selectedFileName.set(file.name);
    }
  }

  protected onSubmit(): void {
    if (this.postForm.invalid) return;

    const formValue = this.postForm.value;
    const categoryName = formValue.categoryName?.trim();

    if (environment.useLocalStorage || !categoryName) {
      this.completeSubmit(formValue);
      return;
    }

    const existingCat = this.allCategories().find(
      (c) => c.name.toLowerCase() === categoryName.toLowerCase(),
    );

    if (existingCat) {
      this.completeSubmit({ ...formValue, categoryId: existingCat.id });
    } else {
      this.categoriesService.create(categoryName).subscribe((newCat) => {
        this.allCategories.update((list) => [...list, newCat]);
        this.completeSubmit({ ...formValue, categoryId: newCat.id });
      });
    }
  }

  private completeSubmit(data: any): void {
    const currentEditPost = this.editPost();
    if (currentEditPost) {
      this.update.emit({ ...currentEditPost, ...data });
    } else {
      this.add.emit(data);
    }
    this.postForm.reset();
    this.selectedFileName.set('');
  }

  protected hasError(controlName: string): boolean {
    const control = this.postForm.get(controlName);
    return !!(control?.invalid && (control?.dirty || control?.touched));
  }

  protected getControlErrors(controlName: string): string[] {
    const control = this.postForm.get(controlName);
    const errors = control?.errors;
    return errors
      ? Object.entries(errors).map(([key, value]) => this.getErrorStr(key, value, controlName))
      : [];
  }

  private getErrorStr(errorCode: string, errorData: any, controlName: string): string {
    switch (errorCode) {
      case 'required':
        return controlName === 'title' ? 'Наименование обязательно' : 'Текст статьи обязателен';
      case 'minlength':
        return `Минимум символов: ${errorData.requiredLength}`;
      default:
        return 'Ошибка заполнения';
    }
  }
}
