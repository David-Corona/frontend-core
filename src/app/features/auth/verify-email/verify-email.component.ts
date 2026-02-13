import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AuthService } from '@/app/core/auth/services/auth.service';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    MessageModule,
    ProgressSpinnerModule
  ],
  templateUrl: './verify-email.component.html'
})
export class VerifyEmailComponent implements OnInit {
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  loading = signal(true);
  success = signal(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    // Get token from query params
    this.route.queryParams.subscribe(params => {
      const token = params['token'];

      if (!token) {
        this.loading.set(false);
        this.error.set('Invalid or missing verification token');
        return;
      }

      // Verify email with token
      this.authService.verifyEmail({ token }).subscribe({
        next: () => {
          this.loading.set(false);
          this.success.set(true);
          // Redirect to login after 3 seconds
          setTimeout(() => {
            this.router.navigate(['/auth/login']);
          }, 3000);
        },
        error: (err) => {
          this.loading.set(false);
          this.error.set(err.message || 'Verification failed. The link may be expired.');
        }
      });
    });
  }
}
