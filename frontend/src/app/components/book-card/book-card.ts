import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Book } from '../../models/book';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="book-card">
      <div class="book-img-wrap">
        <img [src]="getImgSrc(book.image)" [alt]="book.title" class="book-img" (error)="onImgError($event)">
        <div class="book-overlay">
          <a [routerLink]="['/book', book._id]" class="overlay-btn">View Details</a>
        </div>
        <span class="category-tag">{{ book.category }}</span>
      </div>
      <div class="book-info">
        <h3 class="book-title" [title]="book.title">{{ book.title }}</h3>
        <p class="book-author">{{ book.author }}</p>
        <div class="book-footer">
          <span class="book-price">{{ book.price | currency:'INR':'symbol':'1.0-0' }}</span>
          <button class="add-btn" (click)="addToCart($event)" [title]="'Add ' + book.title + ' to cart'">
            {{ added ? '✓ Added' : '+ Cart' }}
          </button>
        </div>
        <div class="stock-indicator" *ngIf="book.stock === 0">Out of Stock</div>
      </div>
    </div>
  `,
  styles: [`
    .book-card {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0,0,0,0.08);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    .book-card:hover { transform: translateY(-6px); box-shadow: 0 12px 30px rgba(0,0,0,0.15); }
    .book-img-wrap { position: relative; overflow: hidden; }
    .book-img { width: 100%; height: 250px; object-fit: cover; transition: transform 0.4s ease; }
    .book-card:hover .book-img { transform: scale(1.05); }
    .book-overlay {
      position: absolute; inset: 0;
      background: rgba(21,101,192,0.8);
      display: flex; align-items: center; justify-content: center;
      opacity: 0; transition: 0.3s;
    }
    .book-card:hover .book-overlay { opacity: 1; }
    .overlay-btn { color: white; padding: 10px 22px; border: 2px solid white; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px; }
    .category-tag { position: absolute; top: 10px; right: 10px; background: var(--primary-blue); color: white; padding: 3px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; }
    .book-info { padding: 16px; flex-grow: 1; display: flex; flex-direction: column; }
    .book-title { font-size: 16px; font-weight: 700; margin: 0 0 5px; color: #1a1d23; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .book-author { color: #888; font-size: 13px; margin: 0 0 12px; }
    .book-footer { display: flex; justify-content: space-between; align-items: center; margin-top: auto; }
    .book-price { font-size: 1.2rem; font-weight: 800; color: var(--primary-blue); }
    .add-btn {
      background: var(--primary-blue); color: white;
      border: none; padding: 7px 14px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 13px; transition: 0.2s;
    }
    .add-btn:hover { background: var(--secondary-blue); }
    .stock-indicator { margin-top: 8px; color: #dc3545; font-size: 12px; font-weight: 600; }
  `]
})
export class BookCardComponent {
  @Input() book!: Book;
  added = false;

  constructor(private cartService: CartService) {}

  getImgSrc(img: string): string {
    if (!img) return 'https://via.placeholder.com/300x350?text=No+Cover';
    if (img.startsWith('http')) return img;
    return `http://localhost:5000${img}`;
  }

  onImgError(event: any) {
    event.target.src = 'https://via.placeholder.com/300x350?text=No+Cover';
  }

  addToCart(event: Event) {
    event.stopPropagation();
    if (this.book._id && this.book.stock > 0) {
      this.cartService.addToCart(this.book._id, 1).subscribe(() => {
        this.added = true;
        setTimeout(() => this.added = false, 2000);
      });
    }
  }
}
