import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCommentForm } from './add-comment-form';

describe('AddCommentForm', () => {
  let component: AddCommentForm;
  let fixture: ComponentFixture<AddCommentForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCommentForm],
    }).compileComponents();

    fixture = TestBed.createComponent(AddCommentForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
