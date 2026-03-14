import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { NavbarComponent } from '../../../components/navbar/navbar';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <main class="auth-page">
      <div class="auth-card">
        <div class="auth-header">
          <div class="admin-icon">⚙️</div>
          <h2>Admin Login</h2>
          <p>Restricted area — administrators only</p>
        </div>
        <form (submit)="onLogin()">
          <div class="form-group">
            <label>Admin Email</label>
            <input type="email" [(ngModel)]="email" name="email" placeholder="admin@example.com" required>
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" [(ngModel)]="password" name="password" placeholder="••••••••" required>
          </div>
          <div *ngIf="errorMsg" class="error-msg">{{ errorMsg }}</div>
          <button type="submit" class="btn-admin w-100" [disabled]="loading">
            {{ loading ? 'Authenticating...' : 'Login to Admin Panel' }}
          </button>
        </form>
      </div>
    </main>
  `,
  styles: [`
    .auth-page { min-height: 80vh; display: flex; align-items: center; justify-content: center; background: #f0f4ff; padding: 40px 20px; }
    .auth-card { 
      width: 100%; max-width: 400px; background: white; border-radius: 16px; padding: 40px; box-shadow: 0 10px 40px rgba(0,0,0,0.12);
      border-top: 5px solid var(--primary-blue);
    }
    .auth-header { text-align: center; margin-bottom: 30px; }
    .admin-icon { font-size: 3rem; margin-bottom: 10px; }
    .auth-header h2 { margin: 0 0 5px; }
    .auth-header p { color: var(--text-muted); margin: 0; font-size: 14px; }
    .form-group { margin-bottom: 20px; }
    .form-group label { display: block; font-weight: 600; font-size: 14px; margin-bottom: 6px; }
    .form-group input { margin: 0; }
    .error-msg { background: #fee2e2; color: #dc2626; padding: 10px 15px; border-radius: 8px; margin-bottom: 15px; font-size: 14px; }
    .btn-admin { background: #1e3a8a; color: white; border: none; cursor: pointer; border-radius: 8px; font-size: 15px; font-weight: 600; transition: 0.2s; }
    .btn-admin:hover { background: #1d4ed8; }
    .w-100 { display: block; width: 100%; padding: 13px; }
    button:disabled { opacity: 0.6; cursor: not-allowed; }
  `]
})
export class AdminLoginComponent {
  email = '';
  password = '';
  loading = false;
  errorMsg = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.loading = true;
    this.errorMsg = '';
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        if (res.user.role === 'admin') {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.errorMsg = 'Access denied. This area is for administrators only.';
          this.authService.logout();
          this.loading = false;
        }
      },
      error: (err) => {
        this.errorMsg = err.error?.error || 'Login failed.';
        this.loading = false;
      }
    });
  }
}
