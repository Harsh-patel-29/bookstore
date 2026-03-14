import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Cart } from '../models/cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:5000/api/cart';
  cartCount = signal<number>(0);

  constructor(private http: HttpClient) {
    this.updateCartCount();
  }

  getCart(): Observable<Cart> {
    return this.http.get<Cart>(this.apiUrl).pipe(
      tap(cart => this.cartCount.set(cart.items.reduce((acc, item) => acc + item.quantity, 0)))
    );
  }

  addToCart(bookId: string, quantity: number): Observable<Cart> {
    return this.http.post<Cart>(this.apiUrl, { bookId, quantity }).pipe(
      tap(() => this.updateCartCount())
    );
  }

  updateQuantity(bookId: string, quantity: number): Observable<Cart> {
    return this.http.put<Cart>(this.apiUrl, { bookId, quantity }).pipe(
      tap(() => this.updateCartCount())
    );
  }

  removeFromCart(bookId: string): Observable<Cart> {
    return this.http.delete<Cart>(`${this.apiUrl}/${bookId}`).pipe(
      tap(() => this.updateCartCount())
    );
  }

  updateCartCount() {
    this.getCart().subscribe();
  }
}
