import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
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
  @Input() public editPost: Post | null = null;

  @Output() public add = new EventEmitter<Omit<Post, 'id' | 'date'>>();
  @Output() public update = new EventEmitter<Post>();
  @Output() public cancel = new EventEmitter<void>();

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
    if (this.editPost) {
      this.postForm.patchValue({
        title: this.editPost.title,
        text: this.editPost.text,
        img: this.editPost.img,
      });
    } else {
      this.postForm.reset();
    }
  }

  protected onSubmit(): void {
    if (this.postForm.invalid) return;

    const formValue = this.postForm.value;

    if (this.editPost) {
      this.update.emit({
        ...this.editPost,
        ...formValue,
      });
    } else {
      this.add.emit(formValue);
    }

    this.postForm.reset();
  }
}
