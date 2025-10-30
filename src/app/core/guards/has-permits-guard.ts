import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../../services/auth-service';

export const hasPermitsGuard = (roles: string[]): CanActivateFn => {
  return () => {
    const authService = inject(AuthService)
    const userPermits = authService.permits()
    const hasPermits = userPermits.some(role => roles.includes(role))

    if (!authService.user) return false;

    return hasPermits
  }
}
