import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { NavbarComponent } from '../../components/navbar/navbar';
import { FooterComponent } from '../../components/footer/footer';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>
    <main class="auth-page">
      <div class="auth-card">
        <div class="auth-header">
          <h2>Create Account 📚</h2>
          <p>Join thousands of book lovers today</p>
        </div>
        <form (submit)="onRegister()" #registerForm="ngForm">
          <div class="form-group">
            <label>Full Name</label>
            <input type="text" [(ngModel)]="name" name="name" placeholder="Enter your full name" required minlength="3" #nameCtrl="ngModel">
            <div *ngIf="nameCtrl.invalid && (nameCtrl.dirty || nameCtrl.touched)" class="validation-error">
              <span *ngIf="nameCtrl.errors?.['required']">Name is required.</span>
              <span *ngIf="nameCtrl.errors?.['minlength']">Name must be at least 3 characters long.</span>
            </div>
          </div>
          <div class="form-group">
            <label>Email Address</label>
            <input type="email" [(ngModel)]="email" name="email" placeholder="Enter your email" required pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$" #emailCtrl="ngModel">
            <div *ngIf="emailCtrl.invalid && (emailCtrl.dirty || emailCtrl.touched)" class="validation-error">
              <span *ngIf="emailCtrl.errors?.['required']">Email is required.</span>
              <span *ngIf="emailCtrl.errors?.['pattern']">Please enter a valid email address.</span>
            </div>
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" [(ngModel)]="password" name="password" placeholder="Min. 6 characters" required minlength="6" #pwdCtrl="ngModel">
            <div *ngIf="pwdCtrl.invalid && (pwdCtrl.dirty || pwdCtrl.touched)" class="validation-error">
              <span *ngIf="pwdCtrl.errors?.['required']">Password is required.</span>
              <span *ngIf="pwdCtrl.errors?.['minlength']">Password must be at least 6 characters long.</span>
            </div>
          </div>
          <div *ngIf="errorMsg" class="error-msg">{{ errorMsg }}</div>
          <div *ngIf="successMsg" class="success-msg">{{ successMsg }}</div>
          <button type="submit" class="btn btn-primary w-100" [disabled]="loading || registerForm.invalid">
            {{ loading ? 'Creating Account...' : 'Create Account' }}
          </button>
        </form>
        <p class="auth-footer">Already have an account? <a routerLink="/login">Login here</a></p>
      </div>
    </main>
    <app-footer></app-footer>
  `,
  styles: [`
    .auth-page { min-height: 80vh; display: flex; align-items: center; justify-content: center; padding: 40px 20px; }
    .auth-card { width: 100%; max-width: 420px; background: white; border-radius: 16px; padding: 40px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); }
    .auth-header { text-align: center; margin-bottom: 30px; }
    .auth-header h2 { margin: 0 0 8px; color: var(--text-dark); }
    .auth-header p { color: var(--text-muted); margin: 0; }
    .form-group { margin-bottom: 20px; }
    .form-group label { display: block; font-weight: 600; font-size: 14px; margin-bottom: 6px; }
    .form-group input { margin: 0; width: 100%; box-sizing: border-box; padding: 10px; border-radius: 8px; border: 1.5px solid #ddd; transition: border-color 0.2s; }
    .form-group input:focus { outline: none; border-color: var(--primary-blue); }
    .form-group input.ng-invalid.ng-touched { border-color: #dc2626; }
    .validation-error { color: #dc2626; font-size: 12px; margin-top: 5px; }
    .error-msg { background: #fee2e2; color: #dc2626; padding: 10px 15px; border-radius: 8px; margin-bottom: 15px; font-size: 14px; }
    .success-msg { background: #d1fae5; color: #065f46; padding: 10px 15px; border-radius: 8px; margin-bottom: 15px; font-size: 14px; }
    .w-100 { width: 100%; padding: 13px; font-size: 16px; border-radius: 8px; border: none; background: var(--primary-blue); color: white; cursor: pointer; }
    button:disabled { opacity: 0.6; cursor: not-allowed; }
    .auth-footer { text-align: center; margin-top: 20px; font-size: 14px; color: var(--text-muted); }
    .auth-footer a { color: var(--primary-blue); text-decoration: none; font-weight: 600; }
  `]
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  loading = false;
  errorMsg = '';
  successMsg = '';

  constructor(private authService: AuthService, private router: Router) {}

  onRegister() {
    this.loading = true;
    this.errorMsg = '';
    
    // Additional validation just in case
    if (this.name.trim().length < 3) {
      this.errorMsg = 'Name must be at least 3 characters long.';
      this.loading = false;
      return;
    }
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(this.email)) {
      this.errorMsg = 'Please enter a valid email address.';
      this.loading = false;
      return;
    }
    if (this.password.length < 6) {
      this.errorMsg = 'Password must be at least 6 characters long.';
      this.loading = false;
      return;
    }

    this.authService.register({ name: this.name, email: this.email, password: this.password }).subscribe({
      next: () => {
        this.successMsg = 'Registration successful! Redirecting to login...';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        this.errorMsg = err.error?.error || 'Registration failed. Please try again.';
        this.loading = false;
      }
    });
  }
}
