import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookService } from '../../services/book';
import { Book } from '../../models/book';
import { BookCardComponent } from '../../components/book-card/book-card';
import { NavbarComponent } from '../../components/navbar/navbar';
import { FooterComponent } from '../../components/footer/footer';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, BookCardComponent, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>
    <main>
      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-content">
          <h1>📚 Discover Your Next<br>Favorite Book</h1>
          <p>Explore thousands of books across every genre. From bestsellers to hidden gems — find your perfect read today.</p>
          <div class="hero-buttons">
            <a href="/books" class="btn-hero-primary">Browse Books</a>
            <a href="/register" class="btn-hero-secondary">Join Free</a>
          </div>
        </div>
      </section>

      <!-- Stats Banner -->
      <div class="stats-banner">
        <div class="stat"><span>10,000+</span><label>Books Available</label></div>
        <div class="stat"><span>5,000+</span><label>Happy Readers</label></div>
        <div class="stat"><span>50+</span><label>Categories</label></div>
      </div>

      <!-- Featured Books -->
      <section class="featured container">
        <div class="section-header">
          <h2>Featured Books</h2>
          <a href="/books" class="view-all">View All →</a>
        </div>
        <div *ngIf="loading" class="loading-grid">
          <div class="skeleton-card" *ngFor="let i of [1,2,3,4]"></div>
        </div>
        <div *ngIf="!loading" class="book-grid">
          <app-book-card *ngFor="let book of featuredBooks" [book]="book"></app-book-card>
        </div>
        <div *ngIf="!loading && featuredBooks.length === 0" class="no-books">
          <p>No books found. <a href="/admin/add-book">Add some books</a> to get started!</p>
        </div>
      </section>

      <!-- Categories -->
      <section class="categories-section">
        <div class="container">
          <h2>Browse by Category</h2>
          <div class="categories-grid">
            <div class="category-card" *ngFor="let cat of categories" (click)="goToCategory(cat.name)">
              <span class="cat-icon">{{ cat.icon }}</span>
              <p>{{ cat.name }}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
    <app-footer></app-footer>
  `,
  styles: [`
    /* Hero */
    .hero {
      background: linear-gradient(135deg, #0d47a1 0%, #1565c0 50%, #1976d2 100%);
      color: white;
      padding: 100px 20px;
      text-align: center;
    }
    .hero-content { max-width: 700px; margin: 0 auto; }
    .hero h1 { font-size: 3rem; font-weight: 800; margin-bottom: 20px; line-height: 1.2; color: white; }
    .hero p { font-size: 1.2rem; opacity: 0.9; margin-bottom: 35px; line-height: 1.7; }
    .hero-buttons { display: flex; gap: 15px; justify-content: center; flex-wrap: wrap; }
    .btn-hero-primary { background: white; color: #1565c0; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 16px; transition: 0.3s; }
    .btn-hero-primary:hover { background: #e3f2fd; transform: translateY(-2px); }
    .btn-hero-secondary { border: 2px solid white; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; transition: 0.3s; }
    .btn-hero-secondary:hover { background: rgba(255,255,255,0.1); transform: translateY(-2px); }
    /* Stats */
    .stats-banner { display: flex; justify-content: center; gap: 60px; padding: 40px 20px; background: #f8f9fa; flex-wrap: wrap; }
    .stat { text-align: center; }
    .stat span { display: block; font-size: 2rem; font-weight: 800; color: var(--primary-blue); }
    .stat label { color: var(--text-muted); font-size: 14px; }
    /* Featured */
    .featured { padding: 60px 20px; }
    .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
    .section-header h2 { font-size: 1.8rem; }
    .view-all { color: var(--primary-blue); text-decoration: none; font-weight: 600; }
    .book-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 25px; }
    .loading-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 25px; }
    .skeleton-card { height: 380px; background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 10px; }
    @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
    .no-books { text-align: center; padding: 60px; color: var(--text-muted); }
    /* Categories */
    .categories-section { background: #f0f4ff; padding: 60px 20px; }
    .categories-section h2 { text-align: center; font-size: 1.8rem; margin-bottom: 30px; }
    .categories-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 20px; max-width: 900px; margin: 0 auto; }
    .category-card { background: white; border-radius: 12px; padding: 25px 15px; text-align: center; cursor: pointer; transition: 0.3s; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
    .category-card:hover { transform: translateY(-5px); box-shadow: 0 8px 20px rgba(21,101,192,0.15); }
    .cat-icon { font-size: 2.5rem; display: block; margin-bottom: 10px; }
    .category-card p { font-weight: 600; color: var(--text-dark); margin: 0; }
  `]
})
export class HomeComponent implements OnInit {
  featuredBooks: Book[] = [];
  loading = true;
  categories = [
    { name: 'Fiction', icon: '📖' },
    { name: 'Non-Fiction', icon: '📰' },
    { name: 'Science', icon: '🔬' },
    { name: 'History', icon: '🏛️' },
    { name: 'Technology', icon: '💻' },
    { name: 'Biography', icon: '👤' },
  ];

  constructor(private bookService: BookService) {}

  ngOnInit() {
    this.bookService.getBooks().subscribe({
      next: (books) => {
        this.featuredBooks = books.slice(0, 4);
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  goToCategory(name: string) {
    window.location.href = `/books?category=${name}`;
  }
}
