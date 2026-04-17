import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPostForm } from './add-post-form';

describe('AddPostForm', () => {
  let component: AddPostForm;
  let fixture: ComponentFixture<AddPostForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPostForm],
    }).compileComponents();

    fixture = TestBed.createComponent(AddPostForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
