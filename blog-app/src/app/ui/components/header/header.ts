import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AUTH_SERVICE } from '../../../services/auth/auth-service.token';
import { AuthDialog } from '../auth-dialog/auth-dialog';

@Component({
  selector: 'app-header',
  imports: [
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    MatDialogModule,
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private dialog = inject(MatDialog);
  private authService = inject(AUTH_SERVICE);

  protected currentUser = this.authService.currentUser;
  protected isLoggedIn = this.authService.isLoggedIn;

  protected openAuthDialog(): void {
    this.dialog.open(AuthDialog, {
      width: '400px',
      disableClose: false,
    });
  }

  protected onLogout(): void {
    this.authService.logout().subscribe();
  }
}
