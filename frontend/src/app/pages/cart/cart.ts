import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart';
import { Cart } from '../../models/cart';
import { NavbarComponent } from '../../components/navbar/navbar';
import { FooterComponent } from '../../components/footer/footer';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>
    <main class="container page-container">
      <h1>🛒 Shopping Cart</h1>

      <div *ngIf="cart && cart.items && cart.items.length > 0; else emptyCart" class="cart-layout">
        <!-- Cart Items -->
        <div class="cart-items">
          <div class="cart-item card" *ngFor="let item of cart.items">
            <img [src]="getImgSrc(item.bookId.image)" [alt]="item.bookId.title" class="item-img" (error)="onImgError($event)">
            <div class="item-info">
              <h3>{{ item.bookId.title }}</h3>
              <p class="item-author">{{ item.bookId.author }}</p>
              <p class="item-price">{{ item.bookId.price | currency:'INR':'symbol':'1.0-0' }} each</p>
            </div>
            <div class="item-qty">
              <button class="qty-btn" (click)="updateQty(item.bookId._id!, item.quantity - 1)">−</button>
              <span class="qty-value">{{ item.quantity }}</span>
              <button class="qty-btn" (click)="updateQty(item.bookId._id!, item.quantity + 1)">+</button>
            </div>
            <div class="item-total">
              {{ (item.bookId.price * item.quantity) | currency:'INR':'symbol':'1.0-0' }}
            </div>
            <button class="remove-btn" (click)="removeItem(item.bookId._id!)" title="Remove">✕</button>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="order-summary card">
          <h3>Order Summary</h3>
          <div class="summary-row" *ngFor="let item of cart.items">
            <span>{{ item.bookId.title }} × {{ item.quantity }}</span>
            <span>{{ (item.bookId.price * item.quantity) | currency:'INR':'symbol':'1.0-0' }}</span>
          </div>
          <hr>
          <div class="summary-total">
            <span>Total</span>
            <strong>{{ getTotal() | currency:'INR':'symbol':'1.0-0' }}</strong>
          </div>
          <a routerLink="/checkout" class="btn btn-primary checkout-btn">Proceed to Checkout →</a>
          <a routerLink="/books" class="continue-shopping">← Continue Shopping</a>
        </div>
      </div>

      <ng-template #emptyCart>
        <div class="empty-state">
          <div class="empty-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added any books yet.</p>
          <a routerLink="/books" class="btn btn-primary">Browse Books</a>
        </div>
      </ng-template>
    </main>
    <app-footer></app-footer>
  `,
  styles: [`
    .page-container { padding: 40px 20px; }
    h1 { margin-bottom: 30px; }
    .cart-layout { display: grid; grid-template-columns: 1fr 350px; gap: 30px; }
    .cart-items { display: flex; flex-direction: column; gap: 15px; }
    .cart-item { display: flex; align-items: center; gap: 20px; padding: 20px; }
    .item-img { width: 80px; height: 100px; object-fit: cover; border-radius: 6px; flex-shrink: 0; }
    .item-info { flex-grow: 1; }
    .item-info h3 { margin: 0 0 5px; font-size: 16px; }
    .item-author { color: var(--text-muted); font-size: 13px; margin: 0 0 5px; }
    .item-price { color: var(--primary-blue); font-weight: 600; margin: 0; }
    .item-qty { display: flex; align-items: center; gap: 12px; border: 1px solid #ddd; border-radius: 8px; padding: 4px 10px; }
    .qty-btn { background: none; border: none; font-size: 18px; cursor: pointer; color: var(--text-dark); line-height: 1; padding: 0 4px; }
    .qty-btn:hover { color: var(--primary-blue); }
    .qty-value { font-weight: 700; font-size: 16px; min-width: 20px; text-align: center; }
    .item-total { font-weight: 700; font-size: 16px; min-width: 80px; text-align: right; }
    .remove-btn { background: none; border: none; color: #ccc; font-size: 18px; cursor: pointer; transition: 0.2s; }
    .remove-btn:hover { color: var(--error); }
    .order-summary { padding: 25px; height: fit-content; }
    .order-summary h3 { margin: 0 0 20px; }
    .summary-row { display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 10px; color: var(--text-muted); }
    hr { border: none; border-top: 1px solid #eee; margin: 15px 0; }
    .summary-total { display: flex; justify-content: space-between; font-size: 1.2rem; margin-bottom: 20px; }
    .checkout-btn { display: block; width: 100%; text-align: center; padding: 14px; font-size: 16px; border-radius: 8px; text-decoration: none; }
    .continue-shopping { display: block; text-align: center; margin-top: 15px; color: var(--primary-blue); text-decoration: none; font-size: 14px; }
    .empty-state { text-align: center; padding: 80px 20px; }
    .empty-icon { font-size: 5rem; margin-bottom: 20px; }
    .empty-state h2 { margin-bottom: 10px; }
    .empty-state p { color: var(--text-muted); margin-bottom: 30px; }
    @media (max-width: 768px) { .cart-layout { grid-template-columns: 1fr; } .cart-item { flex-wrap: wrap; } }
  `]
})
export class CartComponent implements OnInit {
  cart: Cart | null = null;

  constructor(private cartService: CartService) {}

  ngOnInit() { this.loadCart(); }

  loadCart() {
    this.cartService.getCart().subscribe(cart => { this.cart = cart; });
  }

  updateQty(bookId: string, qty: number) {
    if (qty <= 0) {
      this.removeItem(bookId);
    } else {
      this.cartService.updateQuantity(bookId, qty).subscribe(() => this.loadCart());
    }
  }

  removeItem(bookId: string) {
    this.cartService.removeFromCart(bookId).subscribe(() => this.loadCart());
  }

  getTotal() {
    return this.cart?.items.reduce((acc, item) => acc + (item.bookId.price * item.quantity), 0) || 0;
  }

  getImgSrc(img: string): string {
    if (!img) return 'https://via.placeholder.com/80x100?text=?';
    if (img.startsWith('http')) return img;
    return `http://localhost:5000${img}`;
  }

  onImgError(event: any) {
    event.target.src = 'https://via.placeholder.com/80x100?text=?';
  }
}
