import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError, timer, switchMap } from 'rxjs';
import { TokenService } from './token.service';
import { LoginRequest, RegisterRequest, AuthResponse, VerifyEmailRequest, ResendVerificationRequest,
    ForgotPasswordRequest, ResetPasswordRequest, SessionListResponse, Session } from '../models/auth-response.model';
import { User } from '../models/user.model';
import { environment } from '../../../../environments/environments';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    private router = inject(Router);
    private tokenService = inject(TokenService);

    // State management
    currentUser = signal<User | null>(null);
    isAuthenticated = computed(() => !!this.currentUser());
    isAdmin = computed(() => this.currentUser()?.roles.includes('admin') ?? false);
    isVerified = computed(() => this.currentUser()?.isVerified ?? false);

    // Token refresh management
    private refreshTimer: any;
    private readonly REFRESH_BEFORE_EXPIRY_MINUTES = 5;

    constructor() {
        // Initialization is deferred to avoid circular dependency with interceptors
    }

    /**
     * Initialize authentication state on app startup
     * Called via APP_INITIALIZER to avoid circular dependency with interceptors
     */
    public initializeAuth(): void {
        if (this.tokenService.hasValidToken()) {
            this.loadCurrentUser().subscribe({
                next: () => this.startTokenRefreshTimer(),
                error: (err) => {
                    // Only clear if token is invalid (401/403)
                    // Keep token for network errors - guard will retry
                    if (err.status === 401 || err.status === 403) {
                        console.error('Invalid token, clearing auth data');
                        this.clearAuthData();
                    } else {
                        console.warn('Failed to load user on startup (network error):', err);
                    }
                }
            });
        }
    }

    register(credentials: RegisterRequest): Observable<AuthResponse> {
        return this.http
            .post<AuthResponse>(
                `${environment.apiUrl}/auth/register`,
                credentials,
                { withCredentials: true } // Important for cookies
            )
            .pipe(
                tap((response) => this.handleAuthSuccess(response)),
                catchError(this.handleAuthError)
            );
    }

    login(credentials: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, credentials, { withCredentials: true }).pipe(
            tap((response) => this.handleAuthSuccess(response)),
            catchError(this.handleAuthError)
        );
    }

    refreshToken(): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/refresh`, {}, { withCredentials: true }).pipe(
            tap((response) => {
                this.tokenService.setAccessToken(response.accessToken);
                this.updateUserState(response.user);
            }),
            catchError((error) => {
                this.clearAuthData();
                return throwError(() => error);
            })
        );
    }

    logout(): Observable<void> {
        return this.http.post<void>(`${environment.apiUrl}/auth/logout`, {}, { withCredentials: true }).pipe(
            tap(() => {
                this.clearAuthData();
                this.router.navigate(['/auth/login']);
            }),
            catchError((error) => {
                // Even if logout fails, clear local data
                this.clearAuthData();
                this.router.navigate(['/auth/login']);
                return throwError(() => error);
            })
        );
    }

    logoutAll(): Observable<void> {
        return this.http.post<void>(`${environment.apiUrl}/auth/logout/all`, {}, { withCredentials: true }).pipe(
            tap(() => {
                this.clearAuthData();
                this.router.navigate(['/auth/login']);
            })
        );
    }

    logoutOthers(): Observable<void> {
        return this.http.post<void>(`${environment.apiUrl}/auth/logout/others`, {}, { withCredentials: true });
    }

    getSessions(): Observable<SessionListResponse> {
        return this.http.get<SessionListResponse>(`${environment.apiUrl}/auth/sessions`, { withCredentials: true });
    }

    revokeSession(sessionId: string): Observable<void> {
        return this.http.delete<void>(`${environment.apiUrl}/auth/sessions/${sessionId}`, { withCredentials: true });
    }

    getMe(): Observable<User> {
        return this.http.get<User>(`${environment.apiUrl}/auth/me`, { withCredentials: true });
    }

    verifyEmail(request: VerifyEmailRequest): Observable<{ message: string }> {
        return this.http.post<{ message: string }>(`${environment.apiUrl}/auth/verify-email`, request);
    }

    resendVerification(request: ResendVerificationRequest): Observable<{ message: string }> {
        return this.http.post<{ message: string }>(`${environment.apiUrl}/auth/resend-verification`, request);
    }

    requestPasswordReset(request: ForgotPasswordRequest): Observable<{ message: string }> {
        return this.http.post<{ message: string }>(`${environment.apiUrl}/auth/forgot-password`, request);
    }

    resetPassword(request: ResetPasswordRequest): Observable<{ message: string }> {
        return this.http.post<{ message: string }>(`${environment.apiUrl}/auth/reset-password`, request);
    }

    /**
     * Public method for guards to load and sync user state
     * Called when user signal isn't initialized but token exists
     */
    public reloadUser(): Observable<User> {
        return this.loadCurrentUser();
    }

    private loadCurrentUser(): Observable<User> {
        return this.getMe().pipe(tap((user) => this.updateUserState(user)));
    }

    private handleAuthSuccess(response: AuthResponse): void {
        this.tokenService.setAccessToken(response.accessToken);
        this.updateUserState(response.user);
        this.startTokenRefreshTimer();
    }

    private updateUserState(user: User): void {
        this.currentUser.set(user);
    }

    private clearAuthData(): void {
        this.tokenService.clearAccessToken();
        this.currentUser.set(null);
        this.stopTokenRefreshTimer();
    }

    private startTokenRefreshTimer(): void {
        this.stopTokenRefreshTimer();

        const expirationTime = this.tokenService.getTokenExpirationTime();
        if (!expirationTime) return;

        const now = Date.now();
        const refreshTime = expirationTime - this.REFRESH_BEFORE_EXPIRY_MINUTES * 60 * 1000;
        const delay = refreshTime - now;

        if (delay > 0) {
            this.refreshTimer = timer(delay)
                .pipe(switchMap(() => this.refreshToken()))
                .subscribe({
                    next: () => {
                        console.log('Token refreshed successfully');
                        this.startTokenRefreshTimer(); // Schedule next refresh
                    },
                    error: (error) => {
                        console.error('Token refresh failed:', error);
                        this.clearAuthData();
                    }
                });
        } else {
            // Token already expired or about to expire, refresh immediately
            this.refreshToken().subscribe({
                next: () => this.startTokenRefreshTimer(),
                error: () => this.clearAuthData()
            });
        }
    }

    private stopTokenRefreshTimer(): void {
        if (this.refreshTimer) {
            this.refreshTimer.unsubscribe();
            this.refreshTimer = null;
        }
    }

    private handleAuthError(error: HttpErrorResponse): Observable<never> {
        let errorMessage = 'An error occurred during authentication';

        if (error.error?.message) {
            errorMessage = error.error.message;
        } else if (error.status === 401) {
            errorMessage = 'Invalid credentials';
        } else if (error.status === 409) {
            errorMessage = 'Email already exists';
        } else if (error.status === 0) {
            errorMessage = 'Unable to connect to server';
        }

        return throwError(() => ({ message: errorMessage, status: error.status }));
    }
}
