import { Directive, Input, TemplateRef, ViewContainerRef, effect, inject } from '@angular/core';
import { AuthService } from './services/auth-service';

@Directive({
  selector: '[appHasRole]',
  standalone: true,
})
export class HasRoleDirective {
  private authService = inject(AuthService)
  private templateRef = inject(TemplateRef<any>)
  private viewContainer = inject(ViewContainerRef)

  private requiredRoles: string[] = [] //Modificar modelo user para que tenga los roles
  private hasView = false

  constructor() {
    effect(() => {
      this.checkRoles()
    })
  }

  @Input('appHasRole')
  set roles(roles: string | string[]) {
    this.requiredRoles = Array.isArray(roles) ? roles : [roles]
    this.checkRoles()
  }

  private checkRoles(): void {
    const userPermits = this.authService!.permits()
    const hasRequiredRole = this.requiredRoles.some(role => userPermits.includes(role))

    if (hasRequiredRole && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef)
      this.hasView = true
    } else if (!hasRequiredRole && this.hasView) {
      this.viewContainer.clear()
      this.hasView = false
    }
  }
}
