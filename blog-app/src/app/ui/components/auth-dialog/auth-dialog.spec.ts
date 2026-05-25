import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { AuthDialog } from './auth-dialog';
import { AUTH_SERVICE } from '../../../services/auth/auth-service.token';

describe('AuthDialog', () => {
  let component: AuthDialog;
  let fixture: ComponentFixture<AuthDialog>;

  const mockDialogRef = {
    close: () => {},
  };

  const mockAuthService = {
    currentUser: () => null,
    isLoggedIn: () => false,
    login: () => of({}),
    register: () => of({}),
    logout: () => of(undefined),
    getAccessToken: () => null,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthDialog, BrowserAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: AUTH_SERVICE, useValue: mockAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
