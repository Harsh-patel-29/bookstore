import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user';
import { AuthService } from '../../services/auth';
import { User } from '../../models/user';
import { NavbarComponent } from '../../components/navbar/navbar';
import { FooterComponent } from '../../components/footer/footer';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, RouterLink],
  template: `
    <app-navbar></app-navbar>
    <main class="container page-container">
      <div class="profile-header">
        <h1>👤 My Profile</h1>
        <p>Manage your account details and preferences</p>
      </div>

      <div *ngIf="loading" class="center-content">
        <div class="spinner"></div>
        <p>Fetching your details...</p>
      </div>

      <div class="card profile-card" *ngIf="!loading && user">
        <div class="profile-grid">
          <div class="info-group">
            <label>Full Name</label>
            <div class="info-box">{{ user.name }}</div>
          </div>
          <div class="info-group">
            <label>Email Address</label>
            <div class="info-box">{{ user.email }}</div>
          </div>
          <div class="info-group">
            <label>Account Role</label>
            <div class="info-box role-badge" [class.admin-role]="user.role === 'admin'">
              {{ user.role === 'admin' ? '🛡️ Administrator' : '👤 Customer' }}
            </div>
          </div>
          <div class="info-group">
            <label>Joined On</label>
            <div class="info-box date-box">{{ user.createdAt | date:'mediumDate' }}</div>
          </div>
        </div>
        <div class="profile-footer">
          <button class="btn btn-outline" (click)="logout()">Logout of All Devices</button>
        </div>
      </div>

      <div *ngIf="!loading && !user" class="empty-state">
        <p>Unable to load profile data.</p>
        <button class="btn btn-primary" routerLink="/login">Go to Login</button>
      </div>
    </main>
    <app-footer></app-footer>
  `,
  styles: [`
    .page-container { padding: 40px 20px; min-height: 70vh; }
    .profile-header { margin-bottom: 30px; }
    .profile-header h1 { margin-bottom: 5px; }
    .profile-header p { color: var(--text-muted); }
    .profile-card { max-width: 800px; padding: 40px; margin-bottom: 50px; }
    .profile-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
    .info-group label { display: block; font-weight: 700; font-size: 14px; color: var(--text-muted); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
    .info-box { background: #f8f9fa; border: 1px solid #e9ecef; padding: 12px 16px; border-radius: 8px; font-weight: 500; font-size: 16px; color: var(--text-dark); }
    .role-badge { display: inline-block; background: #e0e7ff; color: #4338ca; border: none; }
    .admin-role { background: #fef3c7; color: #92400e; }
    .profile-footer { margin-top: 40px; border-top: 1px solid #eee; padding-top: 30px; }
    .btn-outline { background: white; border: 1.5px solid #dee2e6; color: var(--text-dark); padding: 12px 24px; border-radius: 8px; cursor: pointer; transition: 0.2s; }
    .btn-outline:hover { background: #f8f9fa; border-color: #ced4da; color: var(--error); }
    .center-content { text-align: center; padding: 100px 0; }
    .spinner { width: 40px; height: 40px; border: 4px solid #eee; border-top-color: var(--primary-blue); border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 20px; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .empty-state { text-align: center; padding: 100px 0; }
    @media (max-width: 600px) { .profile-grid { grid-template-columns: 1fr; } }
  `]
})
export class UserProfileComponent implements OnInit {
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private router = inject(Router);

  user: any = null;
  loading = true;

  ngOnInit() {
    this.userService.getProfile().subscribe({
      next: (user) => {
        this.user = user;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.user = null;
      }
    });
  }

  logout() {
    this.authService.logout();
  }
}
