import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { tap, catchError, map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';

/**
 * Guard for pages that should only be accessible when NOT logged in
 * Ensures user state is properly initialized before checking
 */
export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const tokenService = inject(TokenService);
  const router = inject(Router);

  // If already authenticated in signal, redirect
  if (authService.isAuthenticated()) {
    router.navigate(['/']);
    return false;
  }

  // If there's a valid token, user should not be on login/register pages
  // This prevents accessing auth pages even if signal hasn't loaded yet
  if (tokenService.hasValidToken()) {
    // Wait for signal to be populated or load the user
    return authService.getMe().pipe(
      tap((user) => {
        authService.setCurrentUser(user);
        router.navigate(['/']);
      }),
      map(() => false),
      catchError(() => {
        // Token invalid - clear it and allow access to login
        tokenService.clearAccessToken();
        return [true];
      })
    );
  }

  // No token and not authenticated - allow access
  return true;
};
