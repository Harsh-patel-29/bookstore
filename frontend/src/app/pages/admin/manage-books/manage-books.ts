import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookService } from '../../../services/book';
import { Book } from '../../../models/book';
import { NavbarComponent } from '../../../components/navbar/navbar';

@Component({
  selector: 'app-manage-books',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <main class="container admin-container">
      <div class="admin-sidebar card">
        <h3>Admin Menu</h3>
        <ul>
          <li><a routerLink="/admin/dashboard">Dashboard</a></li>
          <li><a routerLink="/admin/books" class="active">Manage Books</a></li>
          <li><a routerLink="/admin/orders">Manage Orders</a></li>
          <li><a routerLink="/admin/users">Manage Users</a></li>
        </ul>
      </div>

      <div class="admin-content">
        <div class="header-row">
          <h1>Manage Books</h1>
          <a routerLink="/admin/add-book" class="btn btn-primary">Add New Book</a>
        </div>

        <div class="card table-card">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let book of books">
                <td>{{ book.title }}</td>
                <td>{{ book.author }}</td>
                <td>{{ book.price | currency:'INR':'symbol':'1.0-0' }}</td>
                <td>{{ book.stock }}</td>
                <td class="actions">
                  <a [routerLink]="['/admin/edit-book', book._id]" class="btn-edit">Edit</a>
                  <button (click)="deleteBook(book._id!)" class="btn-delete">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
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
    .admin-sidebar a.active { background: var(--bg-light); color: var(--primary-blue); font-weight: bold; }
    .admin-content { flex: 1; }
    .header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 15px; text-align: left; border-bottom: 1px solid #eee; }
    .btn-edit { color: var(--primary-blue); margin-right: 15px; text-decoration: none; }
    .btn-delete { color: var(--error); border: none; background: none; cursor: pointer; }
  `]
})
export class ManageBooksComponent implements OnInit {
  books: Book[] = [];

  constructor(private bookService: BookService) {}

  ngOnInit() {
    this.loadBooks();
  }

  loadBooks() {
    this.bookService.getBooks().subscribe(books => this.books = books);
  }

  deleteBook(id: string) {
    if (confirm('Are you sure you want to delete this book?')) {
      this.bookService.deleteBook(id).subscribe(() => {
        this.loadBooks();
      });
    }
  }
}
