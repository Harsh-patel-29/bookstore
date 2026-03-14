import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../../services/order';
import { Order } from '../../../models/order';
import { NavbarComponent } from '../../../components/navbar/navbar';

@Component({
  selector: 'app-manage-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <main class="container admin-container">
      <div class="admin-sidebar card">
        <h3>Admin Menu</h3>
        <ul>
          <li><a routerLink="/admin/dashboard">Dashboard</a></li>
          <li><a routerLink="/admin/books">Manage Books</a></li>
          <li><a routerLink="/admin/orders" class="active">Manage Orders</a></li>
          <li><a routerLink="/admin/users">Manage Users</a></li>
        </ul>
      </div>

      <div class="admin-content">
        <h1>Manage Orders</h1>
        <p class="subtitle">{{ orders.length }} total orders</p>

        <div class="card table-card">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>User</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let order of orders">
                <td class="order-id">{{ order._id }}</td>
                <td>
                  <span class="user-name">{{ order.userId?.name }}</span><br>
                  <small class="user-email">{{ order.userId?.email }}</small>
                </td>
                <td><strong class="total-price">{{ order.totalPrice | currency:'INR':'symbol':'1.0-0' }}</strong></td>
                <td>
                  <select (change)="onStatusChange(order._id!, $any($event.target).value)" [value]="order.status" class="status-select">
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
                <td>{{ order.createdAt | date:'mediumDate' }}</td>
                <td>
                  <button class="btn-view" (click)="viewOrderDetails(order)">View Items</button>
                </td>
              </tr>
            </tbody>
          </table>
          <div *ngIf="orders.length === 0" class="empty-state">
            <p>No orders found.</p>
          </div>
        </div>
      </div>
    </main>
  `,
  styles: [`
    .admin-container { display: flex; gap: 30px; margin-top: 30px; min-height: 70vh; }
    .admin-sidebar { width: 250px; height: fit-content; }
    .admin-sidebar ul { list-style: none; padding: 0; margin: 0; }
    .admin-sidebar li { margin-bottom: 5px; }
    .admin-sidebar a { text-decoration: none; color: var(--text-dark); display: block; padding: 10px 15px; border-radius: 5px; transition: 0.2s; }
    .admin-sidebar a:hover, .admin-sidebar a.active { background: #e8f0fe; color: var(--primary-blue); font-weight: bold; }
    .admin-content { flex: 1; }
    .subtitle { color: var(--text-muted); margin: -10px 0 20px; }
    table { width: 100%; border-collapse: collapse; }
    th { padding: 12px 15px; text-align: left; background: #f8f9fa; color: var(--text-muted); font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; }
    td { padding: 15px; text-align: left; border-bottom: 1px solid #eee; vertical-align: middle; }
    .order-id { font-family: monospace; font-size: 12px; color: var(--text-muted); max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .user-name { font-weight: 500; }
    .user-email { color: var(--text-muted); font-size: 12px; }
    .status-select { padding: 6px 10px; border: 1px solid #ddd; border-radius: 5px; cursor: pointer; font-size: 14px; background: white; }
    .btn-view { color: var(--primary-blue); border: 1px solid var(--primary-blue); background: white; cursor: pointer; padding: 5px 12px; border-radius: 4px; font-size: 13px; transition: 0.2s; }
    .btn-view:hover { background: var(--primary-blue); color: white; }
    .empty-state { text-align: center; padding: 40px; color: var(--text-muted); }
  `]
})
export class ManageOrdersComponent implements OnInit {
  orders: Order[] = [];

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getAllOrders().subscribe(orders => this.orders = orders);
  }

  onStatusChange(orderId: string, status: string) {
    this.orderService.updateOrderStatus(orderId, status).subscribe(() => {
      this.loadOrders();
    });
  }

  viewOrderDetails(order: Order) {
    const details = order.books.map(b => `• ${b.bookId.title} x ${b.quantity} @ ₹${b.price}`).join('\n');
    alert(`Order Items:\n\n${details}\n\nTotal: ₹${order.totalPrice}\nShipping To: ${order.address}`);
  }
}
