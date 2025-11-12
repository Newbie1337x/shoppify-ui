import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../../services/auth-service';

export const hasPermitsGuard = (): CanActivateFn => {
  return () => {
    const authService = inject(AuthService)
    const userPermits = authService.permits()
    const hasPermits = userPermits.some(p => p.includes('ADMIN'))

    if (!authService.user) return false;

    return hasPermits
  }
}
