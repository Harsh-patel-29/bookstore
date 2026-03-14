import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BookService } from '../../services/book';
import { CartService } from '../../services/cart';
import { Book } from '../../models/book';
import { NavbarComponent } from '../../components/navbar/navbar';
import { FooterComponent } from '../../components/footer/footer';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>
    <main class="container page-container" *ngIf="book; else loading">
      <a routerLink="/books" class="back-link">← Back to Books</a>
      <div class="details-grid">
        <div class="image-section">
          <img [src]="getImgSrc(book.image)" [alt]="book.title" (error)="onImgError($event)">
          <span class="category-badge">{{ book.category }}</span>
        </div>
        <div class="info-section">
          <h1>{{ book.title }}</h1>
          <p class="author">By <strong>{{ book.author }}</strong></p>
          <div class="price-row">
            <span class="price">{{ book.price | currency:'INR':'symbol':'1.0-0' }}</span>
            <span class="stock-badge" [class.in-stock]="book.stock > 0" [class.out-stock]="book.stock === 0">
              {{ book.stock > 0 ? '✓ In Stock (' + book.stock + ')' : '✗ Out of Stock' }}
            </span>
          </div>
          <hr>
          <h3>About this book</h3>
          <p class="description">{{ book.description }}</p>
          <div class="action-buttons">
            <button class="btn btn-primary btn-large" (click)="addToCart()" [disabled]="book.stock === 0">
              🛒 Add to Cart
            </button>
            <a routerLink="/cart" class="btn btn-outline">View Cart</a>
          </div>
          <div *ngIf="addedToCart" class="success-msg">✓ Added to cart successfully!</div>
        </div>
      </div>
    </main>
    <ng-template #loading>
      <div class="center">
        <div class="spinner"></div>
        <p>Loading book details...</p>
      </div>
    </ng-template>
    <app-footer></app-footer>
  `,
  styles: [`
    .page-container { padding-top: 30px; }
    .back-link { color: var(--primary-blue); text-decoration: none; font-weight: 500; display: inline-block; margin-bottom: 25px; }
    .back-link:hover { text-decoration: underline; }
    .details-grid { display: grid; grid-template-columns: 1fr 1.5fr; gap: 50px; }
    .image-section { position: relative; }
    .image-section img { width: 100%; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.15); }
    .category-badge { position: absolute; top: 15px; left: 15px; background: var(--primary-blue); color: white; padding: 5px 12px; border-radius: 20px; font-size: 13px; font-weight: 600; }
    .info-section h1 { font-size: 2rem; margin-bottom: 10px; color: var(--text-dark); }
    .author { font-size: 1.1rem; color: var(--text-muted); margin-bottom: 20px; }
    .price-row { display: flex; align-items: center; gap: 20px; margin-bottom: 20px; }
    .price { font-size: 2.2rem; font-weight: 800; color: var(--primary-blue); }
    .stock-badge { padding: 6px 14px; border-radius: 20px; font-size: 14px; font-weight: 600; }
    .in-stock { background: #d4edda; color: #155724; }
    .out-stock { background: #f8d7da; color: #721c24; }
    hr { border: none; border-top: 1px solid #eee; margin: 20px 0; }
    .description { line-height: 1.8; color: var(--text-muted); font-size: 1rem; margin-bottom: 30px; }
    .action-buttons { display: flex; gap: 15px; align-items: center; }
    .btn-large { padding: 14px 30px; font-size: 16px; }
    .btn-outline { display: inline-block; padding: 14px 30px; border: 2px solid var(--primary-blue); color: var(--primary-blue); border-radius: 5px; text-decoration: none; font-weight: 600; transition: 0.3s; }
    .btn-outline:hover { background: var(--primary-blue); color: white; }
    .success-msg { margin-top: 15px; color: #155724; background: #d4edda; padding: 10px 15px; border-radius: 5px; font-weight: 500; }
    .center { text-align: center; padding: 100px; }
    .spinner { width: 40px; height: 40px; border: 4px solid #e0e0e0; border-top-color: var(--primary-blue); border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 15px; }
    @keyframes spin { to { transform: rotate(360deg); } }
    button:disabled { opacity: 0.5; cursor: not-allowed; }
    @media (max-width: 768px) { .details-grid { grid-template-columns: 1fr; } }
  `]
})
export class BookDetailsComponent implements OnInit {
  book: Book | null = null;
  addedToCart = false;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.bookService.getBook(id).subscribe(book => { this.book = book; });
    }
  }

  getImgSrc(img: string): string {
    if (!img) return 'https://via.placeholder.com/400x500?text=No+Cover';
    if (img.startsWith('http')) return img;
    return `http://localhost:5000${img}`;
  }

  onImgError(event: any) {
    event.target.src = 'https://via.placeholder.com/400x500?text=No+Cover';
  }

  addToCart() {
    if (this.book?._id) {
      this.cartService.addToCart(this.book._id, 1).subscribe(() => {
        this.addedToCart = true;
        setTimeout(() => this.addedToCart = false, 3000);
      });
    }
  }
}
