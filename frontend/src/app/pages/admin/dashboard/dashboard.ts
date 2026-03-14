import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookService } from '../../../services/book';
import { OrderService } from '../../../services/order';
import { UserService } from '../../../services/user';
import { NavbarComponent } from '../../../components/navbar/navbar';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <main class="container admin-container">
      <div class="admin-sidebar card">
        <h3>Admin Menu</h3>
        <ul>
          <li><a routerLink="/admin/dashboard" class="active">Dashboard</a></li>
          <li><a routerLink="/admin/books">Manage Books</a></li>
          <li><a routerLink="/admin/orders">Manage Orders</a></li>
          <li><a routerLink="/admin/users">Manage Users</a></li>
        </ul>
      </div>

      <div class="admin-content">
        <h1>Dashboard Overview</h1>
        <div class="stats-grid">
          <div class="stat-card card">
            <h3>Total Books</h3>
            <p class="stat-value">{{ totalBooks }}</p>
          </div>
          <div class="stat-card card">
            <h3>Total Orders</h3>
            <p class="stat-value">{{ totalOrders }}</p>
          </div>
          <div class="stat-card card">
            <h3>Total Users</h3>
            <p class="stat-value">{{ totalUsers }}</p>
          </div>
        </div>
      </div>
    </main>
  `,
  styles: [`
    .admin-container { display: flex; gap: 30px; margin-top: 30px; }
    .admin-sidebar { width: 250px; height: fit-content; }
    .admin-sidebar ul { list-style: none; padding: 0; }
    .admin-sidebar li { margin-bottom: 10px; }
    .admin-sidebar a { text-decoration: none; color: var(--text-dark); display: block; padding: 10px; border-radius: 5px; }
    .admin-sidebar a:hover, .admin-sidebar a.active { background: var(--bg-light); color: var(--primary-blue); font-weight: bold; }
    .admin-content { flex: 1; }
    .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 30px; }
    .stat-card { text-align: center; }
    .stat-value { font-size: 2.5rem; font-weight: bold; color: var(--primary-blue); margin: 10px 0; }
  `]
})
export class DashboardComponent implements OnInit {
  totalBooks = 0;
  totalOrders = 0;
  totalUsers = 0;

  constructor(
    private bookService: BookService,
    private orderService: OrderService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.bookService.getBooks().subscribe(books => this.totalBooks = books.length);
    this.orderService.getAllOrders().subscribe(orders => this.totalOrders = orders.length);
    this.userService.getAllUsers().subscribe(users => this.totalUsers = users.length);
  }
}
