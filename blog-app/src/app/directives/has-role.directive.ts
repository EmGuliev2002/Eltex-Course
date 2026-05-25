import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  inject,
  effect,
  signal,
} from '@angular/core';
import { AUTH_SERVICE } from '../services/auth/auth-service.token';

@Directive({
  selector: '[appHasRole]',
  standalone: true,
})
export class HasRoleDirective {
  private authService = inject(AUTH_SERVICE);
  private templateRef = inject(TemplateRef<any>);
  private viewContainer = inject(ViewContainerRef);

  private requiredRoles = signal<string[]>([]);
  private hasView = false;

  @Input() set appHasRole(roles: string | string[]) {
    const rolesArray = Array.isArray(roles) ? roles : [roles];
    this.requiredRoles.set(rolesArray);
  }

  constructor() {
    effect(() => {
      const user = this.authService.currentUser();
      const roles = this.requiredRoles();

      const hasAccess = user !== null && roles.includes(user.role);

      if (hasAccess && !this.hasView) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.hasView = true;
      } else if (!hasAccess && this.hasView) {
        this.viewContainer.clear();
        this.hasView = false;
      }
    });
  }
}
