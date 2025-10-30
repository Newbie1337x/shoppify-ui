import { Directive, Input, TemplateRef, ViewContainerRef, effect, inject } from '@angular/core';
import { AuthService } from './services/auth-service';


type Logic = 'AND' | 'OR';

@Directive({
  selector: '[appHasAuthority]',
  standalone: true,
})
export class HasAuthorityDirective {
  private authService = inject(AuthService)
  private templateRef = inject(TemplateRef<any>)
  private viewContainer = inject(ViewContainerRef)

  private requiredAuthorities: string[] = []
  private hasView = false
  private logic: Logic = 'OR' //por defecto

  constructor() {
    effect(() => {
      this.checkPermissions()
    })
  }

  @Input('appHasAuthority')
  set authorities(value: string | string[]) {
    this.requiredAuthorities = Array.isArray(value) ? value : [value]
    this.checkPermissions()
  }

  @Input('appHasAuthorityLogic')
  set authorityLogic(logic: Logic) {
    this.logic = logic
    this.checkPermissions()
  }

  private checkPermissions(): void {
    const userPermits = this.authService.permits()
    let hasPermission = false

    if (this.logic === 'OR') {
      hasPermission = this.requiredAuthorities.some(auth => userPermits.includes(auth))
    } else {
      hasPermission = this.requiredAuthorities.every(auth => userPermits.includes(auth)) //and
    }

    if (hasPermission && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef)
      this.hasView = true
    } else if (!hasPermission && this.hasView) {
      this.viewContainer.clear()
      this.hasView = false
    }
  }
}
