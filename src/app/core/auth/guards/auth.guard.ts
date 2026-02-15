import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';
import { catchError, map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const tokenService = inject(TokenService);
  const router = inject(Router);

  // First check: Is user already authenticated in signal?
  if (authService.isAuthenticated()) {
    return true;
  }

  // Second check: Is there a valid token in storage but user not yet loaded?
  if (!tokenService.hasValidToken()) {
    router.navigate(['/auth/login'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }

  // Have a valid token but user signal not initialized yet, load user
  // Note: User state is automatically updated by reloadUser()
  return authService.reloadUser().pipe(
    take(1),
    map(() => true),
    catchError(() => {
      // Token is invalid despite hasValidToken returning true, clear and redirect
      tokenService.clearAccessToken();
      router.navigate(['/auth/login'], {
        queryParams: { returnUrl: state.url }
      });
      return [false];
    })
  );
};
