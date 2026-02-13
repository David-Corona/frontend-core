import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError, switchMap, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const tokenService = inject(TokenService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle 401 Unauthorized
      if (error.status === 401) {
        // Don't refresh on auth endpoints
        const isAuthEndpoint = req.url.includes('/auth/login') ||
                               req.url.includes('/auth/register') ||
                               req.url.includes('/auth/refresh') ||
                               req.url.includes('/auth/me');

        if (!isAuthEndpoint && tokenService.hasValidToken()) {
          return authService.refreshToken().pipe(
            switchMap(() => {
              // Retry original request with new token
              return next(req);
            }),
            catchError((refreshError) => {
              // Refresh failed - token is likely invalid, redirect to login
              router.navigate(['/auth/login'], {
                queryParams: { returnUrl: router.url }
              });
              return throwError(() => refreshError);
            })
          );
        }
      }

      return throwError(() => error);
    })
  );
};
