import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookService } from '../../services/book';
import { Book } from '../../models/book';
import { BookCardComponent } from '../../components/book-card/book-card';
import { NavbarComponent } from '../../components/navbar/navbar';
import { FooterComponent } from '../../components/footer/footer';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, FormsModule, BookCardComponent, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>
    <main class="container page-container">
      <div class="page-header">
        <h1>All Books</h1>
        <p>{{ books.length }} books found</p>
      </div>

      <div class="filters card">
        <div class="search-wrap">
          <span class="search-icon">🔍</span>
          <input type="text" [(ngModel)]="searchTerm" (input)="onSearch()" placeholder="Search by title...">
        </div>
        <select [(ngModel)]="selectedCategory" (change)="onSearch()">
          <option value="">All Categories</option>
          <option *ngFor="let cat of categories" [value]="cat">{{ cat }}</option>
        </select>
        <button class="btn btn-reset" (click)="reset()">Reset</button>
      </div>

      <div *ngIf="loading" class="loading-grid">
        <div class="skeleton-card" *ngFor="let i of [1,2,3,4,5,6]"></div>
      </div>

      <div *ngIf="!loading && books.length > 0" class="book-grid">
        <app-book-card *ngFor="let book of books" [book]="book"></app-book-card>
      </div>

      <div *ngIf="!loading && books.length === 0" class="empty-state">
        <p>😔 No books found for your search.</p>
        <button class="btn btn-primary" (click)="reset()">Clear Filters</button>
      </div>
    </main>
    <app-footer></app-footer>
  `,
  styles: [`
    .page-container { padding-top: 40px; }
    .page-header { margin-bottom: 25px; }
    .page-header h1 { margin: 0 0 5px; }
    .page-header p { color: var(--text-muted); margin: 0; }
    .filters { display: flex; gap: 15px; align-items: center; padding: 20px; margin-bottom: 30px; flex-wrap: wrap; }
    .search-wrap { flex: 2; position: relative; min-width: 200px; }
    .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); }
    .search-wrap input { padding-left: 38px; margin: 0; }
    select { flex: 1; min-width: 160px; margin: 0; }
    .btn-reset { background: #f1f3f5; color: var(--text-dark); border: 1px solid #dee2e6; white-space: nowrap; }
    .book-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 25px; }
    .loading-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 25px; }
    .skeleton-card { height: 380px; background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 10px; }
    @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
    .empty-state { text-align: center; padding: 80px 20px; color: var(--text-muted); }
    .empty-state p { font-size: 1.2rem; margin-bottom: 20px; }
  `]
})
export class BookListComponent implements OnInit {
  books: Book[] = [];
  searchTerm = '';
  selectedCategory = '';
  loading = true;
  categories = ['Fiction', 'Non-Fiction', 'Science', 'History', 'Technology', 'Biography'];

  constructor(private bookService: BookService) {}

  ngOnInit() {
    const urlParams = new URLSearchParams(window.location.search);
    const cat = urlParams.get('category');
    if (cat) this.selectedCategory = cat;
    this.loadBooks();
  }

  loadBooks() {
    this.loading = true;
    this.bookService.getBooks(this.searchTerm, this.selectedCategory).subscribe({
      next: (books) => { this.books = books; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  onSearch() { this.loadBooks(); }

  reset() {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.loadBooks();
  }
}
