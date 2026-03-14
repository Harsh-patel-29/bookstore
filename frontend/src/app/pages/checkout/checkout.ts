import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart';
import { OrderService } from '../../services/order';
import { Cart } from '../../models/cart';
import { NavbarComponent } from '../../components/navbar/navbar';
import { FooterComponent } from '../../components/footer/footer';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>
    <main class="container">
      <h1>Checkout</h1>
      <div class="checkout-grid">
        <div class="form-section card">
          <h3>Shipping Information</h3>
          <form (submit)="placeOrder()" #checkoutForm="ngForm">
            <div class="form-group">
              <label>Full Address</label>
              <textarea [(ngModel)]="address" name="address" required minlength="10" #addressCtrl="ngModel" placeholder="Enter your full shipping address"></textarea>
              <div *ngIf="addressCtrl.invalid && (addressCtrl.dirty || addressCtrl.touched)" class="validation-error">
                <span *ngIf="addressCtrl.errors?.['required']">Address is required.</span>
                <span *ngIf="addressCtrl.errors?.['minlength']">Address must be at least 10 characters long.</span>
              </div>
            </div>
            
            <div *ngIf="errorMsg" class="error-msg" style="margin-top: 10px;">{{ errorMsg }}</div>
            <button type="submit" class="btn btn-primary w-100 mt-3" [disabled]="checkoutForm.invalid || loading">
              {{ loading ? 'Placing Order...' : 'Place Order' }}
            </button>
          </form>
        </div>
        <div class="summary-section card">
          <h3>Order Summary</h3>
          <div *ngIf="cart">
            <div class="summary-item" *ngFor="let item of cart.items">
              <span>{{ item.bookId.title }} x {{ item.quantity }}</span>
              <span>{{ (item.bookId.price * item.quantity) | currency:'INR':'symbol':'1.0-0' }}</span>
            </div>
            <hr>
            <div class="summary-total">
              <strong>Total</strong>
              <strong>{{ getTotal() | currency:'INR':'symbol':'1.0-0' }}</strong>
            </div>
          </div>
        </div>
      </div>
    </main>
    <app-footer></app-footer>
  `,
  styles: [`
    .checkout-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 30px; margin-top: 30px; }
    .summary-item { display: flex; justify-content: space-between; margin-bottom: 10px; }
    .summary-total { display: flex; justify-content: space-between; font-size: 1.2rem; margin-top: 20px; }
    .form-group { margin-bottom: 20px; }
    .form-group label { display: block; font-weight: 600; margin-bottom: 5px; }
    textarea { width: 100%; box-sizing: border-box; padding: 10px; border: 1.5px solid #ddd; border-radius: 8px; resize: vertical; height: 100px; }
    textarea.ng-invalid.ng-touched { border-color: #dc2626; }
    .validation-error { color: #dc2626; font-size: 12px; margin-top: 5px; }
    .error-msg { background: #fee2e2; color: #dc2626; padding: 10px 15px; border-radius: 8px; font-size: 14px; }
    .w-100 { width: 100%; padding: 13px; font-size: 16px; border-radius: 8px; font-weight: bold; }
    .mt-3 { margin-top: 15px; }
    button:disabled { opacity: 0.6; cursor: not-allowed; }
  `]
})
export class CheckoutComponent implements OnInit {
  cart: Cart | null = null;
  address = '';
  loading = false;
  errorMsg = '';

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cartService.getCart().subscribe(cart => {
      this.cart = cart;
      if (!cart || cart.items.length === 0) {
        this.router.navigate(['/cart']);
      }
    });
  }

  getTotal() {
    return this.cart?.items.reduce((acc, item) => acc + (item.bookId.price * item.quantity), 0) || 0;
  }

  placeOrder() {
    this.errorMsg = '';
    
    if (!this.address || this.address.trim().length < 10) {
      this.errorMsg = 'Please enter a valid shipping address (at least 10 characters).';
      return;
    }

    this.loading = true;
    const orderData = {
      books: this.cart?.items.map(item => ({
        bookId: item.bookId._id,
        quantity: item.quantity,
        price: item.bookId.price
      })),
      totalPrice: this.getTotal(),
      address: this.address
    };

    this.orderService.placeOrder(orderData).subscribe({
      next: () => {
        this.loading = false;
        alert('Order placed successfully!');
        this.router.navigate(['/orders']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err.error?.error || 'Failed to place order.';
      }
    });
  }
}
